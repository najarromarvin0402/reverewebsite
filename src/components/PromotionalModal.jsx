import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Phone, 
  ExternalLink, 
  Tag, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { 
  getClinicSettings, 
  getPromoModalStatus, 
  getMediaItem, 
  formatVideoEmbedUrl 
} from '../lib/settings';

export default function PromotionalModal({ forceOpen = false, previewData = null, onClose = null }) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [settings, setSettings] = useState(getClinicSettings());
  const [videoBlobUrl, setVideoBlobUrl] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  // Use preview data if provided (for Admin live preview)
  const promo = previewData || settings.promoModal;

  // Resolve video blob URL if stored in IndexedDB or direct link
  useEffect(() => {
    let activeUrl = null;
    if (promo?.contentType === 'video' && promo?.videoUrl) {
      if (promo.videoUrl.startsWith('idb:')) {
        const key = promo.videoUrl.replace('idb:', '');
        getMediaItem(key).then(blob => {
          if (blob) {
            activeUrl = URL.createObjectURL(blob);
            setVideoBlobUrl(activeUrl);
          }
        });
      } else {
        setVideoBlobUrl(promo.videoUrl);
      }
    } else {
      setVideoBlobUrl('');
    }

    return () => {
      if (activeUrl && activeUrl.startsWith('blob:')) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [promo?.contentType, promo?.videoUrl]);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // Do not show popup on admin page unless opened via preview
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      setIsOpen(false);
      return;
    }

    let activeTimer = null;

    const checkAndTrigger = () => {
      const current = getClinicSettings();
      setSettings(current);

      const currentPromo = current.promoModal;
      if (!currentPromo || !currentPromo.enabled) {
        setIsOpen(false);
        return;
      }

      const { active } = getPromoModalStatus(currentPromo);
      if (!active) {
        setIsOpen(false);
        return;
      }

      // Check if user has already dismissed this promotion in the current session
      if (currentPromo.showOncePerSession !== false) {
        const dismissKey = `revere_promo_dismissed_${currentPromo.title || 'active'}`;
        const dismissed = sessionStorage.getItem(dismissKey);
        if (dismissed === 'true' && !forceOpen) {
          setIsOpen(false);
          return;
        }
      }

      // Set timeout delay
      const delay = Math.max(0, (currentPromo.delaySeconds !== undefined ? currentPromo.delaySeconds : 2)) * 1000;
      if (activeTimer) clearTimeout(activeTimer);
      activeTimer = setTimeout(() => {
        setIsOpen(true);
      }, delay);
    };

    checkAndTrigger();

    const handleUpdate = (e) => {
      if (e.detail) {
        setSettings(e.detail);
      }
      checkAndTrigger();
    };

    window.addEventListener('revere-settings-updated', handleUpdate);
    return () => {
      if (activeTimer) clearTimeout(activeTimer);
      window.removeEventListener('revere-settings-updated', handleUpdate);
    };
  }, [forceOpen]);

  if (!isOpen || !promo) return null;

  const handleDismiss = () => {
    setIsOpen(false);
    if (!forceOpen) {
      const dismissKey = `revere_promo_dismissed_${promo.title || 'active'}`;
      sessionStorage.setItem(dismissKey, 'true');
    }
    if (onClose) onClose();
  };

  return (
    <div className="promo-modal-overlay" onClick={handleDismiss}>
      <div 
        className={`promo-modal-card glass-card card-width-${promo.cardWidth || 'standard'} ${promo.showTextDetails === false ? 'flyer-mode' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="promo-modal-close-btn" 
          onClick={handleDismiss}
          aria-label="Close promotional announcement"
        >
          <X size={20} />
        </button>

        {/* Media / Image Banner - ALWAYS FITS 100% */}
        {promo.contentType === 'image' && promo.imageUrl && (
          <div className="promo-media-container">
            <a 
              href={promo.ctaUrl || 'https://reverewellness.janeapp.com/'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="promo-image-link"
            >
              <img 
                src={promo.imageUrl} 
                alt={promo.title || 'Special Promotion'} 
                className="promo-image-element"
              />
            </a>
          </div>
        )}

        {/* Media / Video Player (MP4 / WebM / Reel / YouTube / Vimeo) */}
        {promo.contentType === 'video' && (videoBlobUrl || (promo.videoUrl && !promo.videoUrl.startsWith('idb:'))) && (
          <div className="promo-media-container promo-video-container">
            {(promo.videoUrl?.includes('youtube') || promo.videoUrl?.includes('youtu.be') || promo.videoUrl?.includes('vimeo')) ? (
              <div className="promo-video-iframe-wrapper">
                <iframe
                  src={formatVideoEmbedUrl(promo.videoUrl)}
                  title={promo.title || 'Clinic Promotional Video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="promo-video-iframe"
                />
              </div>
            ) : (
              <div className="promo-video-wrapper">
                <video
                  src={videoBlobUrl || (!promo.videoUrl?.startsWith('idb:') ? promo.videoUrl : '')}
                  autoPlay={promo.videoAutoplay !== false}
                  muted={isMuted}
                  loop={promo.videoLoop !== false}
                  controls={promo.videoControls !== false}
                  playsInline
                  className="promo-video-element"
                />
                <button
                  type="button"
                  className="promo-sound-toggle-btn"
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>{isMuted ? 'Tap for Sound' : 'Mute'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Animation Script / Custom HTML Embed */}
        {promo.contentType === 'script' && promo.animationScript && (
          <div 
            className="promo-animation-container"
            dangerouslySetInnerHTML={{ __html: promo.animationScript }}
          />
        )}

        {/* Modal Text & Action Content */}
        {promo.showTextDetails !== false && (promo.title || promo.subtitle || promo.bodyText) ? (
          <div className="promo-body-content">
            {promo.badgeText && (
              <div className="promo-badge-tag">
                <Sparkles size={14} className="tag-sparkle" />
                <span>{promo.badgeText}</span>
              </div>
            )}

            {promo.title && (
              <h2 className="promo-title">{promo.title}</h2>
            )}
            
            {promo.subtitle && (
              <div className="promo-subtitle">{promo.subtitle}</div>
            )}

            {promo.bodyText && (
              <p className="promo-description">{promo.bodyText}</p>
            )}

            {/* Action CTAs */}
            <div className="promo-actions-row">
              {promo.ctaUrl && (
                <a 
                  href={promo.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-promo-primary"
                  onClick={handleDismiss}
                >
                  <Calendar size={17} />
                  <span>{promo.ctaText || 'Claim Offer & Book Online'}</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {promo.secondaryCtaPhone && (
                <a 
                  href={`tel:${promo.secondaryCtaPhone}`}
                  className="btn-promo-secondary"
                  onClick={handleDismiss}
                >
                  <Phone size={16} />
                  <span>{promo.secondaryCtaText || 'Call Reception'}</span>
                </a>
              )}
            </div>

            <div className="promo-footer-dismiss">
              <button className="dismiss-link" onClick={handleDismiss}>
                No thanks, continue browsing
              </button>
            </div>
          </div>
        ) : (
          /* Flyer-Only Mode: Action buttons directly under image */
          (promo.ctaUrl || promo.secondaryCtaPhone) && (
            <div className="promo-flyer-actions">
              {promo.ctaUrl && (
                <a 
                  href={promo.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-promo-primary"
                  onClick={handleDismiss}
                >
                  <Calendar size={17} />
                  <span>{promo.ctaText || 'Book Appointment Now'}</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {promo.secondaryCtaPhone && (
                <a 
                  href={`tel:${promo.secondaryCtaPhone}`}
                  className="btn-promo-secondary"
                  onClick={handleDismiss}
                >
                  <Phone size={16} />
                  <span>{promo.secondaryCtaText || 'Call Reception'}</span>
                </a>
              )}
            </div>
          )
        )}
      </div>

      <style>{`
        .promo-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 17, 12, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 4000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          animation: promoFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes promoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .promo-modal-card {
          width: auto;
          max-width: min(92vw, 540px);
          max-height: 94vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: var(--radius-xl);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
          border: 1.5px solid rgba(216, 178, 141, 0.45);
          position: relative;
          display: flex;
          flex-direction: column;
          animation: promoSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .promo-modal-card.card-width-compact {
          max-width: min(92vw, 440px);
        }
        .promo-modal-card.card-width-standard {
          max-width: min(92vw, 540px);
        }
        .promo-modal-card.card-width-wide {
          max-width: min(92vw, 680px);
        }

        @keyframes promoSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .promo-modal-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(24, 28, 22, 0.75);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: var(--transition);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(6px);
        }
        .promo-modal-close-btn:hover {
          background: #000000;
          transform: scale(1.08);
        }

        /* Image Media Container - ALWAYS FITS FULL PROPORTIONS WITHOUT CLIPPING */
        .promo-media-container {
          width: 100%;
          background: transparent;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          padding: 0;
          margin: 0;
        }

        .promo-image-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          text-decoration: none;
        }

        .promo-image-element {
          max-width: 100%;
          max-height: 72vh;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
          transition: transform 0.35s ease;
        }
        .promo-modal-card.flyer-mode .promo-image-element {
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }
        .promo-image-link:hover .promo-image-element {
          transform: scale(1.012);
        }

        .promo-flyer-actions {
          padding: 16px 24px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #ffffff;
          border-radius: 0 0 var(--radius-xl) var(--radius-xl);
        }

        /* Video Container & Player */
        .promo-video-container {
          background: #0b0d0a;
          position: relative;
        }
        .promo-video-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b0d0a;
        }
        .promo-video-element {
          max-width: 100%;
          max-height: 72vh;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }
        .promo-sound-toggle-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(18, 20, 16, 0.82);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: var(--transition);
          z-index: 10;
        }
        .promo-sound-toggle-btn:hover {
          background: #000000;
          transform: scale(1.05);
        }
        .promo-video-iframe-wrapper {
          width: 100%;
          position: relative;
          padding-bottom: 56.25%; /* 16:9 ratio */
          height: 0;
          overflow: hidden;
          background: #000000;
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }
        .promo-video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        /* Animation Script Container */
        .promo-animation-container {
          width: 100%;
          min-height: 180px;
          background: #181c16;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        /* Body Content */
        .promo-body-content {
          padding: 28px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: #ffffff;
        }

        .promo-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: var(--primary-50);
          color: var(--primary-800);
          padding: 5px 14px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(127, 125, 49, 0.25);
          margin-bottom: 12px;
        }
        .tag-sparkle {
          color: #c99d75;
        }

        .promo-title {
          font-size: 1.55rem;
          color: var(--primary-900);
          font-weight: 700;
          margin-bottom: 6px;
          line-height: 1.25;
        }

        .promo-subtitle {
          font-size: 0.92rem;
          color: var(--primary-700);
          font-weight: 600;
          margin-bottom: 12px;
        }

        .promo-description {
          font-size: 0.92rem;
          color: var(--neutral-700);
          line-height: 1.55;
          margin-bottom: 24px;
          max-width: 440px;
        }

        /* Actions */
        .promo-actions-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .btn-promo-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 14px 24px;
          border-radius: var(--radius-full);
          font-size: 0.98rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%);
          color: #ffffff;
          box-shadow: 0 8px 22px rgba(51, 50, 19, 0.25);
          transition: var(--transition);
          border: 1px solid rgba(216, 178, 141, 0.4);
          width: 100%;
        }
        .btn-promo-primary:hover {
          background: linear-gradient(135deg, #c99d75 0%, #b58963 100%);
          transform: translateY(-1px);
          box-shadow: 0 10px 26px rgba(181, 137, 99, 0.4);
        }

        .btn-promo-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 600;
          background: var(--neutral-100);
          color: var(--primary-900);
          border: 1px solid var(--neutral-300);
          transition: var(--transition);
          width: 100%;
        }
        .btn-promo-secondary:hover {
          background: var(--neutral-200);
          border-color: var(--primary-600);
        }

        .promo-footer-dismiss {
          margin-top: 14px;
        }
        .dismiss-link {
          font-size: 0.8rem;
          color: var(--neutral-500);
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }
        .dismiss-link:hover {
          color: var(--neutral-800);
        }

        @media (max-width: 480px) {
          .promo-body-content {
            padding: 22px 18px;
          }
          .promo-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  );
}
