-- Run this in Supabase Dashboard → SQL Editor

-- 1. Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Create page_content table for editable text overrides
CREATE TABLE IF NOT EXISTS page_content (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on page_content
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- 4. Allow authenticated admins to read/write page_content
CREATE POLICY "Admins can read page_content" ON page_content
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert page_content" ON page_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update page_content" ON page_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. Allow profiles read for auth check
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
