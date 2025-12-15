/*
  # Security Update: Enable Row Level Security (RLS)
  
  ## Query Description:
  This migration secures the database by enabling Row Level Security on all tables.
  It ensures that:
  1. Public content (Curriculum, Categories, Settings) is readable by everyone but editable ONLY by the admin.
  2. Community Posts can be read by everyone and submitted by everyone, but only the admin can approve/delete them.
  
  ## Metadata:
  - Schema-Category: "Security"
  - Impact-Level: "High"
  - Requires-Backup: false
  
  ## Security Implications:
  - RLS Enabled on: subjects, modules, topics, community_posts, site_settings, categories
  - Admin Email: shovofec@gmail.com (Hardcoded in policies for strict security)
*/

-- Enable RLS on all tables
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 1. SITE SETTINGS & CATEGORIES (Public Read, Admin Write)
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON site_settings FOR ALL USING (auth.jwt() ->> 'email' = 'shovofec@gmail.com');

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (auth.jwt() ->> 'email' = 'shovofec@gmail.com');

-- 2. CURRICULUM (Public Read, Admin Write)
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Admin manage subjects" ON subjects FOR ALL USING (auth.jwt() ->> 'email' = 'shovofec@gmail.com');

CREATE POLICY "Public read modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Admin manage modules" ON modules FOR ALL USING (auth.jwt() ->> 'email' = 'shovofec@gmail.com');

CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Admin manage topics" ON topics FOR ALL USING (auth.jwt() ->> 'email' = 'shovofec@gmail.com');

-- 3. COMMUNITY POSTS (Public Read/Insert, Admin Update/Delete)
CREATE POLICY "Public read posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Public insert posts" ON community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage posts" ON community_posts FOR UPDATE USING (auth.jwt() ->> 'email' = 'shovofec@gmail.com');
CREATE POLICY "Admin delete posts" ON community_posts FOR DELETE USING (auth.jwt() ->> 'email' = 'shovofec@gmail.com');
