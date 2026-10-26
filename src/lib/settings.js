// Clinic Settings & Dynamic WhatsApp Configuration Service
// Supports local management and real-time updates across the app
import { fetchClinicSettingsFromDb, saveClinicSettingsToDb } from './supabase';

export const DEFAULT_SETTINGS = {
  // WhatsApp settings
  whatsappNumber: '+16045030855', // Default clinic number (owner can change to their personal cell or any business line)
  whatsappGreeting: 'Hi Revere Wellness, I have an inquiry about booking an appointment.',
  enableWhatsApp: true,

  // General clinic contacts
  receptionPhone: '(604) 503-0855',
  receptionEmail: 'info@reverewellness.ca',
  janeAppUrl: 'https://reverewellness.janeapp.com/',

  // Feature flags
  enableCallbackForm: true,
  enableJaneBookingShortcut: true,

  // Social media profile links
  socialLinks: {
    instagram: 'https://instagram.com/reverewellness',
    facebook: 'https://facebook.com/reverewellness',
    twitter: '', // X
    tiktok: '',
    youtube: '',
    linkedin: '',
    googleReview: ''
  },

  // Promotional Popup / Ads Modal Settings
  promoModal: {
    enabled: false,
    title: 'Seasonal Wellness Special',
    subtitle: 'Exclusive Clinic Offer • Revere Massage & Wellness',
    bodyText: 'Experience deep restorative relief. Book your Registered Massage Therapy, Physiotherapy, or Active Rehab session online with instant confirmation.',
    badgeText: 'Special Announcement',
    contentType: 'image', // 'image' | 'video' | 'script'
    imageUrl: '', // Uploaded image data URL or external URL
    videoUrl: '', // Uploaded video (IndexedDB/blob/dataURL) or external MP4/WebM/YouTube/Vimeo link
    videoAutoplay: true, // Autoplay video (muted)
    videoLoop: true, // Loop video continuously
    videoMuted: true, // Start muted to satisfy browser autoplay policies
    videoControls: true, // Show video player controls
    imageFit: 'contain', // 'contain' (Always Fit - never cut off) | 'cover' (Crop & Fill) | 'natural' (Full Natural Height)
    cardWidth: 'standard', // 'compact' (440px) | 'standard' (540px) | 'wide' (660px)
    showTextDetails: true, // Toggle text block below image/video
    animationScript: '', // Custom animation code, embed script, or SVG/Lottie/HTML
    ctaText: 'Book Appointment Now',
    ctaUrl: 'https://reverewellness.janeapp.com/',
    secondaryCtaText: 'Call (604) 503-0855',
    secondaryCtaPhone: '6045030855',
    startDateTime: '', // e.g. "2026-10-01T09:00"
    endDateTime: '',   // e.g. "2026-10-31T20:00"
    delaySeconds: 2,   // seconds before showing popup
    showOncePerSession: true
  },

  // Admin security
  adminPin: 'revere2026'
};

/**
 * IndexedDB helper for storing larger media files (such as MP4/WebM videos up to 50MB)
 * to avoid localStorage 5MB quota restrictions
 */
const DB_NAME = 'RevereMediaDB';
const STORE_NAME = 'media';

export function openMediaDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => resolve(null);
  });
}

export async function saveMediaItem(key, data) {
  const db = await openMediaDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(data, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch (_) {
      resolve(false);
    }
  });
}

export async function getMediaItem(key) {
  const db = await openMediaDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

export async function deleteMediaItem(key) {
  const db = await openMediaDB();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
  } catch (_) {}
}

/**
 * Format YouTube or Vimeo links into embeddable autoplay iframe URLs
 */
export function formatVideoEmbedUrl(url) {
  if (!url) return '';
  // Check YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&playsinline=1&rel=0`;
  }
  // Check Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&muted=1&loop=1&autopause=0`;
  }
  return url;
}

/**
 * Format Date to local YYYY-MM-DDTHH:mm string suitable for <input type="datetime-local">
 */
export function formatLocalDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Determine if the promotional modal is currently active based on schedule
 */
export function getPromoModalStatus(promo) {
  if (!promo || !promo.enabled) {
    return { status: 'disabled', label: 'Disabled', active: false };
  }

  const now = new Date();

  if (promo.startDateTime && typeof promo.startDateTime === 'string' && promo.startDateTime.trim() !== '') {
    const start = new Date(promo.startDateTime);
    if (!isNaN(start.getTime()) && now < start) {
      return { status: 'upcoming', label: 'Scheduled (Upcoming)', active: false, start };
    }
  }

  if (promo.endDateTime && typeof promo.endDateTime === 'string' && promo.endDateTime.trim() !== '') {
    const end = new Date(promo.endDateTime);
    if (!isNaN(end.getTime()) && now > end) {
      return { status: 'expired', label: 'Expired (Ended)', active: false, end };
    }
  }

  return { status: 'active', label: 'Active Now (Visible)', active: true };
}

const STORAGE_KEY = 'revere_clinic_settings';

/**
 * Clean and format any phone number for WhatsApp wa.me links
 * e.g. "(604) 503-0855" -> "16045030855"
 */
export function cleanPhoneForWhatsApp(phone) {
  if (!phone) return '';
  // Remove all non-numeric characters
  let digits = phone.replace(/\D/g, '');
  
  // If 10 digits (standard North America without country code), prepend 1
  if (digits.length === 10) {
    digits = '1' + digits;
  }
  return digits;
}

/**
 * Generate direct WhatsApp URL
 */
export function getWhatsAppUrl(phone, customText) {
  const clean = cleanPhoneForWhatsApp(phone || DEFAULT_SETTINGS.whatsappNumber);
  const text = customText || DEFAULT_SETTINGS.whatsappGreeting;
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

/**
 * Get current clinic settings from localStorage or defaults with deep merge
 */
export function getClinicSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { 
      ...DEFAULT_SETTINGS, 
      ...parsed,
      promoModal: {
        ...DEFAULT_SETTINGS.promoModal,
        ...(parsed.promoModal || {})
      },
      socialLinks: {
        ...DEFAULT_SETTINGS.socialLinks,
        ...(parsed.socialLinks || {})
      }
    };
  } catch (e) {
    console.error('Error loading clinic settings:', e);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Fetch remote settings from Supabase and synchronize with localStorage & UI
 */
export async function syncClinicSettingsFromDb() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const remote = await fetchClinicSettingsFromDb();
    if (!remote) return getClinicSettings();

    const merged = {
      ...DEFAULT_SETTINGS,
      ...remote,
      promoModal: {
        ...DEFAULT_SETTINGS.promoModal,
        ...(remote.promoModal || {})
      },
      socialLinks: {
        ...DEFAULT_SETTINGS.socialLinks,
        ...(remote.socialLinks || {})
      }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('revere-settings-updated', { detail: merged }));
    return merged;
  } catch (e) {
    console.warn('Could not sync clinic settings from database:', e);
    return getClinicSettings();
  }
}

// Automatically sync settings from database when running in browser
if (typeof window !== 'undefined') {
  // Run on next tick after initial hydration
  setTimeout(() => {
    syncClinicSettingsFromDb().catch(() => {});
  }, 100);
}

/**
 * Save clinic settings to both localStorage (instant) and Supabase (cloud persistence)
 */
export function saveClinicSettings(newSettings) {
  if (typeof window === 'undefined') return newSettings;

  try {
    const current = getClinicSettings();
    const merged = { 
      ...current, 
      ...newSettings,
      promoModal: {
        ...current.promoModal,
        ...(newSettings.promoModal || {})
      },
      socialLinks: {
        ...current.socialLinks,
        ...(newSettings.socialLinks || {})
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

    // Clear session dismissal cache so changes can be tested immediately in the browser
    try {
      if (typeof sessionStorage !== 'undefined') {
        Object.keys(sessionStorage).forEach(k => {
          if (k.startsWith('revere_promo_dismissed')) {
            sessionStorage.removeItem(k);
          }
        });
      }
    } catch (_) {}

    // Dispatch event so ChatBotWidget and PromotionalModal update immediately
    window.dispatchEvent(new CustomEvent('revere-settings-updated', { detail: merged }));

    // Persist to Supabase in the background
    saveClinicSettingsToDb(merged).catch(err => {
      console.warn('Notice: Settings saved locally, but database sync returned:', err?.message || err);
    });

    return merged;
  } catch (e) {
    console.error('Error saving clinic settings:', e);
    return newSettings;
  }
}

/**
 * Reset settings back to initial factory defaults
 */
export function resetClinicSettings() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    try {
      Object.keys(sessionStorage).forEach(k => {
        if (k.startsWith('revere_promo_dismissed')) {
          sessionStorage.removeItem(k);
        }
      });
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('revere-settings-updated', { detail: DEFAULT_SETTINGS }));

    // Also update Supabase database to reset state
    saveClinicSettingsToDb(DEFAULT_SETTINGS).catch(() => {});
  }
  return DEFAULT_SETTINGS;
}
