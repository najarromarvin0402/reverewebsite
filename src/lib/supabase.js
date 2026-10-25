import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://glfdglntlzmvhxleaoau.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsZmRnbG50bHptdmh4bGVhb2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NTQzNjYsImV4cCI6MjEwODUzMDM2Nn0.x7X58TEbRzydXarg0QHg9MQAooy4Lp4OCyoyq710_wo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Submit contact inquiry to Supabase database with automatic fallback
 * @param {Object} data { fullName, email, phone, subject, message, preferredContactMethod }
 */
export async function submitInquiry(data) {
  if (supabase && isSupabaseConfigured) {
    const { data: record, error } = await supabase
      .from('contact_inquiries')
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          subject: data.subject || 'General Inquiry',
          message: data.message,
          preferred_contact_method: data.preferredContactMethod || 'email',
          created_at: new Date().toISOString(),
          status: 'new'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase submission error:', error);
      throw error;
    }
    return { success: true, mode: 'supabase', data: record };
  }

  // Graceful fallback for local/preview mode before Supabase credentials are configured
  console.info('Saving inquiry to local storage fallback.');
  try {
    const existing = JSON.parse(localStorage.getItem('revere_inquiries') || '[]');
    existing.push({ ...data, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem('revere_inquiries', JSON.stringify(existing));
  } catch (e) {
    // Ignore storage issues
  }

  return { 
    success: true, 
    mode: 'fallback', 
    note: 'Message saved locally.' 
  };
}

/**
 * Fetch all contact inquiries from Supabase
 */
export async function fetchInquiries() {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(item => ({
          id: item.id,
          fullName: item.full_name,
          email: item.email,
          phone: item.phone,
          subject: item.subject,
          message: item.message,
          preferredContactMethod: item.preferred_contact_method,
          timestamp: item.created_at,
          status: item.status
        }));
      }
      if (error) {
        console.warn('Notice from Supabase inquiries query:', error.message);
      }
    } catch (e) {
      console.warn('Network error loading inquiries from Supabase:', e);
    }
  }

  try {
    const stored = JSON.parse(localStorage.getItem('revere_inquiries') || '[]');
    return stored.reverse();
  } catch {
    return [];
  }
}

/**
 * Delete inquiry by ID
 */
export async function deleteInquiry(id) {
  if (supabase && isSupabaseConfigured) {
    try {
      await supabase.from('contact_inquiries').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting inquiry from Supabase:', e);
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem('revere_inquiries') || '[]');
    const updated = existing.filter(i => String(i.id) !== String(id));
    localStorage.setItem('revere_inquiries', JSON.stringify(updated));
  } catch {}
}

/**
 * Fetch clinic settings from Supabase
 */
export async function fetchClinicSettingsFromDb() {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('settings')
      .eq('id', 'global')
      .maybeSingle();

    if (error) {
      console.warn('Notice loading clinic settings from Supabase:', error.message);
      return null;
    }
    return data?.settings || null;
  } catch (e) {
    console.warn('Error connecting to Supabase for clinic settings:', e);
    return null;
  }
}

/**
 * Save clinic settings to Supabase
 */
export async function saveClinicSettingsToDb(settings) {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .upsert({
        id: 'global',
        settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error saving settings to Supabase:', error);
      throw error;
    }
    return data;
  } catch (e) {
    console.error('Failed to upsert clinic settings to Supabase:', e);
    throw e;
  }
}

/**
 * Upload a media file (video or image) to Supabase Storage bucket
 * Returns public URL if successful, or null
 */
export async function uploadMediaToSupabase(file, bucketName = 'promo-media') {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const ext = file.name ? file.name.split('.').pop().toLowerCase() : 'mp4';
    const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `uploads/${cleanName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true
      });

    if (error) {
      console.warn(`Supabase Storage upload to bucket '${bucketName}' notice:`, error.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicData?.publicUrl || null;
  } catch (err) {
    console.warn('Storage upload error:', err);
    return null;
  }
}
