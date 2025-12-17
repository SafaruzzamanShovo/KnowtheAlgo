/*
  # Fix Schema Conflicts and Ensure Idempotency
  
  This migration ensures all required tables for the KnowtheAlgo platform exist.
  It uses IF NOT EXISTS to avoid "relation already exists" errors.
  It also ensures RLS policies are up to date.
  
  ## Tables Managed:
  - subjects, modules, topics
  - categories, community_posts
  - portfolio_items
  - site_settings
  
  ## Notes:
  - Safely handles existing tables.
  - Re-applies RLS policies to ensure security.
*/

-- 1. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies (Drop first to avoid conflicts, then recreate)
DROP POLICY IF EXISTS "Public read access" ON public.site_settings;
CREATE POLICY "Public read access" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write access" ON public.site_settings;
CREATE POLICY "Admin write access" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');


-- 2. Curriculum
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    level TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read subjects" ON public.subjects;
CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all subjects" ON public.subjects;
CREATE POLICY "Admin all subjects" ON public.subjects FOR ALL USING (auth.role() = 'authenticated');


CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read modules" ON public.modules;
CREATE POLICY "Public read modules" ON public.modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all modules" ON public.modules;
CREATE POLICY "Admin all modules" ON public.modules FOR ALL USING (auth.role() = 'authenticated');


CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    read_time TEXT,
    content JSONB, -- Supports both string (HTML) and JSON array (blocks)
    module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read topics" ON public.topics;
CREATE POLICY "Public read topics" ON public.topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all topics" ON public.topics;
CREATE POLICY "Admin all topics" ON public.topics FOR ALL USING (auth.role() = 'authenticated');


-- 3. Community
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all categories" ON public.categories;
CREATE POLICY "Admin all categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');


CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    author_avatar TEXT,
    category TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'pending',
    likes INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved posts" ON public.community_posts;
CREATE POLICY "Public read approved posts" ON public.community_posts FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Insert posts" ON public.community_posts;
CREATE POLICY "Insert posts" ON public.community_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage posts" ON public.community_posts;
CREATE POLICY "Admin manage posts" ON public.community_posts FOR ALL USING (auth.role() = 'authenticated');


-- 4. Portfolio
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    organization TEXT,
    period TEXT,
    description TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read portfolio" ON public.portfolio_items;
CREATE POLICY "Public read portfolio" ON public.portfolio_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage portfolio" ON public.portfolio_items;
CREATE POLICY "Admin manage portfolio" ON public.portfolio_items FOR ALL USING (auth.role() = 'authenticated');
