/*
  # Fix RLS Policies (Idempotent)
  
  This migration resolves "policy already exists" errors by:
  1. Dropping existing policies first (IF EXISTS)
  2. Re-creating them with the correct permissions
  3. Securing all tables (Subjects, Modules, Topics, Settings, Categories)
  
  ## Security Model
  - Public: Can READ everything. Can INSERT community posts.
  - Admin (shovofec@gmail.com): Can INSERT/UPDATE/DELETE everything.
*/

-- 1. Subjects Table
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read subjects" ON subjects;
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access subjects" ON subjects;
CREATE POLICY "Admin full access subjects" ON subjects FOR ALL USING ((auth.jwt() ->> 'email') = 'shovofec@gmail.com');


-- 2. Modules Table
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read modules" ON modules;
CREATE POLICY "Public read modules" ON modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access modules" ON modules;
CREATE POLICY "Admin full access modules" ON modules FOR ALL USING ((auth.jwt() ->> 'email') = 'shovofec@gmail.com');


-- 3. Topics Table
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read topics" ON topics;
CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access topics" ON topics;
CREATE POLICY "Admin full access topics" ON topics FOR ALL USING ((auth.jwt() ->> 'email') = 'shovofec@gmail.com');


-- 4. Site Settings Table
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read settings" ON site_settings;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access settings" ON site_settings;
CREATE POLICY "Admin full access settings" ON site_settings FOR ALL USING ((auth.jwt() ->> 'email') = 'shovofec@gmail.com');


-- 5. Categories Table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access categories" ON categories;
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING ((auth.jwt() ->> 'email') = 'shovofec@gmail.com');


-- 6. Community Posts Table
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read posts" ON community_posts;
CREATE POLICY "Public read posts" ON community_posts FOR SELECT USING (true);

-- Allow anyone to insert (Contribute page)
DROP POLICY IF EXISTS "Public insert posts" ON community_posts;
CREATE POLICY "Public insert posts" ON community_posts FOR INSERT WITH CHECK (true);

-- Admin can update/delete (Approve/Reject)
DROP POLICY IF EXISTS "Admin update posts" ON community_posts;
CREATE POLICY "Admin update posts" ON community_posts FOR UPDATE USING ((auth.jwt() ->> 'email') = 'shovofec@gmail.com');

DROP POLICY IF EXISTS "Admin delete posts" ON community_posts;
CREATE POLICY "Admin delete posts" ON community_posts FOR DELETE USING ((auth.jwt() ->> 'email') = 'shovofec@gmail.com');
