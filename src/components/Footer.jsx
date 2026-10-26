import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowUp 
} from 'lucide-react';
import { getClinicSettings } from '../lib/settings';

export default function Footer() {
  const [settings, setSettings] = useState(getClinicSettings());

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) setSettings(e.detail);
    };
    window.addEventListener('revere-settings-updated', handleUpdate);
    return () => window.removeEventListener('revere-settings-updated', handleUpdate);
  }, []);

  const JANEAPP_URL = settings.janeAppUrl || "https://reverewellness.janeapp.com/";
  const receptionPhone = settings.receptionPhone || "(604) 503-0855";
  const cleanPhone = receptionPhone.replace(/\D/g, '');
  const receptionEmail = settings.receptionEmail || "info@reverewellness.ca";
  const social = settings.socialLinks || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      {/* Pre-footer Call to Action */}
      <div className="pre-footer-cta">
        <div className="container">
          <div className="cta-box glass-card-dark">
            <div className="cta-left">
              <span className="cta-tag">Begin Your Wellness Journey</span>
              <h2 className="cta-heading">Ready to Experience Deep Relief & Restoration?</h2>
              <p className="cta-sub">
                Book your session today with our licensed Registered Massage Therapists and Physiotherapists in Newton, Surrey.
              </p>
            </div>
            <div className="cta-right">
              <a 
                href={JANEAPP_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-gold cta-action-btn"
              >
                <Calendar size={18} />
                <span>Book Appointment Online</span>
              </a>
              <a href={`tel:${cleanPhone || '6045030855'}`} className="btn btn-outline cta-phone-btn">
                <Phone size={18} />
                <span>{receptionPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="main-footer-body">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Clinic Brand */}
            <div className="footer-col brand-col">
              <a href="#" className="footer-brand-link">
                <img 
                  src="/images/revere-logo.png" 
                  alt="Revere Massage & Wellness" 
                  className="footer-logo-img"
                />
              </a>
              <p className="footer-about">
                Newton Surrey’s dedicated multidisciplinary clinic providing high-calibre Registered Massage Therapy, 
                Physiotherapy, IMS, and chronic pain management in a tranquil, professional setting.
              </p>
              <div className="footer-social-links">
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Visit our Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                )}
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Follow us on Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                )}
                {social.tiktok && (
                  <a href={social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="Follow us on TikTok">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                    </svg>
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="Visit our YouTube Channel">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" title="Follow us on X (Twitter)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                    </svg>
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="Connect on LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                )}
                {social.googleReview && (
                  <a href={social.googleReview} target="_blank" rel="noopener noreferrer" aria-label="Google Reviews" title="Read or Leave Google Reviews">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Quick Navigation</h4>
              <ul className="footer-links">
                <li><Link to="/practitioners">Our Practitioners & Bios</Link></li>
                <li><Link to="/services">All Services & Durations</Link></li>
                <li><Link to="/about">About Our Clinic</Link></li>
                <li><Link to="/#insurance">ICBC & Direct Billing</Link></li>
                <li><Link to="/policies">Clinic Policies (24h Cancellation)</Link></li>
                <li><Link to="/location">Free Basement Parking & Location</Link></li>
                <li><Link to="/faq">Frequently Asked Questions</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3: Treatments */}
            <div className="footer-col">
              <h4 className="footer-col-title">Specialized Services</h4>
              <ul className="footer-links">
                <li><Link to="/services?cat=rmt">Deep Tissue Massage</Link></li>
                <li><Link to="/services?cat=rmt">Swedish Relaxation</Link></li>
                <li><Link to="/services?cat=rmt">Prenatal & Postnatal Massage</Link></li>
                <li><Link to="/services?cat=rmt">Sports Injury Recovery</Link></li>
                <li><Link to="/services?cat=specialized">Hot Stone Therapy</Link></li>
                <li><Link to="/services?cat=specialized">IMS / Dry Needling</Link></li>
                <li><Link to="/services?cat=specialized">Shockwave Therapy</Link></li>
                <li><Link to="/services?cat=physio-kin">Physiotherapy & ICBC Rehab</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact & Hours */}
            <div className="footer-col contact-col">
              <h4 className="footer-col-title">Clinic Contact</h4>
              <div className="footer-contact-items">
                <div className="contact-line">
                  <MapPin size={16} className="contact-icon text-gold" />
                  <span>Suite 210 - 7110 120 St, Surrey, BC V3W 3M8</span>
                </div>
                <div className="contact-line">
                  <Phone size={16} className="contact-icon text-gold" />
                  <div>
                    <a href={`tel:${cleanPhone || '6045030855'}`}>{receptionPhone}</a> / <a href="tel:2363127451">(236) 312-7451</a>
                  </div>
                </div>
                <div className="contact-line">
                  <Mail size={16} className="contact-icon text-gold" />
                  <a href={`mailto:${receptionEmail}`}>{receptionEmail}</a>
                </div>
                <div className="contact-line">
                  <Clock size={16} className="contact-icon text-gold" />
                  <span>Mon–Sun: 6:30 AM – 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div className="copyright-text">
              © {new Date().getFullYear()} Revere Massage and Wellness Centre. All rights reserved. Registered RMTs regulated under CCHPBC. • <Link to="/admin" className="staff-admin-link" title="Clinic Staff & Settings Portal">Staff Portal</Link>
            </div>
            <button 
              className="scroll-top-btn" 
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <span>Back to top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--primary-950);
          color: var(--primary-200);
          position: relative;
        }

        .pre-footer-cta {
          transform: translateY(-50px);
          margin-bottom: -20px;
        }

        .cta-box {
          padding: 48px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%);
          border: 1px solid rgba(216, 178, 141, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 36px;
        }

        .cta-tag {
          display: inline-block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #d8b28d;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .cta-heading {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          color: #ffffff;
          margin-bottom: 8px;
        }

        .cta-sub {
          font-size: 0.96rem;
          color: var(--primary-200);
          max-width: 580px;
        }

        .cta-right {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
        }

        .cta-action-btn {
          padding: 15px 30px;
          font-size: 1rem;
        }

        .cta-phone-btn {
          color: #ffffff;
          border-color: rgba(216, 178, 141, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }

        .cta-phone-btn:hover {
          background: rgba(216, 178, 141, 0.2);
          color: #ffffff;
        }

        .main-footer-body {
          padding: 40px 0 30px 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.2fr 1.3fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .footer-brand-link {
          display: inline-block;
          margin-bottom: 20px;
        }
        .footer-logo-img {
          height: 52px;
          width: auto;
          max-width: 280px;
          object-fit: contain;
          display: block;
        }

        .footer-about {
          font-size: 0.88rem;
          color: var(--primary-300);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .footer-social-links {
          display: flex;
          gap: 12px;
        }

        .footer-social-links a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: var(--transition);
        }

        .footer-social-links a:hover {
          background: var(--primary-600);
          transform: translateY(-2px);
        }

        .footer-col-title {
          font-size: 1.05rem;
          color: #ffffff;
          margin-bottom: 18px;
          font-weight: 700;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links a {
          font-size: 0.88rem;
          color: var(--primary-300);
          transition: var(--transition);
        }

        .footer-links a:hover {
          color: #d8b28d;
          padding-left: 4px;
        }

        .footer-contact-items {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .contact-line {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.86rem;
          color: var(--primary-200);
          line-height: 1.45;
        }

        .contact-icon {
          flex-shrink: 0;
          margin-top: 2px;
          color: #d8b28d;
        }

        .contact-line a {
          color: var(--primary-200);
          transition: var(--transition);
        }

        .contact-line a:hover {
          color: #d8b28d;
        }

        .footer-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.82rem;
          color: var(--primary-300);
        }

        .scroll-top-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--primary-300);
          font-size: 0.82rem;
          font-weight: 600;
          transition: var(--transition);
        }

        .scroll-top-btn:hover {
          color: #d8b28d;
        }

        @media (max-width: 1024px) {
          .cta-box {
            flex-direction: column;
            text-align: center;
          }
          .cta-right {
            width: 100%;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom-bar {
            flex-direction: column;
            gap: 14px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
