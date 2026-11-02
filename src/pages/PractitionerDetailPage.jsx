import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ExternalLink, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  Languages, 
  Award, 
  ArrowLeft, 
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { getStoredPractitioners, syncPractitionersFromDb, getPractitionerBySlug } from '../data/practitioners';

export default function PractitionerDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [practitioners, setPractitioners] = useState(() => getStoredPractitioners());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Fetch latest from database
    syncPractitionersFromDb().then(data => {
      if (data) setPractitioners(data);
    });

    const handleUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setPractitioners(e.detail);
      }
    };
    window.addEventListener('revere-practitioners-updated', handleUpdate);
    return () => window.removeEventListener('revere-practitioners-updated', handleUpdate);
  }, [slug]);

  const practitioner = getPractitionerBySlug(slug, practitioners);

  if (!practitioner) {
    return (
      <div className="not-found-page section-padding">
        <div className="container">
          <div className="not-found-card glass-card">
            <h2>Practitioner Not Found</h2>
            <p>We couldn't locate the profile you are looking for.</p>
            <Link to="/practitioners" className="btn btn-primary">
              <ArrowLeft size={16} />
              <span>Back to Practitioners Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://reverewellness.ca/practitioners/${practitioner.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const shareText = `Book an appointment with ${practitioner.name} (${practitioner.title}) at Revere Massage & Wellness in Surrey, BC:`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Appointment with ${practitioner.name} - Revere Wellness`)}&body=${encodeURIComponent(`${shareText}\n\n${currentUrl}\n\nOr book online directly at JaneApp: ${practitioner.janeBookingUrl}`)}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;

  // Related practitioners (same discipline or general team)
  const otherPractitioners = practitioners
    .filter(p => p.id !== practitioner.id)
    .slice(0, 3);

  // Split bio into paragraphs
  const bioParagraphs = practitioner.bio
    ? practitioner.bio.split('\n\n').filter(p => p.trim())
    : [practitioner.shortBio];

  return (
    <div className="practitioner-detail-page">
      {/* Top Breadcrumb & Share Promotion Bar */}
      <section className="promo-top-bar">
        <div className="container">
          <div className="promo-bar-content">
            <Link to="/practitioners" className="back-link">
              <ArrowLeft size={16} />
              <span>All Practitioners</span>
            </Link>

            {/* Sharing & Promotion Toolbar */}
            <div className="share-actions-group">
              <span className="share-label">
                <Share2 size={15} />
                <span className="share-label-text">Promote Profile:</span>
              </span>

              <button 
                className={`share-btn copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
                title="Copy shareable link for clients"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="share-btn whatsapp-btn"
                title="Share via WhatsApp"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>

              <a 
                href={emailUrl} 
                className="share-btn email-btn"
                title="Share via Email"
              >
                <Mail size={14} />
                <span>Email</span>
              </a>

              <button 
                className="share-btn qr-btn"
                onClick={() => setShowQrModal(true)}
                title="Show QR Code for clients to scan"
              >
                <QrCode size={14} />
                <span>QR Code</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Header Section */}
      <header className="practitioner-hero-header">
        <div className="container">
          <div className="hero-grid">
            {/* Left: Photo / Portrait Card */}
            <div className="portrait-column">
              <div className="portrait-card glass-card">
                <div className="portrait-image-wrapper">
                  {practitioner.photo ? (
                    <img 
                      src={practitioner.photo} 
                      alt={practitioner.name} 
                      className="portrait-img"
                    />
                  ) : (
                    <div className="portrait-placeholder">
                      <div className="avatar-monogram-lg">
                        {practitioner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="portrait-placeholder-role">{practitioner.title}</span>
                    </div>
                  )}
                  <div className="discipline-badge-overlay">
                    <span className="badge-tag">{practitioner.disciplineLabel}</span>
                  </div>
                </div>

                <div className="portrait-footer">
                  <div className="verified-status">
                    <ShieldCheck size={18} className="verified-icon" />
                    <div>
                      <strong>Regulated Healthcare Provider</strong>
                      <p>{practitioner.credentials}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info & Primary CTAs */}
            <div className="practitioner-summary-col">
              <div className="hero-badge-pill">
                <Sparkles size={14} className="sparkle-icon" />
                <span>Now Accepting New Patients</span>
              </div>

              <h1 className="hero-name">{practitioner.name}</h1>
              <div className="hero-title">{practitioner.title}</div>
              <div className="hero-credentials">{practitioner.credentials}</div>

              {/* Quick Info Badges */}
              <div className="quick-badges-row">
                {practitioner.education && (
                  <div className="info-badge">
                    <GraduationCap size={15} />
                    <span>{practitioner.education}</span>
                  </div>
                )}
                {practitioner.languages && practitioner.languages.length > 0 && (
                  <div className="info-badge">
                    <Languages size={15} />
                    <span>Fluently speaks: <strong>{practitioner.languages.join(', ')}</strong></span>
                  </div>
                )}
                {practitioner.yearsExperience && (
                  <div className="info-badge">
                    <Award size={15} />
                    <span>Experience: <strong>{practitioner.yearsExperience}</strong></span>
                  </div>
                )}
              </div>

              {/* Short Bio Highlight */}
              <p className="hero-short-bio">
                {practitioner.shortBio}
              </p>

              {/* Action Buttons */}
              <div className="hero-cta-group">
                <a 
                  href={practitioner.janeBookingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-book-primary"
                >
                  <Calendar size={18} />
                  <span>Book with {practitioner.name.split(' ')[0]} on JaneApp</span>
                  <ExternalLink size={14} className="ext-icon" />
                </a>

                <a href="tel:6045030855" className="btn-call-clinic">
                  <Phone size={18} />
                  <span>Call Reception: (604) 503-0855</span>
                </a>
              </div>

              {/* Direct Booking Guarantees */}
              <div className="booking-guarantees">
                <div className="guarantee-item">
                  <CheckCircle2 size={16} className="guarantee-icon" />
                  <span>ICBC Approved & Direct Billed</span>
                </div>
                <div className="guarantee-item">
                  <CheckCircle2 size={16} className="guarantee-icon" />
                  <span>Major Extended Health Accepted</span>
                </div>
                <div className="guarantee-item">
                  <CheckCircle2 size={16} className="guarantee-icon" />
                  <span>Free Reserved Parking (Stalls 36–38)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <section className="profile-body-section section-padding">
        <div className="container">
          <div className="content-layout-grid">
            {/* Left Main Column: Full Bio & Treatments */}
            <div className="main-content-col">
              {/* Full Biography Card */}
              <div className="profile-section-card glass-card">
                <div className="section-header">
                  <h2 className="section-title">About & Clinical Philosophy</h2>
                  <span className="section-subtitle">Therapist Profile & Care Background</span>
                </div>

                <div className="bio-prose">
                  {bioParagraphs.map((para, idx) => {
                    // Check if line starts with bullets or special headers
                    if (para.includes('•') || para.includes('-') || para.startsWith('**') || para.includes('Memberships') || para.includes('Training') || para.includes('Special Interests')) {
                      return (
                        <div key={idx} className="bio-structured-block">
                          {para.split('\n').map((line, lIdx) => {
                            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                              return (
                                <div key={lIdx} className="bullet-point">
                                  <CheckCircle2 size={15} className="bullet-icon" />
                                  <span>{line.replace(/^[•\-]\s*/, '')}</span>
                                </div>
                              );
                            }
                            if (line.trim().startsWith('**') || line.includes(':')) {
                              return <h3 key={lIdx} className="bio-subhead">{line.replace(/\*\*/g, '')}</h3>;
                            }
                            return <p key={lIdx}>{line}</p>;
                          })}
                        </div>
                      );
                    }
                    return <p key={idx}>{para}</p>;
                  })}
                </div>
              </div>

              {/* Treatments Offered & Pricing */}
              {practitioner.treatments && practitioner.treatments.length > 0 && (
                <div className="profile-section-card glass-card">
                  <div className="section-header">
                    <div>
                      <h2 className="section-title">Treatments & Sessions Offered</h2>
                      <span className="section-subtitle">Select a session duration and book directly on JaneApp</span>
                    </div>
                    <span className="treatments-count-badge">
                      {practitioner.treatments.length} Available Treatments
                    </span>
                  </div>

                  <div className="treatments-list">
                    {practitioner.treatments.map((t) => (
                      <div key={t.id} className="treatment-item-card">
                        <div className="treatment-main-info">
                          <h3 className="treatment-title">{t.name}</h3>
                          {t.description && (
                            <p className="treatment-desc">{t.description}</p>
                          )}
                          <div className="treatment-chips">
                            <span className="chip-duration">
                              <Clock size={13} />
                              {t.duration} Minutes
                            </span>
                            {t.price > 0 ? (
                              <span className="chip-price">
                                ${t.price} CAD {t.priceIncludesTax ? '(Tax incl.)' : '+ GST'}
                              </span>
                            ) : (
                              <span className="chip-price chip-icbc">
                                ICBC / Direct Billed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="treatment-action">
                          <a 
                            href={practitioner.janeBookingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-book-treatment"
                          >
                            <span>Book Session</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Specialties */}
              <div className="profile-section-card glass-card">
                <div className="section-header">
                  <h2 className="section-title">Specialties & Techniques</h2>
                  <span className="section-subtitle">Evidence-informed modalities applied during your treatment</span>
                </div>

                <div className="specialties-full-grid">
                  {practitioner.specialties.map((spec, i) => (
                    <div key={i} className="specialty-card-full">
                      <CheckCircle2 size={16} className="specialty-icon-gold" />
                      <span className="specialty-name">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar: Clinic Location, Direct Billing & Patient Checklist */}
            <aside className="sidebar-col">
              {/* Quick Book Card */}
              <div className="sidebar-card booking-sticky-card glass-card">
                <h3 className="sidebar-title">Book an Appointment</h3>
                <p className="sidebar-desc">
                  Schedule your session with <strong>{practitioner.name}</strong> instantly via our secure JaneApp portal.
                </p>

                <a 
                  href={practitioner.janeBookingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-book-primary full-width"
                >
                  <Calendar size={17} />
                  <span>Reserve Session Online</span>
                  <ExternalLink size={13} />
                </a>

                <div className="sidebar-divider"><span>OR</span></div>

                <a href="tel:6045030855" className="btn-call-sidebar full-width">
                  <Phone size={16} />
                  <span>Call (604) 503-0855</span>
                </a>

                <div className="sidebar-hours-notice">
                  <Clock size={14} />
                  <span>Clinic Open 7 Days: 6:30 AM – 8:00 PM</span>
                </div>
              </div>

              {/* Direct Billing Card */}
              <div className="sidebar-card glass-card">
                <h3 className="sidebar-title">Insurance & Direct Billing</h3>
                <p className="sidebar-desc">
                  We bill directly to over 30+ insurance carriers on your behalf so you don't have to submit out-of-pocket receipts:
                </p>

                <div className="direct-billing-badges">
                  <span className="bill-tag">ICBC Pre-Approved</span>
                  <span className="bill-tag">Pacific Blue Cross</span>
                  <span className="bill-tag">Sun Life</span>
                  <span className="bill-tag">Canada Life</span>
                  <span className="bill-tag">Manulife</span>
                  <span className="bill-tag">Green Shield</span>
                  <span className="bill-tag">Desjardins</span>
                  <span className="bill-tag">Chamber of Commerce</span>
                </div>
              </div>

              {/* Clinic Location & Parking */}
              <div className="sidebar-card glass-card">
                <h3 className="sidebar-title">Clinic Location & Parking</h3>
                <div className="sidebar-address-group">
                  <MapPin size={18} className="sidebar-icon-gold" />
                  <div>
                    <strong>Revere Massage and Wellness Centre</strong>
                    <p>Suite 210 - 7110 120 St, Surrey, BC V3W 3M8</p>
                  </div>
                </div>

                <div className="parking-highlight-box">
                  <strong>Free Reserved Parking:</strong>
                  <p>Dedicated clinic parking stalls <strong>#36, #37, and #38</strong> are located in the underground lot for your visit.</p>
                </div>
              </div>

              {/* Share Tool Card for Practitioner */}
              <div className="sidebar-card promo-share-box glass-card">
                <h3 className="sidebar-title">Share Practitioner Profile</h3>
                <p className="sidebar-desc">
                  Copy this personalized link to share with prospective clients, family, or friends:
                </p>
                <div className="share-link-input-group">
                  <input 
                    type="text" 
                    readOnly 
                    value={currentUrl} 
                    className="share-url-input"
                    aria-label="Profile link"
                  />
                  <button 
                    className="btn-copy-input"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                {copied && <span className="copied-toast">✓ Link copied to clipboard!</span>}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Other Practitioners Recommendation */}
      <section className="other-practitioners-section">
        <div className="container">
          <div className="other-header">
            <div>
              <span className="other-tag">Our Care Collective</span>
              <h2 className="other-title">Meet Other Practitioners at Revere</h2>
            </div>
            <Link to="/practitioners" className="btn-view-all">
              <span>View All 18 Practitioners</span>
              <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
            </Link>
          </div>

          <div className="other-grid">
            {otherPractitioners.map((other) => (
              <div key={other.id} className="other-card glass-card">
                <div className="other-photo-box">
                  {other.photo ? (
                    <img src={other.photo} alt={other.name} className="other-img" loading="lazy" />
                  ) : (
                    <div className="other-avatar-fallback">
                      {other.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className="other-info">
                  <h3 className="other-name">{other.name}</h3>
                  <div className="other-role">{other.title}</div>
                  <p className="other-short-bio">{other.shortBio}</p>
                  <Link to={`/practitioners/${other.slug}`} className="other-link">
                    <span>View Bio & Profile →</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Code Modal for In-Person Client Promotion */}
      {showQrModal && (
        <div className="qr-modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="qr-close-btn" onClick={() => setShowQrModal(false)}>
              <X size={20} />
            </button>
            <div className="qr-modal-header">
              <span className="qr-badge">Instant Booking QR Code</span>
              <h3>Scan to Book with {practitioner.name}</h3>
              <p>Show this QR code on your phone or print it for clients to scan directly into your profile and booking page.</p>
            </div>

            <div className="qr-code-display">
              {/* Dynamic QR Code generated via quick API */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}`} 
                alt={`QR code for ${practitioner.name}`}
                className="qr-img"
              />
            </div>

            <div className="qr-details">
              <strong>{practitioner.name}</strong>
              <span>{practitioner.title}</span>
              <code className="qr-url-text">{currentUrl}</code>
            </div>

            <button 
              className="btn btn-primary full-width"
              onClick={handleCopyLink}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Link Copied!' : 'Copy Profile Link'}</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .practitioner-detail-page {
          background-color: var(--neutral-50);
          min-height: 100vh;
        }

        /* Promo Top Bar */
        .promo-top-bar {
          background: #25240e;
          border-bottom: 1px solid rgba(216, 178, 141, 0.25);
          padding: 12px 0;
          position: relative;
          z-index: 100;
        }
        .promo-bar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--primary-100);
          font-size: 0.88rem;
          font-weight: 600;
          transition: var(--transition);
        }
        .back-link:hover {
          color: #d8b28d;
          transform: translateX(-3px);
        }

        .share-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .share-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #d8b28d;
          font-weight: 700;
          margin-right: 4px;
        }
        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          transition: var(--transition);
        }
        .share-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #d8b28d;
          color: #ffffff;
        }
        .copy-btn.copied {
          background: #4c7739;
          border-color: #72ab58;
          color: #ffffff;
        }
        .whatsapp-btn:hover {
          background: #25d366;
          border-color: #25d366;
          color: #ffffff;
        }

        /* Hero Header */
        .practitioner-hero-header {
          background: linear-gradient(180deg, var(--primary-900) 0%, var(--primary-950) 100%);
          color: #ffffff;
          padding: 60px 0 70px 0;
          position: relative;
          overflow: hidden;
        }
        .practitioner-hero-header::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(127, 125, 49, 0.25) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 50px;
          align-items: center;
        }

        /* Portrait Column */
        .portrait-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid rgba(216, 178, 141, 0.35);
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.4);
        }
        .portrait-image-wrapper {
          position: relative;
          width: 100%;
          height: 440px;
          background: var(--primary-50);
          overflow: hidden;
        }
        .portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
        }

        .portrait-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-950) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          padding: 30px;
        }
        .avatar-monogram-lg {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--primary-600);
          border: 4px solid rgba(216, 178, 141, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
        }
        .portrait-placeholder-role {
          font-size: 0.95rem;
          color: var(--primary-200);
          text-align: center;
          font-weight: 500;
        }

        .discipline-badge-overlay {
          position: absolute;
          bottom: 16px;
          left: 16px;
          z-index: 2;
        }
        .badge-tag {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: rgba(31, 30, 10, 0.88);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(216, 178, 141, 0.4);
        }

        .portrait-footer {
          padding: 18px 22px;
          background: #ffffff;
        }
        .verified-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .verified-icon {
          color: var(--primary-600);
          flex-shrink: 0;
        }
        .verified-status strong {
          display: block;
          font-size: 0.88rem;
          color: var(--primary-900);
          line-height: 1.25;
        }
        .verified-status p {
          font-size: 0.78rem;
          color: #7d5b3e;
          font-weight: 600;
          margin: 2px 0 0 0;
        }

        /* Summary Col */
        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(216, 178, 141, 0.35);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          color: #d8b28d;
          margin-bottom: 14px;
        }
        .sparkle-icon {
          color: #d8b28d;
        }

        .hero-name {
          font-size: clamp(2.4rem, 4vw, 3.2rem);
          color: #ffffff;
          margin-bottom: 6px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .hero-title {
          font-size: 1.25rem;
          color: var(--primary-200);
          font-weight: 600;
          margin-bottom: 4px;
        }
        .hero-credentials {
          font-size: 0.95rem;
          color: #d8b28d;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .quick-badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 22px;
        }
        .info-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(216, 178, 141, 0.25);
          font-size: 0.84rem;
          color: var(--primary-100);
        }
        .info-badge strong {
          color: #ffffff;
        }

        .hero-short-bio {
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--primary-100);
          margin-bottom: 30px;
          max-width: 720px;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .btn-book-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          border-radius: var(--radius-full);
          font-size: 1.02rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(51, 50, 19, 0.35);
          transition: var(--transition);
          border: 1px solid rgba(216, 178, 141, 0.4);
        }
        .btn-book-primary:hover {
          background: linear-gradient(135deg, #c99d75 0%, #b58963 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(181, 137, 99, 0.45);
        }

        .btn-call-clinic {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 24px;
          border-radius: var(--radius-full);
          font-size: 0.98rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(216, 178, 141, 0.35);
          transition: var(--transition);
        }
        .btn-call-clinic:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .booking-guarantees {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        .guarantee-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--primary-200);
          font-weight: 500;
        }
        .guarantee-icon {
          color: #d8b28d;
          flex-shrink: 0;
        }

        /* Content Layout */
        .content-layout-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 40px;
          align-items: start;
        }

        .main-content-col {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .profile-section-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 36px;
          border: 1px solid rgba(216, 178, 141, 0.35);
          box-shadow: 0 10px 30px -10px rgba(51, 50, 19, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 2px solid var(--neutral-100);
          padding-bottom: 18px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .section-title {
          font-size: 1.55rem;
          color: var(--primary-900);
          margin-bottom: 4px;
        }
        .section-subtitle {
          font-size: 0.88rem;
          color: var(--neutral-600);
        }
        .treatments-count-badge {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary-700);
          background: var(--primary-50);
          border: 1px solid rgba(127, 125, 49, 0.25);
          padding: 5px 12px;
          border-radius: var(--radius-full);
        }

        .bio-prose {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--neutral-800);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .bio-structured-block {
          background: var(--neutral-50);
          padding: 20px 24px;
          border-radius: var(--radius-lg);
          border-left: 4px solid var(--primary-600);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bio-subhead {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary-900);
          margin-top: 6px;
        }
        .bullet-point {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.95rem;
        }
        .bullet-icon {
          color: var(--primary-600);
          flex-shrink: 0;
          margin-top: 4px;
        }

        /* Treatments List */
        .treatments-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .treatment-item-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-radius: var(--radius-lg);
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          transition: var(--transition);
        }
        .treatment-item-card:hover {
          background: #ffffff;
          border-color: var(--primary-400);
          box-shadow: 0 8px 20px -6px rgba(51, 50, 19, 0.1);
        }
        .treatment-main-info {
          flex: 1;
        }
        .treatment-title {
          font-size: 1.1rem;
          color: var(--primary-900);
          margin-bottom: 4px;
        }
        .treatment-desc {
          font-size: 0.85rem;
          color: var(--neutral-600);
          margin-bottom: 10px;
          line-height: 1.45;
        }
        .treatment-chips {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .chip-duration {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--neutral-700);
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }
        .chip-price {
          display: inline-flex;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary-800);
          background: var(--primary-100);
          padding: 4px 12px;
          border-radius: var(--radius-full);
        }
        .chip-icbc {
          background: #eef7eb;
          color: #2b701d;
        }

        .btn-book-treatment {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 700;
          background: var(--primary-600);
          color: #ffffff;
          white-space: nowrap;
          transition: var(--transition);
        }
        .btn-book-treatment:hover {
          background: var(--primary-800);
          transform: translateY(-1px);
        }

        /* Specialties Full Grid */
        .specialties-full-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }
        .specialty-card-full {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          background: var(--primary-50);
          border: 1px solid rgba(127, 125, 49, 0.2);
        }
        .specialty-icon-gold {
          color: var(--primary-600);
          flex-shrink: 0;
        }
        .specialty-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary-900);
        }

        /* Sidebar */
        .sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .sidebar-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 26px;
          border: 1px solid rgba(216, 178, 141, 0.35);
          box-shadow: 0 10px 25px -8px rgba(51, 50, 19, 0.06);
        }
        .sidebar-title {
          font-size: 1.15rem;
          color: var(--primary-900);
          margin-bottom: 8px;
        }
        .sidebar-desc {
          font-size: 0.86rem;
          color: var(--neutral-600);
          line-height: 1.5;
          margin-bottom: 18px;
        }

        .booking-sticky-card {
          position: sticky;
          top: 140px;
          border: 2px solid var(--primary-400);
          background: linear-gradient(180deg, #ffffff 0%, var(--primary-50) 100%);
        }
        .full-width {
          width: 100%;
          justify-content: center;
        }
        .btn-call-sidebar {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 20px;
          border-radius: var(--radius-full);
          font-size: 0.92rem;
          font-weight: 700;
          background: #ffffff;
          color: var(--primary-900);
          border: 1px solid var(--neutral-300);
          transition: var(--transition);
        }
        .btn-call-sidebar:hover {
          background: var(--neutral-100);
          border-color: var(--primary-600);
        }
        .sidebar-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 12px 0;
          color: var(--neutral-400);
          font-size: 0.76rem;
          font-weight: 700;
        }
        .sidebar-divider::before, .sidebar-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--neutral-200);
        }
        .sidebar-divider span {
          padding: 0 10px;
        }
        .sidebar-hours-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--neutral-600);
          margin-top: 14px;
        }

        .direct-billing-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .bill-tag {
          font-size: 0.76rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          background: var(--neutral-100);
          color: var(--neutral-800);
          border: 1px solid var(--neutral-200);
        }

        .sidebar-address-group {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.88rem;
          color: var(--neutral-800);
          margin-bottom: 16px;
        }
        .sidebar-icon-gold {
          color: var(--primary-600);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .parking-highlight-box {
          background: var(--primary-50);
          padding: 14px;
          border-radius: var(--radius-md);
          border-left: 3px solid var(--primary-600);
          font-size: 0.82rem;
          color: var(--primary-950);
          line-height: 1.45;
        }
        .parking-highlight-box strong {
          display: block;
          margin-bottom: 2px;
          color: var(--primary-900);
        }

        .share-link-input-group {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .share-url-input {
          width: 100%;
          font-size: 0.8rem;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--neutral-300);
          background: var(--neutral-50);
          color: var(--neutral-700);
          font-family: inherit;
        }
        .btn-copy-input {
          padding: 8px 12px;
          background: var(--primary-600);
          color: #ffffff;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .btn-copy-input:hover {
          background: var(--primary-800);
        }
        .copied-toast {
          font-size: 0.78rem;
          font-weight: 600;
          color: #2b701d;
          display: block;
        }

        /* Other Practitioners Section */
        .other-practitioners-section {
          background: var(--neutral-100);
          padding: 70px 0;
          border-top: 1px solid var(--neutral-200);
        }
        .other-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .other-tag {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary-600);
        }
        .other-title {
          font-size: 1.8rem;
          color: var(--primary-900);
        }
        .btn-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--primary-700);
        }
        .btn-view-all:hover {
          color: var(--primary-900);
          text-decoration: underline;
        }

        .other-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .other-card {
          background: #ffffff;
          border-radius: var(--radius-lg);
          padding: 20px;
          border: 1px solid rgba(216, 178, 141, 0.3);
          display: flex;
          gap: 18px;
          align-items: center;
          transition: var(--transition);
        }
        .other-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px -8px rgba(51, 50, 19, 0.12);
        }
        .other-photo-box {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--primary-100);
          flex-shrink: 0;
        }
        .other-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .other-avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--primary-800);
          background: var(--primary-200);
        }
        .other-info {
          flex: 1;
        }
        .other-name {
          font-size: 1.05rem;
          color: var(--primary-900);
          margin-bottom: 2px;
        }
        .other-role {
          font-size: 0.78rem;
          color: var(--primary-600);
          font-weight: 600;
          margin-bottom: 4px;
        }
        .other-short-bio {
          font-size: 0.78rem;
          color: var(--neutral-600);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .other-link {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary-700);
        }

        /* QR Modal */
        .qr-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 13, 14, 0.75);
          backdrop-filter: blur(8px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }
        .qr-modal-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 36px 30px;
          position: relative;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(216, 178, 141, 0.4);
        }
        .qr-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          color: var(--neutral-500);
          padding: 6px;
        }
        .qr-badge {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--primary-700);
          background: var(--primary-50);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          margin-bottom: 10px;
        }
        .qr-modal-header h3 {
          font-size: 1.35rem;
          color: var(--primary-900);
          margin-bottom: 6px;
        }
        .qr-modal-header p {
          font-size: 0.85rem;
          color: var(--neutral-600);
          line-height: 1.45;
          margin-bottom: 20px;
        }
        .qr-code-display {
          background: #ffffff;
          padding: 16px;
          border-radius: var(--radius-lg);
          border: 2px dashed var(--primary-300);
          display: inline-block;
          margin-bottom: 18px;
        }
        .qr-img {
          width: 200px;
          height: 200px;
          display: block;
        }
        .qr-details {
          margin-bottom: 20px;
        }
        .qr-details strong {
          display: block;
          font-size: 1.1rem;
          color: var(--primary-900);
        }
        .qr-details span {
          display: block;
          font-size: 0.84rem;
          color: var(--primary-600);
          font-weight: 600;
        }
        .qr-url-text {
          display: block;
          font-size: 0.75rem;
          color: var(--neutral-500);
          margin-top: 6px;
          word-break: break-all;
          background: var(--neutral-100);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .portrait-column {
            max-width: 340px;
            margin: 0 auto;
          }
          .quick-badges-row, .hero-cta-group, .booking-guarantees {
            justify-content: center;
          }
          .content-layout-grid {
            grid-template-columns: 1fr;
          }
          .booking-sticky-card {
            position: static;
          }
          .other-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .promo-bar-content {
            flex-direction: column;
            align-items: flex-start;
          }
          .share-actions-group {
            width: 100%;
            justify-content: space-between;
          }
          .share-label-text {
            display: none;
          }
          .treatment-item-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .btn-book-treatment {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
