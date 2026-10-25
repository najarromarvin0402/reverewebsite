import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Check, 
  Save, 
  RotateCcw, 
  Mail, 
  Calendar, 
  Users, 
  Clock, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Tag,
  Upload,
  Image as ImageIcon,
  Code,
  Layers,
  Play,
  X,
  FileText,
  Film,
  Video as VideoIcon,
  Volume2,
  VolumeX,
  Database
} from 'lucide-react';
import { 
  getClinicSettings, 
  saveClinicSettings, 
  resetClinicSettings, 
  syncClinicSettingsFromDb,
  cleanPhoneForWhatsApp, 
  getWhatsAppUrl,
  getPromoModalStatus,
  formatLocalDateTime,
  saveMediaItem,
  getMediaItem,
  deleteMediaItem,
  formatVideoEmbedUrl
} from '../lib/settings';
import { fetchInquiries, deleteInquiry, isSupabaseConfigured } from '../lib/supabase';
import PromotionalModal from '../components/PromotionalModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Active Admin Tab: 'promo' | 'whatsapp' | 'inbox' | 'general'
  const [activeTab, setActiveTab] = useState('promo');

  // Settings State
  const [settings, setSettings] = useState(getClinicSettings());
  const [saveToast, setSaveToast] = useState(false);

  // Live Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);

  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const [adminVideoPreviewUrl, setAdminVideoPreviewUrl] = useState('');

  // Resolve video preview if stored in IndexedDB or direct link
  useEffect(() => {
    let activeUrl = null;
    const vUrl = settings.promoModal?.videoUrl;
    if (vUrl?.startsWith('idb:')) {
      const key = vUrl.replace('idb:', '');
      getMediaItem(key).then(blob => {
        if (blob) {
          activeUrl = URL.createObjectURL(blob);
          setAdminVideoPreviewUrl(activeUrl);
        }
      });
    } else if (vUrl) {
      setAdminVideoPreviewUrl(vUrl);
    } else {
      setAdminVideoPreviewUrl('');
    }

    return () => {
      if (activeUrl && activeUrl.startsWith('blob:')) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [settings.promoModal?.videoUrl]);

  useEffect(() => {
    // Check if already authenticated this session
    const sessionAuth = sessionStorage.getItem('revere_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }

    loadInquiries();

    // Fetch latest settings from Supabase database
    syncClinicSettingsFromDb().then(updated => {
      if (updated) setSettings(updated);
    });

    const handleSettingsSync = (e) => {
      if (e?.detail) setSettings(e.detail);
    };
    window.addEventListener('revere-settings-updated', handleSettingsSync);
    return () => window.removeEventListener('revere-settings-updated', handleSettingsSync);
  }, []);

  const loadInquiries = async () => {
    try {
      const list = await fetchInquiries();
      setInquiries(list);
    } catch (e) {
      console.warn('Error loading inquiries:', e);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === settings.adminPin || pinInput.trim() === 'revere2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('revere_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Default PIN is: revere2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('revere_admin_auth');
    setPinInput('');
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    const updated = saveClinicSettings(settings);
    setSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  // Instant Auto-Save for Enable/Disable Toggle
  const handleTogglePromoEnabled = (newVal) => {
    const updated = {
      ...settings,
      promoModal: {
        ...settings.promoModal,
        enabled: newVal
      }
    };
    setSettings(updated);
    saveClinicSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all settings to initial defaults?')) {
      const defaults = resetClinicSettings();
      setSettings(defaults);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  // Image Upload handler with Canvas auto-compression to avoid localStorage quota issues
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const updated = {
          ...settings,
          promoModal: {
            ...settings.promoModal,
            imageUrl: compressedDataUrl,
            contentType: 'image'
          }
        };
        setSettings(updated);
        saveClinicSettings(updated);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3000);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    const updated = {
      ...settings,
      promoModal: {
        ...settings.promoModal,
        imageUrl: ''
      }
    };
    setSettings(updated);
    saveClinicSettings(updated);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('Video file is larger than 50MB. Please use a compressed clip or paste an external video link.');
      return;
    }

    await saveMediaItem('promo_video_blob', file);
    const blobUrl = URL.createObjectURL(file);
    setAdminVideoPreviewUrl(blobUrl);

    const updated = {
      ...settings,
      promoModal: {
        ...settings.promoModal,
        videoUrl: 'idb:promo_video_blob',
        contentType: 'video'
      }
    };
    setSettings(updated);
    saveClinicSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleRemoveVideo = async () => {
    await deleteMediaItem('promo_video_blob');
    setAdminVideoPreviewUrl('');
    const updated = {
      ...settings,
      promoModal: {
        ...settings.promoModal,
        videoUrl: ''
      }
    };
    setSettings(updated);
    saveClinicSettings(updated);
    if (videoFileInputRef.current) videoFileInputRef.current.value = '';
  };

  const handleSetQuickSchedule = (days) => {
    const now = new Date();
    const startStr = formatLocalDateTime(now);
    const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const endStr = formatLocalDateTime(end);

    const updated = {
      ...settings,
      promoModal: {
        ...settings.promoModal,
        startDateTime: startStr,
        endDateTime: endStr,
        enabled: true
      }
    };
    setSettings(updated);
    saveClinicSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleClearSchedule = () => {
    const updated = {
      ...settings,
      promoModal: {
        ...settings.promoModal,
        startDateTime: '',
        endDateTime: '',
        enabled: true
      }
    };
    setSettings(updated);
    saveClinicSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleClearSessionDismissal = () => {
    try {
      Object.keys(sessionStorage).forEach(k => {
        if (k.startsWith('revere_promo_dismissed')) {
          sessionStorage.removeItem(k);
        }
      });
      alert('Visitor dismissal cache cleared! The popup modal will show on your next visit to the website.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInquiry = async (id) => {
    try {
      const updated = inquiries.filter(item => item.id !== id);
      setInquiries(updated);
      await deleteInquiry(id);
    } catch (e) {
      console.error('Error deleting inquiry:', e);
    }
  };

  const promoStatus = getPromoModalStatus(settings.promoModal);
  const cleanNumber = cleanPhoneForWhatsApp(settings.whatsappNumber);
  const testWhatsAppUrl = getWhatsAppUrl(settings.whatsappNumber, settings.whatsappGreeting);

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="login-card glass-card">
          <div className="login-icon-box">
            <Lock size={32} />
          </div>
          <h1 className="login-title">Clinic Management Portal</h1>
          <p className="login-subtitle">
            Enter your admin PIN to manage promotional popup ads, WhatsApp integration, and incoming website inquiries.
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="pin-input-wrapper">
              <input
                type={showPin ? "text" : "password"}
                placeholder="Enter Admin PIN"
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setPinError(''); }}
                className="pin-input"
                autoFocus
              />
              <button
                type="button"
                className="toggle-pin-btn"
                onClick={() => setShowPin(!showPin)}
                title="Toggle PIN visibility"
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {pinError && <div className="pin-error-text">{pinError}</div>}

            <button type="submit" className="btn btn-primary full-width">
              <Unlock size={16} />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="login-hint">
            <HelpCircle size={14} />
            <span>Default PIN: <code>revere2026</code> (changeable inside)</span>
          </div>

          <div className="login-footer">
            <Link to="/" className="back-home-link">
              <ArrowLeft size={14} />
              <span>Back to Website</span>
            </Link>
          </div>
        </div>

        <style>{`
          .admin-login-page {
            min-height: 85vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: linear-gradient(180deg, var(--primary-900) 0%, var(--primary-950) 100%);
          }
          .login-card {
            width: 100%;
            max-width: 440px;
            background: #ffffff;
            border-radius: var(--radius-xl);
            padding: 40px 32px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
            text-align: center;
            border: 1px solid rgba(216, 178, 141, 0.4);
          }
          .login-icon-box {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: var(--primary-50);
            color: var(--primary-700);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 18px auto;
            border: 1px solid rgba(127, 125, 49, 0.3);
          }
          .login-title {
            font-size: 1.55rem;
            color: var(--primary-900);
            margin-bottom: 8px;
          }
          .login-subtitle {
            font-size: 0.88rem;
            color: var(--neutral-600);
            line-height: 1.5;
            margin-bottom: 24px;
          }
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .pin-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }
          .pin-input {
            width: 100%;
            padding: 14px 44px 14px 16px;
            font-size: 1.1rem;
            text-align: center;
            letter-spacing: 0.15em;
            border: 1.5px solid var(--neutral-300);
            border-radius: var(--radius-md);
            font-family: inherit;
          }
          .pin-input:focus {
            outline: none;
            border-color: var(--primary-600);
            box-shadow: 0 0 0 4px rgba(127, 125, 49, 0.15);
          }
          .toggle-pin-btn {
            position: absolute;
            right: 14px;
            color: var(--neutral-400);
            cursor: pointer;
          }
          .pin-error-text {
            color: #b91c1c;
            font-size: 0.82rem;
            font-weight: 600;
          }
          .full-width {
            width: 100%;
            justify-content: center;
          }
          .login-hint {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.8rem;
            color: var(--neutral-500);
            margin-top: 20px;
          }
          .login-hint code {
            background: var(--neutral-100);
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 700;
            color: var(--primary-800);
          }
          .login-footer {
            margin-top: 24px;
            padding-top: 18px;
            border-top: 1px solid var(--neutral-200);
          }
          .back-home-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.86rem;
            color: var(--primary-700);
            font-weight: 600;
          }
          .back-home-link:hover {
            color: var(--primary-900);
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Admin Top Header */}
      <header className="admin-header">
        <div className="container admin-header-container">
          <div className="admin-brand">
            <span className="admin-badge">
              <ShieldCheck size={14} /> Clinic Admin Portal
            </span>
            {isSupabaseConfigured ? (
              <span className="admin-badge" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
                <Database size={14} /> Cloud Database Active
              </span>
            ) : (
              <span className="admin-badge" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
                <Database size={14} /> Local Cache Mode
              </span>
            )}
            <h1 className="admin-heading">Revere Wellness Control Center</h1>
          </div>
          <div className="admin-top-actions">
            <Link to="/" className="btn-admin-preview" target="_blank" rel="noopener noreferrer">
              <span>View Live Website</span>
              <ExternalLink size={14} />
            </Link>
            <button className="btn-admin-logout" onClick={handleLogout}>
              <Lock size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tab Navigation Bar */}
      <nav className="admin-tabs-nav">
        <div className="container admin-tabs-container">
          <button 
            className={`admin-tab-btn ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
            <Tag size={16} />
            <span>Promotional Popup & Ads</span>
            <span className={`tab-indicator-pill ${promoStatus.status}`}>
              {promoStatus.label}
            </span>
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <MessageCircle size={16} />
            <span>WhatsApp Chat Settings</span>
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            <Mail size={16} />
            <span>Inquiries Inbox</span>
            {inquiries.length > 0 && (
              <span className="tab-badge-count">{inquiries.length}</span>
            )}
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Lock size={16} />
            <span>Clinic Info & PIN</span>
          </button>
        </div>
      </nav>

      {/* Main Body */}
      <main className="admin-main-body">
        <div className="container">
          {saveToast && (
            <div className="admin-toast success">
              <CheckCircle2 size={18} />
              <span>Settings saved successfully! Website updates take effect immediately in real time.</span>
            </div>
          )}

          {/* TAB 1: PROMOTIONAL POPUP & ADS SETTINGS */}
          {activeTab === 'promo' && (
            <div className="tab-content-wrapper">
              <form onSubmit={handleSaveSettings} className="admin-card glass-card">
                <div className="card-header">
                  <div className="header-icon-box promo-icon-box">
                    <Tag size={22} />
                  </div>
                  <div>
                    <div className="title-row">
                      <h2 className="card-title">Promotional Popup & Announcement Ads</h2>
                      <div className="status-and-test-group">
                        <span className={`promo-status-badge ${promoStatus.status}`}>
                          {promoStatus.status === 'active' && '🟢 Active on Website'}
                          {promoStatus.status === 'upcoming' && '🟡 Scheduled (Upcoming)'}
                          {promoStatus.status === 'expired' && '🔴 Expired (Ended)'}
                          {promoStatus.status === 'disabled' && '⚪ Disabled'}
                        </span>
                        <a 
                          href="/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-quick-test"
                          title="Open website homepage in new tab to see popup"
                        >
                          <ExternalLink size={14} />
                          <span>View Live Site</span>
                        </a>
                        <button 
                          type="button" 
                          onClick={handleClearSessionDismissal}
                          className="btn-quick-reset-cache"
                          title="If you dismissed the popup earlier, click this to reset visitor memory so it shows immediately"
                        >
                          <RotateCcw size={13} />
                          <span>Reset Test Dismissal</span>
                        </button>
                      </div>
                    </div>
                    <p className="card-subtitle">
                      Configure a targeted popup modal to display seasonal discounts, gift cards, or special events. Upload an image banner or embed an animation script with automated appearance & disappearance scheduling.
                    </p>
                  </div>
                </div>

                <div className="form-fields-group">
                  {/* Master Toggle with Instant Auto-Save */}
                  <div className="promo-enable-card">
                    <div className="enable-info">
                      <div className="enable-status-line">
                        <strong>Enable Promotional Popup Modal</strong>
                        <span className={`state-tag ${settings.promoModal?.enabled ? 'tag-enabled' : 'tag-disabled'}`}>
                          {settings.promoModal?.enabled ? '✓ Enabled & Saved' : '✕ Disabled'}
                        </span>
                      </div>
                      <p>When enabled and within the scheduled dates, visitors will see this popup on the website.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox"
                        checked={settings.promoModal?.enabled || false}
                        onChange={(e) => handleTogglePromoEnabled(e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  {/* Scheduling Section: Date and Time of Appearance & Disappearance */}
                  <div className="form-section-box">
                    <div className="section-box-header">
                      <Clock size={16} className="text-olive" />
                      <strong>Automated Schedule (Appearance & Disappearance)</strong>
                    </div>
                    <p className="section-box-desc">
                      Set exact dates and times for when the promotion will automatically start appearing and when it will disappear.
                    </p>

                    <div className="form-row-2">
                      <div className="form-field">
                        <label className="field-label">
                          <span>Start Date & Time (Appear)</span>
                          <span className="field-note">When popup begins</span>
                        </label>
                        <input 
                          type="datetime-local"
                          value={settings.promoModal.startDateTime || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, startDateTime: e.target.value }
                          }))}
                          className="form-input"
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">
                          <span>End Date & Time (Disappear)</span>
                          <span className="field-note">When popup stops</span>
                        </label>
                        <input 
                          type="datetime-local"
                          value={settings.promoModal.endDateTime || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, endDateTime: e.target.value }
                          }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="schedule-presets">
                      <span className="presets-label">Quick Presets:</span>
                      <button 
                        type="button" 
                        className="preset-btn"
                        onClick={() => handleSetQuickSchedule(7)}
                      >
                        + 7 Days From Now
                      </button>
                      <button 
                        type="button" 
                        className="preset-btn"
                        onClick={() => handleSetQuickSchedule(14)}
                      >
                        + 14 Days From Now
                      </button>
                      <button 
                        type="button" 
                        className="preset-btn"
                        onClick={() => handleSetQuickSchedule(30)}
                      >
                        + 30 Days From Now
                      </button>
                      <button 
                        type="button" 
                        className="preset-btn text-muted"
                        onClick={handleClearSchedule}
                      >
                        Always Active (Clear Dates)
                      </button>
                    </div>
                  </div>

                  {/* Content Type: Image Banner vs Animation Script */}
                  <div className="form-section-box">
                    <div className="section-box-header">
                      <Layers size={16} className="text-olive" />
                      <strong>Promotion Creative Format</strong>
                    </div>

                    <div className="content-type-selector">
                      <label className={`type-card ${settings.promoModal.contentType === 'image' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="contentType" 
                          value="image"
                          checked={settings.promoModal.contentType === 'image'}
                          onChange={() => {
                            const updated = {
                              ...settings,
                              promoModal: { ...settings.promoModal, contentType: 'image' }
                            };
                            setSettings(updated);
                            saveClinicSettings(updated);
                          }}
                        />
                        <ImageIcon size={20} />
                        <div>
                          <strong>Upload Image Banner</strong>
                          <p>Upload a promotional poster, flyer, or photo.</p>
                        </div>
                      </label>

                      <label className={`type-card ${settings.promoModal.contentType === 'video' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="contentType" 
                          value="video"
                          checked={settings.promoModal.contentType === 'video'}
                          onChange={() => {
                            const updated = {
                              ...settings,
                              promoModal: { ...settings.promoModal, contentType: 'video' }
                            };
                            setSettings(updated);
                            saveClinicSettings(updated);
                          }}
                        />
                        <Film size={20} />
                        <div>
                          <strong>Video Clip / Reel Ad</strong>
                          <p>Upload MP4 video (Canva, Reel) or paste a video link.</p>
                        </div>
                      </label>

                      <label className={`type-card ${settings.promoModal.contentType === 'script' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="contentType" 
                          value="script"
                          checked={settings.promoModal.contentType === 'script'}
                          onChange={() => {
                            const updated = {
                              ...settings,
                              promoModal: { ...settings.promoModal, contentType: 'script' }
                            };
                            setSettings(updated);
                            saveClinicSettings(updated);
                          }}
                        />
                        <Code size={20} />
                        <div>
                          <strong>Animation Script / HTML Embed</strong>
                          <p>Embed custom HTML/CSS, Lottie animation, or badge code.</p>
                        </div>
                      </label>
                    </div>

                    {/* IMAGE UPLOAD UI */}
                    {settings.promoModal.contentType === 'image' && (
                      <div className="creative-panel">
                        <label className="field-label">Promotional Image</label>
                        
                        {settings.promoModal.imageUrl ? (
                          <div className="image-preview-box">
                            <img 
                              src={settings.promoModal.imageUrl} 
                              alt="Promotion Preview" 
                              className="image-preview-thumb"
                            />
                            <div className="image-preview-controls">
                              <span className="preview-status-text">✓ Image Loaded</span>
                              <button 
                                type="button" 
                                className="btn-remove-image"
                                onClick={handleRemoveImage}
                              >
                                <Trash2 size={14} /> Remove Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="upload-dropzone"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload size={32} className="upload-icon" />
                            <strong>Click to Upload Promotional Image</strong>
                            <p>Supports PNG, JPG, WebP, GIF (Max 4MB)</p>
                            <button type="button" className="btn-browse-file">
                              Choose File
                            </button>
                          </div>
                        )}

                        <input 
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          accept="image/*"
                          onChange={handleImageFileChange}
                        />

                        {/* Or URL input */}
                        <div className="url-alternative">
                          <label className="field-label-sm">Or Enter Image URL:</label>
                          <input 
                            type="text"
                            placeholder="https://example.com/banner.jpg"
                            value={settings.promoModal.imageUrl || ''}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              promoModal: { ...prev.promoModal, imageUrl: e.target.value }
                            }))}
                            className="form-input"
                          />
                        </div>

                        {/* Image Sizing & Fit Mode Options */}
                        <div className="image-fit-control">
                          <label className="field-label-sm">Image Sizing & Display Fit:</label>
                          <div className="fit-options-group">
                            <label className={`fit-pill ${settings.promoModal.imageFit === 'contain' || !settings.promoModal.imageFit ? 'active' : ''}`}>
                              <input 
                                type="radio" 
                                name="imageFit" 
                                value="contain"
                                checked={settings.promoModal.imageFit === 'contain' || !settings.promoModal.imageFit}
                                onChange={() => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, imageFit: 'contain' }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              />
                              <div className="fit-pill-text">
                                <strong>Always Fit Entire Graphic (Recommended)</strong>
                                <span>Auto-adjusts so 100% of the image is visible without ever being cut off or cropped.</span>
                              </div>
                            </label>

                            <label className={`fit-pill ${settings.promoModal.imageFit === 'cover' ? 'active' : ''}`}>
                              <input 
                                type="radio" 
                                name="imageFit" 
                                value="cover"
                                checked={settings.promoModal.imageFit === 'cover'}
                                onChange={() => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, imageFit: 'cover' }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              />
                              <div className="fit-pill-text">
                                <strong>Crop & Fill Banner (Cover)</strong>
                                <span>Fills the banner box completely (may crop top/bottom on tall flyers).</span>
                              </div>
                            </label>

                            <label className={`fit-pill ${settings.promoModal.imageFit === 'natural' ? 'active' : ''}`}>
                              <input 
                                type="radio" 
                                name="imageFit" 
                                value="natural"
                                checked={settings.promoModal.imageFit === 'natural'}
                                onChange={() => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, imageFit: 'natural' }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              />
                              <div className="fit-pill-text">
                                <strong>Natural Tall Poster Height</strong>
                                <span>Displays full portrait height, with scrolling inside the popup card if needed.</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Popup Modal Width Selector */}
                        <div className="image-fit-control">
                          <label className="field-label-sm">Popup Modal Card Width:</label>
                          <div className="card-width-pills">
                            {[
                              { id: 'compact', label: 'Compact (440px)', desc: 'Best for vertical flyers' },
                              { id: 'standard', label: 'Standard (540px)', desc: 'Balanced for all screens' },
                              { id: 'wide', label: 'Wide (680px)', desc: 'Best for wide banners' }
                            ].map((w) => (
                              <button
                                key={w.id}
                                type="button"
                                className={`width-option-btn ${(settings.promoModal.cardWidth || 'standard') === w.id ? 'active' : ''}`}
                                onClick={() => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, cardWidth: w.id }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              >
                                <strong>{w.label}</strong>
                                <span>{w.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Toggle to show/hide text below image */}
                        <div className="image-fit-control">
                          <label className="field-label-sm">Popup Display Layout:</label>
                          <div className="display-layout-toggle-card">
                            <div className="enable-info">
                              <strong>Show Text Headline & Details Below Image</strong>
                              <p>Turn this OFF if your uploaded image is already a complete flyer that has all the headline text designed into it.</p>
                            </div>
                            <label className="switch">
                              <input 
                                type="checkbox"
                                checked={settings.promoModal.showTextDetails !== false}
                                onChange={(e) => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, showTextDetails: e.target.checked }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIDEO UPLOAD & CONFIG UI */}
                    {settings.promoModal.contentType === 'video' && (
                      <div className="creative-panel">
                        <label className="field-label">Promotional Video Ad</label>

                        {adminVideoPreviewUrl ? (
                          <div className="image-preview-box video-admin-preview-box">
                            {(settings.promoModal.videoUrl?.includes('youtube') || settings.promoModal.videoUrl?.includes('youtu.be') || settings.promoModal.videoUrl?.includes('vimeo')) ? (
                              <div className="promo-video-iframe-wrapper">
                                <iframe
                                  src={formatVideoEmbedUrl(settings.promoModal.videoUrl)}
                                  title="Admin Video Preview"
                                  frameBorder="0"
                                  className="promo-video-iframe"
                                />
                              </div>
                            ) : (
                              <video 
                                src={adminVideoPreviewUrl} 
                                controls 
                                className="video-admin-player"
                              />
                            )}
                            <div className="image-preview-controls">
                              <span className="preview-status-text">✓ Video Clip Ready</span>
                              <button 
                                type="button" 
                                className="btn-remove-image"
                                onClick={handleRemoveVideo}
                              >
                                <Trash2 size={14} /> Remove Video
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="upload-dropzone"
                            onClick={() => videoFileInputRef.current?.click()}
                          >
                            <Film size={34} className="upload-icon" />
                            <strong>Click to Upload Promotional Video File</strong>
                            <p>Supports MP4, WebM, MOV (Canva Video, Instagram Reel, Promo Clip - Max 50MB)</p>
                            <button type="button" className="btn-browse-file">
                              Choose Video File
                            </button>
                          </div>
                        )}

                        <input 
                          type="file"
                          ref={videoFileInputRef}
                          style={{ display: 'none' }}
                          accept="video/mp4,video/webm,video/quicktime,video/*"
                          onChange={handleVideoFileChange}
                        />

                        {/* Or Video URL input */}
                        <div className="url-alternative">
                          <label className="field-label-sm">Or Enter Direct Video / YouTube / Vimeo URL:</label>
                          <input 
                            type="text"
                            placeholder="https://example.com/promo.mp4 or YouTube / Vimeo link"
                            value={settings.promoModal.videoUrl?.startsWith('idb:') ? '' : (settings.promoModal.videoUrl || '')}
                            onChange={(e) => {
                              const updated = {
                                ...settings,
                                promoModal: { ...settings.promoModal, videoUrl: e.target.value }
                              };
                              setSettings(updated);
                              saveClinicSettings(updated);
                            }}
                            className="form-input"
                          />
                        </div>

                        {/* Video Playback Options */}
                        <div className="image-fit-control">
                          <label className="field-label-sm">Video Playback Settings:</label>
                          <div className="fit-options-group">
                            <label className="fit-pill">
                              <input 
                                type="checkbox"
                                checked={settings.promoModal.videoAutoplay !== false}
                                onChange={(e) => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, videoAutoplay: e.target.checked }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              />
                              <div className="fit-pill-text">
                                <strong>Autoplay When Popup Appears</strong>
                                <span>Starts playing automatically (muted by default to comply with browser policies).</span>
                              </div>
                            </label>

                            <label className="fit-pill">
                              <input 
                                type="checkbox"
                                checked={settings.promoModal.videoLoop !== false}
                                onChange={(e) => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, videoLoop: e.target.checked }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              />
                              <div className="fit-pill-text">
                                <strong>Loop Video Continuously</strong>
                                <span>Replays the video seamlessly from start to finish.</span>
                              </div>
                            </label>

                            <label className="fit-pill">
                              <input 
                                type="checkbox"
                                checked={settings.promoModal.videoControls !== false}
                                onChange={(e) => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, videoControls: e.target.checked }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              />
                              <div className="fit-pill-text">
                                <strong>Show Video Player Bar</strong>
                                <span>Allows visitors to pause, seek, and adjust volume on the video.</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Popup Modal Width Selector */}
                        <div className="image-fit-control">
                          <label className="field-label-sm">Popup Modal Card Width:</label>
                          <div className="card-width-pills">
                            {[
                              { id: 'compact', label: 'Compact (440px)', desc: 'Best for 9:16 vertical video reels' },
                              { id: 'standard', label: 'Standard (540px)', desc: 'Balanced for 1:1 or 4:5 videos' },
                              { id: 'wide', label: 'Wide (680px)', desc: 'Best for 16:9 landscape videos' }
                            ].map((w) => (
                              <button
                                key={w.id}
                                type="button"
                                className={`width-option-btn ${(settings.promoModal.cardWidth || 'standard') === w.id ? 'active' : ''}`}
                                onClick={() => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, cardWidth: w.id }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              >
                                <strong>{w.label}</strong>
                                <span>{w.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Toggle to show/hide text below video */}
                        <div className="image-fit-control">
                          <label className="field-label-sm">Popup Display Layout:</label>
                          <div className="display-layout-toggle-card">
                            <div className="enable-info">
                              <strong>Show Text Headline & Details Below Video</strong>
                              <p>Turn this OFF if your video already contains all text and offers, and you just want the video and booking button.</p>
                            </div>
                            <label className="switch">
                              <input 
                                type="checkbox"
                                checked={settings.promoModal.showTextDetails !== false}
                                onChange={(e) => {
                                  const updated = {
                                    ...settings,
                                    promoModal: { ...settings.promoModal, showTextDetails: e.target.checked }
                                  };
                                  setSettings(updated);
                                  saveClinicSettings(updated);
                                }}
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ANIMATION SCRIPT UI */}
                    {settings.promoModal.contentType === 'script' && (
                      <div className="creative-panel">
                        <label className="field-label">Custom Animation Script / Embed Code</label>
                        <textarea 
                          rows="6"
                          className="form-textarea code-textarea"
                          placeholder={`<div style="text-align: center; padding: 24px;">\n  <div class="pulsing-badge">🎉 20% OFF HOLIDAY SPECIAL</div>\n</div>`}
                          value={settings.promoModal.animationScript || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, animationScript: e.target.value }
                          }))}
                        ></textarea>
                        <span className="field-hint">
                          Paste your custom animation HTML, CSS, SVG, or embed script here.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Headline & Offer Copy */}
                  <div className="form-section-box">
                    <div className="section-box-header">
                      <FileText size={16} className="text-olive" />
                      <strong>Headline & Promotional Message</strong>
                    </div>

                    <div className="form-row-2">
                      <div className="form-field">
                        <label className="field-label">Promo Headline Title</label>
                        <input 
                          type="text"
                          placeholder="e.g. Autumn Recovery Special"
                          value={settings.promoModal.title || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, title: e.target.value }
                          }))}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Badge Tag</label>
                        <input 
                          type="text"
                          placeholder="e.g. Limited Time Offer"
                          value={settings.promoModal.badgeText || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, badgeText: e.target.value }
                          }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="field-label">Subtitle / Highlight</label>
                      <input 
                        type="text"
                        placeholder="e.g. Book your 60-min RMT and experience complimentary Hot Stone therapy"
                        value={settings.promoModal.subtitle || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          promoModal: { ...prev.promoModal, subtitle: e.target.value }
                        }))}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">Detailed Description</label>
                      <textarea 
                        rows="3"
                        placeholder="Explain the offer details, terms, and why clients should book..."
                        value={settings.promoModal.bodyText || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          promoModal: { ...prev.promoModal, bodyText: e.target.value }
                        }))}
                        className="form-textarea"
                      ></textarea>
                    </div>
                  </div>

                  {/* Call-to-Action Buttons */}
                  <div className="form-section-box">
                    <div className="section-box-header">
                      <Calendar size={16} className="text-olive" />
                      <strong>Call to Action (CTA) & Destination Link</strong>
                    </div>

                    <div className="form-row-2">
                      <div className="form-field">
                        <label className="field-label">Primary Button Text</label>
                        <input 
                          type="text"
                          placeholder="e.g. Claim Offer & Book Online"
                          value={settings.promoModal.ctaText || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, ctaText: e.target.value }
                          }))}
                          className="form-input"
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Button Destination URL</label>
                        <input 
                          type="text"
                          placeholder="https://reverewellness.janeapp.com/"
                          value={settings.promoModal.ctaUrl || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, ctaUrl: e.target.value }
                          }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-field">
                        <label className="field-label">Secondary Button Text</label>
                        <input 
                          type="text"
                          placeholder="Call Reception"
                          value={settings.promoModal.secondaryCtaText || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, secondaryCtaText: e.target.value }
                          }))}
                          className="form-input"
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Secondary Phone Number</label>
                        <input 
                          type="text"
                          placeholder="6045030855"
                          value={settings.promoModal.secondaryCtaPhone || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, secondaryCtaPhone: e.target.value }
                          }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-field">
                        <label className="field-label">Display Delay (Seconds)</label>
                        <input 
                          type="number"
                          min="0"
                          max="30"
                          value={settings.promoModal.delaySeconds !== undefined ? settings.promoModal.delaySeconds : 2}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            promoModal: { ...prev.promoModal, delaySeconds: parseInt(e.target.value) || 0 }
                          }))}
                          className="form-input"
                        />
                        <span className="field-hint">Time before modal appears after page load (default: 2s).</span>
                      </div>

                      <div className="form-field">
                        <label className="field-label">Display Frequency & Refresh Behavior</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
                          <label className="switch">
                            <input 
                              type="checkbox"
                              checked={settings.promoModal.showOncePerSession !== false}
                              onChange={(e) => {
                                const updated = {
                                  ...settings,
                                  promoModal: { ...settings.promoModal, showOncePerSession: e.target.checked }
                                };
                                setSettings(updated);
                                saveClinicSettings(updated);
                              }}
                            />
                            <span className="slider round"></span>
                          </label>
                          <div>
                            <strong style={{ fontSize: '0.92rem', color: 'var(--neutral-800)' }}>
                              {settings.promoModal.showOncePerSession !== false ? 'Show Once Per Visitor Session' : 'Show on Every Page Refresh (Testing Mode)'}
                            </strong>
                            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--neutral-500)', lineHeight: '1.4' }}>
                              {settings.promoModal.showOncePerSession !== false 
                                ? 'Visitors only see it once until they restart browser (prevents annoying patients).' 
                                : 'Pop-up will appear every single time you refresh the page (ideal for testing).'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Footer Actions */}
                <div className="card-actions sticky-actions">
                  <div className="actions-left">
                    <button type="submit" className="btn btn-primary">
                      <Save size={16} />
                      <span>Save Promotion Settings</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-preview-modal"
                      onClick={() => setShowPreviewModal(true)}
                    >
                      <Play size={15} />
                      <span>Preview Popup Modal Now</span>
                    </button>
                  </div>
                  <button type="button" onClick={handleResetDefaults} className="btn-reset">
                    <RotateCcw size={15} />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: WHATSAPP CHAT SETTINGS */}
          {activeTab === 'whatsapp' && (
            <div className="tab-content-wrapper">
              <form onSubmit={handleSaveSettings} className="admin-card glass-card">
                <div className="card-header">
                  <div className="header-icon-box whatsapp-box">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h2 className="card-title">WhatsApp Live Chat Integration</h2>
                    <p className="card-subtitle">
                      Enter the phone number that receives incoming website chat inquiries. Multiple staff can monitor this number via the WhatsApp Business app.
                    </p>
                  </div>
                </div>

                <div className="form-fields-group">
                  {/* WhatsApp Phone Number */}
                  <div className="form-field">
                    <label htmlFor="whatsapp-number" className="field-label">
                      <span>WhatsApp Phone Number</span>
                      <span className="label-badge">Live Target</span>
                    </label>
                    <div className="input-with-icon">
                      <Phone size={16} className="input-icon" />
                      <input
                        id="whatsapp-number"
                        type="text"
                        placeholder="e.g. +1 (604) 503-0855 or your mobile number"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <span className="field-hint">
                      💡 <strong>Tip for testing:</strong> Enter your personal cell phone number now to test sending and receiving messages. Once live, change this to your clinic's business phone!
                    </span>
                  </div>

                  {/* Clean Number Preview & Test Button */}
                  <div className="whatsapp-preview-card">
                    <div className="preview-info">
                      <span className="preview-label">Generated WhatsApp API Target:</span>
                      <strong className="preview-target">+{cleanNumber || '(no number entered)'}</strong>
                    </div>
                    <a
                      href={testWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-test-whatsapp"
                      title="Open WhatsApp chat with this number"
                    >
                      <MessageCircle size={15} />
                      <span>Test WhatsApp Link Now</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Pre-filled Customer Greeting */}
                  <div className="form-field">
                    <label htmlFor="whatsapp-greeting" className="field-label">
                      <span>Default Message Template</span>
                    </label>
                    <textarea
                      id="whatsapp-greeting"
                      rows="2"
                      value={settings.whatsappGreeting}
                      onChange={(e) => setSettings({ ...settings, whatsappGreeting: e.target.value })}
                      className="form-textarea"
                      placeholder="Hi Revere Wellness, I have an inquiry about..."
                    ></textarea>
                    <span className="field-hint">
                      This message is automatically typed for visitors when they click "Chat on WhatsApp".
                    </span>
                  </div>

                  {/* Feature Toggles */}
                  <div className="toggles-group">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.enableWhatsApp}
                        onChange={(e) => setSettings({ ...settings, enableWhatsApp: e.target.checked })}
                      />
                      <span>Enable WhatsApp Option in Chat Box</span>
                    </label>

                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={settings.enableCallbackForm}
                        onChange={(e) => setSettings({ ...settings, enableCallbackForm: e.target.checked })}
                      />
                      <span>Enable "Leave a Note / Request Callback" for non-WhatsApp users</span>
                    </label>
                  </div>
                </div>

                <div className="card-actions">
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} />
                    <span>Save WhatsApp Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: INQUIRIES INBOX */}
          {activeTab === 'inbox' && (
            <div className="tab-content-wrapper">
              <div className="admin-card glass-card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="header-icon-box mail-box">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="card-title">Website Inquiries Inbox</h3>
                      <p className="card-subtitle">Messages left by visitors who submitted contact forms or callback requests</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={loadInquiries}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.84rem' }}
                  >
                    <RotateCcw size={14} />
                    <span>Refresh Inbox</span>
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="empty-inbox">
                    <CheckCircle2 size={36} className="empty-icon" />
                    <p>No pending inquiries yet. When visitors submit callback notes in the chat widget, they will appear here.</p>
                  </div>
                ) : (
                  <div className="inquiries-list">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="inquiry-item">
                        <div className="inquiry-top">
                          <strong>{inq.fullName || inq.name || 'Website Visitor'}</strong>
                          <span className="inquiry-date">
                            {new Date(inq.timestamp || inq.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="inquiry-contact">
                          <Phone size={13} />
                          <span>{inq.phone || inq.phoneOrEmail || inq.email}</span>
                        </div>

                        {inq.message && inq.message !== 'Inquiry sent via live chat widget' && (
                          <p className="inquiry-note">"{inq.message || inq.note}"</p>
                        )}

                        <div className="inquiry-actions">
                          {inq.phone && (
                            <a href={`tel:${inq.phone}`} className="btn-inquiry-action">
                              <Phone size={12} /> Call Patient
                            </a>
                          )}
                          {inq.email && inq.email.includes('@') && (
                            <a href={`mailto:${inq.email}`} className="btn-inquiry-action">
                              <Mail size={12} /> Email Patient
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="btn-inquiry-delete"
                            title="Delete inquiry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CLINIC INFO & PIN */}
          {activeTab === 'general' && (
            <div className="tab-content-wrapper">
              <form onSubmit={handleSaveSettings} className="admin-card glass-card">
                <div className="card-header">
                  <div className="header-icon-box users-box">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 className="card-title">General Clinic Contacts & Portal PIN</h3>
                    <p className="card-subtitle">Manage clinic contact lines and your administrative password.</p>
                  </div>
                </div>

                <div className="form-fields-group">
                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="reception-phone" className="field-label">Reception Phone Number</label>
                      <input
                        id="reception-phone"
                        type="text"
                        value={settings.receptionPhone}
                        onChange={(e) => setSettings({ ...settings, receptionPhone: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="reception-email" className="field-label">Reception Email Address</label>
                      <input
                        id="reception-email"
                        type="email"
                        value={settings.receptionEmail}
                        onChange={(e) => setSettings({ ...settings, receptionEmail: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="janeapp-url" className="field-label">JaneApp Booking Portal URL</label>
                    <input
                      id="janeapp-url"
                      type="text"
                      value={settings.janeAppUrl}
                      onChange={(e) => setSettings({ ...settings, janeAppUrl: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-divider"><span>Admin Security PIN</span></div>

                  <div className="form-field">
                    <label htmlFor="admin-pin" className="field-label">Change Admin Portal PIN Code</label>
                    <input
                      id="admin-pin"
                      type="text"
                      value={settings.adminPin}
                      onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                      className="form-input"
                      placeholder="revere2026"
                    />
                    <span className="field-hint">Use this PIN to access this admin settings page in the future.</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} />
                    <span>Save Contact & Security Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Interactive Live Preview Modal for Admin */}
      {showPreviewModal && (
        <PromotionalModal 
          forceOpen={true}
          previewData={settings.promoModal}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      <style>{`
        .admin-dashboard-page {
          background-color: var(--neutral-100);
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .admin-header {
          background: #181c16;
          border-bottom: 1px solid rgba(216, 178, 141, 0.3);
          padding: 22px 0;
          color: #ffffff;
        }
        .admin-header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: rgba(216, 178, 141, 0.2);
          color: #d8b28d;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 6px;
        }
        .admin-heading {
          font-size: 1.55rem;
          color: #ffffff;
          margin: 0;
        }
        .admin-top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-admin-preview {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(216, 178, 141, 0.3);
          transition: var(--transition);
        }
        .btn-admin-preview:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #d8b28d;
        }
        .btn-admin-logout {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 600;
          background: #2c2b18;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: var(--transition);
        }
        .btn-admin-logout:hover {
          background: #464539;
        }

        /* Tabs Nav */
        .admin-tabs-nav {
          background: #ffffff;
          border-bottom: 1px solid var(--neutral-300);
          position: sticky;
          top: 0;
          z-index: 200;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .admin-tabs-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }
        .admin-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--neutral-600);
          border-bottom: 3px solid transparent;
          background: none;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }
        .admin-tab-btn:hover {
          color: var(--primary-800);
          background: var(--neutral-50);
        }
        .admin-tab-btn.active {
          color: var(--primary-700);
          border-bottom-color: var(--primary-600);
          font-weight: 700;
        }
        .tab-indicator-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }
        .tab-indicator-pill.active { background: #dcfce7; color: #15803d; }
        .tab-indicator-pill.upcoming { background: #fef9c3; color: #a16207; }
        .tab-indicator-pill.expired { background: #fee2e2; color: #b91c1c; }
        .tab-indicator-pill.disabled { background: var(--neutral-200); color: var(--neutral-600); }

        .tab-badge-count {
          font-size: 0.74rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          background: var(--primary-100);
          color: var(--primary-800);
        }

        .admin-main-body {
          padding-top: 32px;
        }
        .tab-content-wrapper {
          max-width: 920px;
          margin: 0 auto;
        }

        .admin-toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          font-size: 0.92rem;
          font-weight: 600;
        }
        .admin-toast.success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .admin-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 34px;
          border: 1px solid rgba(216, 178, 141, 0.35);
          box-shadow: 0 10px 30px -8px rgba(51, 50, 19, 0.08);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 26px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--neutral-200);
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 4px;
        }
        .promo-status-badge {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
        }
        .promo-status-badge.active { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
        .promo-status-badge.upcoming { background: #fef9c3; color: #a16207; border: 1px solid #fde047; }
        .promo-status-badge.expired { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
        .promo-status-badge.disabled { background: var(--neutral-200); color: var(--neutral-600); }

        .status-and-test-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .btn-quick-test {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: var(--primary-700);
          color: #ffffff;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition);
        }
        .btn-quick-test:hover {
          background: var(--primary-900);
          color: #ffffff;
          transform: translateY(-1px);
        }
        .btn-quick-reset-cache {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          background: #ffffff;
          color: var(--neutral-700);
          border: 1px solid var(--neutral-300);
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-quick-reset-cache:hover {
          background: var(--neutral-100);
          color: var(--primary-800);
          border-color: var(--primary-600);
        }

        .enable-status-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2px;
        }
        .state-tag {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .state-tag.tag-enabled {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #86efac;
        }
        .state-tag.tag-disabled {
          background: var(--neutral-200);
          color: var(--neutral-600);
        }

        .header-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .promo-icon-box { background: var(--primary-100); color: var(--primary-800); }
        .whatsapp-box { background: #e7f7ed; color: #128c7e; }
        .users-box { background: var(--primary-50); color: var(--primary-700); }
        .mail-box { background: #fdfaf6; color: #c99d75; }

        .card-title {
          font-size: 1.35rem;
          color: var(--primary-900);
          margin: 0;
        }
        .card-subtitle {
          font-size: 0.88rem;
          color: var(--neutral-600);
          line-height: 1.5;
          margin: 6px 0 0 0;
        }

        /* Promo Enable Toggle Card */
        .promo-enable-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-radius: var(--radius-lg);
          background: var(--neutral-50);
          border: 1.5px solid var(--neutral-200);
          margin-bottom: 10px;
        }
        .enable-info strong {
          display: block;
          font-size: 1.05rem;
          color: var(--primary-900);
          margin-bottom: 2px;
        }
        .enable-info p {
          font-size: 0.84rem;
          color: var(--neutral-600);
          margin: 0;
        }

        /* iOS Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 54px;
          height: 30px;
          flex-shrink: 0;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #cbd5e1;
          transition: .3s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input:checked + .slider {
          background-color: var(--primary-600);
        }
        input:checked + .slider:before {
          transform: translateX(24px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }

        /* Section Box */
        .form-section-box {
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 22px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          color: var(--primary-900);
        }
        .text-olive { color: var(--primary-700); }
        .section-box-desc {
          font-size: 0.84rem;
          color: var(--neutral-600);
          margin: -8px 0 4px 0;
        }

        /* Presets */
        .schedule-presets {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 8px;
          border-top: 1px dashed var(--neutral-200);
        }
        .presets-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--neutral-600);
        }
        .preset-btn {
          font-size: 0.78rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          background: var(--neutral-100);
          border: 1px solid var(--neutral-300);
          color: var(--primary-900);
          cursor: pointer;
          transition: var(--transition);
        }
        .preset-btn:hover {
          background: var(--primary-50);
          border-color: var(--primary-400);
          color: var(--primary-800);
        }

        /* Content Type Selector */
        .content-type-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 14px;
        }
        .type-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--neutral-200);
          background: var(--neutral-50);
          cursor: pointer;
          transition: var(--transition);
        }
        .type-card:hover {
          border-color: var(--primary-400);
        }
        .type-card.active {
          border-color: var(--primary-600);
          background: var(--primary-50);
        }
        .type-card input {
          margin-top: 4px;
          accent-color: var(--primary-600);
        }
        .type-card strong {
          display: block;
          font-size: 0.95rem;
          color: var(--primary-900);
          margin-bottom: 2px;
        }
        .type-card p {
          font-size: 0.78rem;
          color: var(--neutral-600);
          margin: 0;
          line-height: 1.35;
        }

        /* Upload Dropzone */
        .upload-dropzone {
          border: 2px dashed var(--primary-300);
          border-radius: var(--radius-lg);
          padding: 36px 20px;
          text-align: center;
          background: var(--neutral-50);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
        }
        .upload-dropzone:hover {
          background: var(--primary-50);
          border-color: var(--primary-600);
        }
        .upload-icon {
          color: var(--primary-600);
        }
        .btn-browse-file {
          padding: 8px 18px;
          background: var(--primary-600);
          color: #ffffff;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 700;
          margin-top: 6px;
          cursor: pointer;
        }

        .image-preview-box {
          border: 1.5px solid var(--neutral-300);
          border-radius: var(--radius-md);
          background: #f8faf6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .video-admin-preview-box {
          background: #0d0f0c;
        }
        .video-admin-player {
          max-width: 100%;
          max-height: 360px;
          width: auto;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .image-preview-thumb {
          max-width: 100%;
          max-height: 340px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          margin: 14px auto;
          border-radius: var(--radius-sm);
        }
        .image-preview-controls {
          width: 100%;
          padding: 12px 16px;
          background: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--neutral-200);
          box-sizing: border-box;
        }
        .preview-status-text {
          font-size: 0.84rem;
          font-weight: 700;
          color: #15803d;
        }
        .btn-remove-image {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #b91c1c;
          padding: 5px 12px;
          border-radius: var(--radius-sm);
          background: #fee2e2;
          cursor: pointer;
        }

        .url-alternative {
          margin-top: 14px;
        }
        .field-label-sm {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--neutral-600);
          display: block;
          margin-bottom: 6px;
        }

        /* Image Sizing & Fit Mode Options */
        .image-fit-control {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px dashed var(--neutral-300);
        }
        .fit-options-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .fit-pill {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background: var(--neutral-50);
          border: 1.5px solid var(--neutral-200);
          cursor: pointer;
          transition: var(--transition);
        }
        .fit-pill:hover {
          border-color: var(--primary-400);
          background: #ffffff;
        }
        .fit-pill.active {
          background: var(--primary-50);
          border-color: var(--primary-600);
        }
        .fit-pill input {
          margin-top: 3px;
          accent-color: var(--primary-700);
        }
        .fit-pill-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .fit-pill-text strong {
          font-size: 0.86rem;
          color: var(--primary-900);
        }
        .fit-pill-text span {
          font-size: 0.78rem;
          color: var(--neutral-600);
          line-height: 1.35;
        }

        /* Card Width Pills */
        .card-width-pills {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }
        .width-option-btn {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background: var(--neutral-50);
          border: 1.5px solid var(--neutral-200);
          cursor: pointer;
          text-align: left;
          transition: var(--transition);
        }
        .width-option-btn:hover {
          background: #ffffff;
          border-color: var(--primary-400);
        }
        .width-option-btn.active {
          background: var(--primary-50);
          border-color: var(--primary-600);
        }
        .width-option-btn strong {
          font-size: 0.85rem;
          color: var(--primary-900);
        }
        .width-option-btn span {
          font-size: 0.75rem;
          color: var(--neutral-600);
        }

        /* Display Layout Toggle */
        .display-layout-toggle-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          border-radius: var(--radius-md);
          background: var(--neutral-50);
          border: 1.5px solid var(--neutral-200);
        }

        .code-textarea {
          font-family: 'Consolas', monospace;
          font-size: 0.85rem;
          background: #181c16;
          color: #86efac;
        }

        /* Form Common */
        .form-fields-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--primary-900);
        }
        .field-note {
          font-size: 0.74rem;
          color: var(--neutral-500);
          font-weight: 500;
        }
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid var(--neutral-300);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-family: inherit;
          color: var(--neutral-800);
          background: var(--neutral-50);
          transition: var(--transition);
        }
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--primary-600);
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(127, 125, 49, 0.12);
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .field-hint {
          font-size: 0.8rem;
          color: var(--neutral-600);
          line-height: 1.4;
        }

        /* Sticky Form Actions */
        .card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          margin-top: 14px;
          border-top: 1px solid var(--neutral-200);
          flex-wrap: wrap;
          gap: 14px;
        }
        .actions-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn-preview-modal {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 12px 20px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 700;
          background: var(--primary-100);
          color: var(--primary-900);
          border: 1px solid var(--primary-300);
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-preview-modal:hover {
          background: var(--primary-200);
          transform: translateY(-1px);
        }

        .btn-reset {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--neutral-600);
          padding: 8px 14px;
          border-radius: var(--radius-md);
          background: none;
          cursor: pointer;
        }
        .btn-reset:hover {
          background: var(--neutral-200);
        }

        /* WhatsApp Styles */
        .whatsapp-preview-card {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .preview-info { display: flex; flex-direction: column; }
        .preview-label { font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: #166534; }
        .preview-target { font-size: 1.05rem; color: #14532d; letter-spacing: 0.04em; }
        .btn-test-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #25d366;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          transition: var(--transition);
        }
        .btn-test-whatsapp:hover { background: #1eb956; transform: translateY(-1px); }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--neutral-400);
        }
        .input-with-icon .form-input {
          padding-left: 42px;
        }

        .toggles-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px 0;
          border-top: 1px solid var(--neutral-200);
          border-bottom: 1px solid var(--neutral-200);
        }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--neutral-800);
          cursor: pointer;
        }
        .toggle-label input { width: 18px; height: 18px; accent-color: var(--primary-600); }

        /* Inquiries Inbox */
        .empty-inbox { text-align: center; padding: 40px 10px; color: var(--neutral-500); }
        .empty-icon { color: #10b981; margin-bottom: 8px; }
        .inquiries-list { display: flex; flex-direction: column; gap: 12px; }
        .inquiry-item {
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .inquiry-top { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; color: var(--primary-900); }
        .inquiry-date { font-size: 0.74rem; color: var(--neutral-500); }
        .inquiry-contact { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--primary-700); font-weight: 600; }
        .inquiry-note { font-size: 0.85rem; color: var(--neutral-700); background: #ffffff; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--neutral-200); margin: 0; font-style: italic; }
        .inquiry-actions { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .btn-inquiry-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          background: var(--primary-100);
          color: var(--primary-800);
          border: 1px solid rgba(127, 125, 49, 0.2);
        }
        .btn-inquiry-action:hover { background: var(--primary-600); color: #ffffff; }
        .btn-inquiry-delete { margin-left: auto; color: var(--neutral-400); padding: 4px; cursor: pointer; }
        .btn-inquiry-delete:hover { color: #b91c1c; }

        @media (max-width: 768px) {
          .form-row-2, .content-type-selector {
            grid-template-columns: 1fr;
          }
          .card-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .actions-left {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
