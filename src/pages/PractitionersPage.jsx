import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  User, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Languages, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Share2
} from 'lucide-react';
import { getStoredPractitioners, syncPractitionersFromDb, DISCIPLINE_FILTERS } from '../data/practitioners';

export default function PractitionersPage() {
  const [practitioners, setPractitioners] = useState(() => getStoredPractitioners());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const JANEAPP_BASE = "https://reverewellness.janeapp.com/";

  useEffect(() => {
    // Fetch latest practitioners from Supabase database
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
  }, []);

  const filteredPractitioners = useMemo(() => {
    return practitioners.filter(p => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || p.disciplineCategory === selectedCategory;
      if (!matchesCategory) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (p.name || '').toLowerCase().includes(q) || (p.professionalName || '').toLowerCase().includes(q);
      const titleMatch = (p.title || '').toLowerCase().includes(q);
      const specialtyMatch = (p.specialties || []).some(s => s.toLowerCase().includes(q));
      const educationMatch = (p.education || '').toLowerCase().includes(q);
      const bioMatch = (p.bio || '').toLowerCase().includes(q);
      const languageMatch = (p.languages || []).some(l => l.toLowerCase().includes(q));

      return nameMatch || titleMatch || specialtyMatch || educationMatch || bioMatch || languageMatch;
    });
  }, [practitioners, selectedCategory, searchQuery]);

  return (
    <div className="practitioners-page">
      {/* Hero Section */}
      <section className="practitioners-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} className="hero-badge-icon" />
              <span>Licensed Healthcare Practitioners in Surrey, BC</span>
            </div>
            <h1 className="hero-title">
              Meet Our Practitioners & Care Team
            </h1>
            <p className="hero-subtitle">
              Browse our team of Registered Massage Therapists (RMTs), Registered Physiotherapists, 
              and Kinesiologists. Read their comprehensive bios, discover their clinical specialties, 
              and book directly onto their schedule through JaneApp.
            </p>

            {/* Trust Highlights */}
            <div className="hero-trust-bar">
              <div className="trust-item">
                <ShieldCheck size={18} className="trust-icon" />
                <span>CCHPBC & CHCPBC Regulated</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={18} className="trust-icon" />
                <span>ICBC & Extended Health Direct Billing</span>
              </div>
              <div className="trust-item">
                <Clock size={18} className="trust-icon" />
                <span>Open 7 Days • 6:30 AM – 8:00 PM</span>
              </div>
              <div className="trust-item">
                <MapPin size={18} className="trust-icon" />
                <span>Free Reserved Parking (Stalls #36–38)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-controls-card glass-card">
            {/* Category Pills */}
            <div className="category-pills">
              {DISCIPLINE_FILTERS.map(cat => {
                const count = cat.id === 'all' 
                  ? practitioners.length 
                  : practitioners.filter(p => p.disciplineCategory === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="search-bar-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by therapist name, technique, condition (e.g. Deep Tissue, TMJ, ICBC)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search practitioners"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-status">
            <span>Showing <strong>{filteredPractitioners.length}</strong> practitioner{filteredPractitioners.length === 1 ? '' : 's'}</span>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button 
                className="reset-filters-btn"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Practitioners Grid */}
      <section className="practitioners-grid-section">
        <div className="container">
          {filteredPractitioners.length === 0 ? (
            <div className="empty-results glass-card">
              <User size={48} className="empty-icon" />
              <h3>No practitioners matched your search</h3>
              <p>Try searching for a different keyword or reset your discipline filter.</p>
              <button 
                className="btn btn-primary"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              >
                View All Practitioners
              </button>
            </div>
          ) : (
            <div className="practitioners-grid">
              {filteredPractitioners.map((practitioner) => (
                <div key={practitioner.id} className="practitioner-card glass-card">
                  {/* Card Media / Image Header */}
                  <div className="card-photo-wrapper">
                    {practitioner.photo ? (
                      <img 
                        src={practitioner.photo} 
                        alt={practitioner.name} 
                        className="practitioner-photo" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="photo-placeholder">
                        <div className="avatar-monogram">
                          {practitioner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="placeholder-role">{practitioner.title}</span>
                      </div>
                    )}
                    <div className="photo-badge-wrapper">
                      <span className="discipline-tag">{practitioner.disciplineLabel}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <div className="card-title-group">
                      <h2 className="practitioner-name">
                        <Link to={`/practitioners/${practitioner.slug}`}>
                          {practitioner.name}
                        </Link>
                      </h2>
                      <div className="practitioner-title-text">{practitioner.title}</div>
                      <div className="practitioner-credentials">{practitioner.credentials}</div>
                    </div>

                    {/* Metadata chips */}
                    <div className="practitioner-meta">
                      {practitioner.education && (
                        <div className="meta-item" title="Education & Training">
                          <GraduationCap size={14} className="meta-icon" />
                          <span className="meta-text">{practitioner.education}</span>
                        </div>
                      )}
                      {practitioner.languages && practitioner.languages.length > 0 && (
                        <div className="meta-item" title="Languages Spoken">
                          <Languages size={14} className="meta-icon" />
                          <span className="meta-text">{practitioner.languages.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Bio excerpt */}
                    <p className="card-bio">
                      {practitioner.shortBio}
                    </p>

                    {/* Specialties pills */}
                    <div className="specialties-pills">
                      {practitioner.specialties.slice(0, 4).map((spec, i) => (
                        <span key={i} className="spec-pill">{spec}</span>
                      ))}
                      {practitioner.specialties.length > 4 && (
                        <span className="spec-pill more-pill">+{practitioner.specialties.length - 4} more</span>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="card-actions">
                      <Link 
                        to={`/practitioners/${practitioner.slug}`}
                        className="btn-view-profile"
                      >
                        <span>View Bio & Profile</span>
                        <ChevronRight size={16} />
                      </Link>
                      <a 
                        href={practitioner.janeBookingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-book-practitioner"
                        title={`Book an appointment with ${practitioner.name} on JaneApp`}
                      >
                        <Calendar size={15} />
                        <span>Book Online</span>
                        <ExternalLink size={12} className="ext-icon" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Support / Quick Help Banner */}
      <section className="practitioners-cta-section">
        <div className="container">
          <div className="help-box glass-card">
            <div className="help-content">
              <span className="help-tag">Direct Scheduling Assistance</span>
              <h2>Need Help Choosing the Right Practitioner?</h2>
              <p>
                Our knowledgeable reception team is ready to match you with the right Registered Massage Therapist, 
                Physiotherapist, or Kinesiologist based on your unique health goals and schedule.
              </p>
            </div>
            <div className="help-buttons">
              <a href="tel:6045030855" className="btn btn-primary">
                <Phone size={18} />
                <span>Call (604) 503-0855</span>
              </a>
              <a 
                href={JANEAPP_BASE} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline"
              >
                <Calendar size={18} />
                <span>Full JaneApp Portal</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .practitioners-page {
          background-color: var(--neutral-50);
          min-height: 100vh;
        }

        /* Hero Section */
        .practitioners-hero {
          background: linear-gradient(180deg, var(--primary-900) 0%, var(--primary-950) 100%);
          color: #ffffff;
          padding: 56px 0 60px 0;
          position: relative;
          overflow: hidden;
        }
        .practitioners-hero::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(127, 125, 49, 0.25) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(216, 178, 141, 0.4);
          padding: 7px 18px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 600;
          color: #d8b28d;
          margin-bottom: 20px;
          backdrop-filter: blur(8px);
        }
        .hero-badge-icon {
          color: #d8b28d;
        }

        .hero-title {
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 18px;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--primary-100);
          line-height: 1.65;
          margin-bottom: 32px;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-trust-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(216, 178, 141, 0.25);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(12px);
        }
        .trust-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary-100);
        }
        .trust-icon {
          color: #d8b28d;
          flex-shrink: 0;
        }

        /* Filter Section */
        .filter-section {
          padding: 40px 0 20px 0;
          position: relative;
          z-index: 10;
          transform: translateY(-24px);
        }

        .filter-controls-card {
          padding: 24px;
          border-radius: var(--radius-xl);
          background: #ffffff;
          border: 1px solid rgba(216, 178, 141, 0.35);
          box-shadow: 0 16px 36px -10px rgba(51, 50, 19, 0.1);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .category-pills {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-full);
          background: var(--neutral-100);
          color: var(--primary-900);
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid transparent;
          transition: var(--transition);
        }
        .filter-pill:hover {
          background: var(--primary-50);
          color: var(--primary-700);
          border-color: rgba(127, 125, 49, 0.3);
        }
        .filter-pill.active {
          background: var(--primary-600);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(127, 125, 49, 0.35);
        }
        .pill-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          background: rgba(0, 0, 0, 0.08);
          font-weight: 700;
        }
        .filter-pill.active .pill-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .search-bar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 18px;
          color: var(--neutral-400);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 14px 90px 14px 48px;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--neutral-200);
          background: var(--neutral-50);
          color: var(--neutral-800);
          font-family: inherit;
          transition: var(--transition);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--primary-600);
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(127, 125, 49, 0.12);
        }
        .clear-search-btn {
          position: absolute;
          right: 16px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--neutral-600);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          background: var(--neutral-200);
          transition: var(--transition);
        }
        .clear-search-btn:hover {
          background: var(--neutral-300);
          color: var(--neutral-900);
        }

        .results-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 6px 0 6px;
          font-size: 0.9rem;
          color: var(--neutral-600);
        }
        .reset-filters-btn {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--primary-600);
          text-decoration: underline;
        }

        /* Grid */
        .practitioners-grid-section {
          padding: 10px 0 80px 0;
        }
        .practitioners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 32px;
        }

        .practitioner-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid rgba(216, 178, 141, 0.35);
          overflow: hidden;
          box-shadow: 0 12px 28px -10px rgba(51, 50, 19, 0.08);
          display: flex;
          flex-direction: column;
          transition: var(--transition);
        }
        .practitioner-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 45px -12px rgba(51, 50, 19, 0.18);
          border-color: rgba(127, 125, 49, 0.45);
        }

        .card-photo-wrapper {
          position: relative;
          width: 100%;
          height: 310px;
          background: var(--primary-50);
          overflow: hidden;
        }
        .practitioner-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .practitioner-card:hover .practitioner-photo {
          transform: scale(1.05);
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-950) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          padding: 24px;
        }
        .avatar-monogram {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: var(--primary-600);
          border: 3px solid rgba(216, 178, 141, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }
        .placeholder-role {
          font-size: 0.88rem;
          color: var(--primary-200);
          text-align: center;
          font-weight: 500;
        }

        .photo-badge-wrapper {
          position: absolute;
          bottom: 14px;
          left: 14px;
          z-index: 2;
        }
        .discipline-tag {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: rgba(31, 30, 10, 0.85);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(216, 178, 141, 0.4);
        }

        /* Card Body */
        .card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title-group {
          margin-bottom: 12px;
        }
        .practitioner-name {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--primary-900);
          margin-bottom: 4px;
        }
        .practitioner-name a {
          color: inherit;
          transition: var(--transition);
        }
        .practitioner-name a:hover {
          color: var(--primary-600);
        }

        .practitioner-title-text {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--primary-700);
          margin-bottom: 2px;
        }
        .practitioner-credentials {
          font-size: 0.8rem;
          color: #7d5b3e;
          font-weight: 600;
        }

        .practitioner-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px 0;
          border-top: 1px solid var(--neutral-100);
          border-bottom: 1px solid var(--neutral-100);
          margin-bottom: 14px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--neutral-700);
        }
        .meta-icon {
          color: var(--primary-600);
          flex-shrink: 0;
        }
        .meta-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-bio {
          font-size: 0.88rem;
          color: var(--neutral-700);
          line-height: 1.55;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }

        .specialties-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }
        .spec-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          background: var(--primary-50);
          color: var(--primary-800);
          border: 1px solid rgba(127, 125, 49, 0.2);
        }
        .spec-pill.more-pill {
          background: var(--neutral-100);
          color: var(--neutral-600);
          border-color: var(--neutral-200);
        }

        .card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--neutral-100);
        }
        .btn-view-profile {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          font-size: 0.86rem;
          font-weight: 700;
          background: var(--neutral-100);
          color: var(--primary-900);
          border: 1px solid var(--neutral-200);
          transition: var(--transition);
          text-align: center;
        }
        .btn-view-profile:hover {
          background: var(--primary-50);
          border-color: var(--primary-400);
          color: var(--primary-700);
        }

        .btn-book-practitioner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          font-size: 0.86rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%);
          color: #ffffff;
          transition: var(--transition);
          text-align: center;
          box-shadow: 0 4px 12px rgba(51, 50, 19, 0.2);
        }
        .btn-book-practitioner:hover {
          background: linear-gradient(135deg, #c99d75 0%, #b58963 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(181, 137, 99, 0.35);
        }

        /* Help Box */
        .practitioners-cta-section {
          padding-bottom: 80px;
        }
        .help-box {
          padding: 44px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%);
          border: 1px solid rgba(216, 178, 141, 0.35);
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          box-shadow: 0 20px 40px -10px rgba(51, 50, 19, 0.3);
        }
        .help-tag {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #d8b28d;
          margin-bottom: 8px;
        }
        .help-content h2 {
          color: #ffffff;
          font-size: 1.8rem;
          margin-bottom: 8px;
        }
        .help-content p {
          color: var(--primary-100);
          max-width: 580px;
          font-size: 0.98rem;
        }
        .help-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
        }

        .empty-results {
          padding: 60px;
          text-align: center;
          border-radius: var(--radius-xl);
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .empty-icon {
          color: var(--neutral-400);
        }

        @media (max-width: 900px) {
          .help-box {
            flex-direction: column;
            text-align: center;
          }
          .help-buttons {
            width: 100%;
          }
          .practitioners-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
