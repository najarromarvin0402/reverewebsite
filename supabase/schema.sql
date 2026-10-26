-- Revere Wellness Database Schema
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/glfdglntlzmvhxleaoau/sql/new

-- ===================================================
-- 1. CLINIC SETTINGS TABLE
-- Stores global settings: WhatsApp number, Promo modal ads,
-- reception contacts, admin PIN, and feature flags.
-- ===================================================
CREATE TABLE IF NOT EXISTS clinic_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow public read on clinic_settings" ON clinic_settings;
DROP POLICY IF EXISTS "Allow public insert on clinic_settings" ON clinic_settings;
DROP POLICY IF EXISTS "Allow public update on clinic_settings" ON clinic_settings;

-- Allow anyone (visitors and admin) to read settings
CREATE POLICY "Allow public read on clinic_settings"
ON clinic_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Allow inserting settings
CREATE POLICY "Allow public insert on clinic_settings"
ON clinic_settings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow updating settings
CREATE POLICY "Allow public update on clinic_settings"
ON clinic_settings FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- ===================================================
-- 2. CONTACT INQUIRIES TABLE
-- Stores submissions from website contact form & inquiries
-- ===================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  preferred_contact_method TEXT DEFAULT 'email',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new'
);

-- Enable Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert to contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow public read on contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow public update on contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow public delete on contact_inquiries" ON contact_inquiries;

-- Allow public to submit inquiries
CREATE POLICY "Allow public insert to contact_inquiries" 
ON contact_inquiries FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading inquiries in Admin panel
CREATE POLICY "Allow public read on contact_inquiries" 
ON contact_inquiries FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow updating inquiry status (e.g. read/resolved)
CREATE POLICY "Allow public update on contact_inquiries" 
ON contact_inquiries FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Allow deleting inquiries from Admin panel
CREATE POLICY "Allow public delete on contact_inquiries" 
ON contact_inquiries FOR DELETE 
TO anon, authenticated 
USING (true);

-- ===================================================
-- 3. PROMOTIONAL MEDIA STORAGE BUCKET (Videos & Flyers)
-- ===================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('promo-media', 'promo-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read on promo-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload on promo-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on promo-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on promo-media" ON storage.objects;

CREATE POLICY "Allow public read on promo-media" 
ON storage.objects FOR SELECT 
TO anon, authenticated 
USING (bucket_id = 'promo-media');

CREATE POLICY "Allow public upload on promo-media" 
ON storage.objects FOR INSERT 
TO anon, authenticated 
WITH CHECK (bucket_id = 'promo-media');

CREATE POLICY "Allow public update on promo-media" 
ON storage.objects FOR UPDATE 
TO anon, authenticated 
USING (bucket_id = 'promo-media')
WITH CHECK (bucket_id = 'promo-media');

CREATE POLICY "Allow public delete on promo-media" 
ON storage.objects FOR DELETE 
TO anon, authenticated 
USING (bucket_id = 'promo-media');
