/*
  # Site Settings & Categories Schema

  ## Query Description:
  Adds tables to store dynamic site configuration (Home/About content) and community categories.
  
  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - Table: site_settings (key-value store for page content)
  - Table: categories (dynamic community topics)
*/

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'from-blue-500 to-cyan-500',
  icon TEXT DEFAULT 'Layers',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Site Settings (Home & About)
INSERT INTO site_settings (key, value)
VALUES 
  ('home_hero', '{"title": "Decode the Algorithm of Success.", "subtitle": "A structured path to mastering Computer Science. From Data Structures to System Design, we help you understand the core logic behind the code.", "cta_text": "Start Learning"}'::jsonb),
  ('about_profile', '{"name": "Alex Dev", "role": "Senior Software Engineer", "bio": "I specialize in building scalable distributed systems and simplifying complex algorithmic concepts. Founder of KnowtheAlgo.", "image": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", "skills": ["React", "Node.js", "System Design", "Algorithms"]}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed Default Categories
INSERT INTO categories (title, description, color, icon)
VALUES 
  ('Web Development', 'React, Node.js, CSS, and modern web tech.', 'from-blue-500 to-cyan-400', 'Globe'),
  ('Algorithms', 'Sorting, searching, dynamic programming.', 'from-purple-500 to-pink-500', 'Cpu'),
  ('System Design', 'Scalability, distributed systems.', 'from-emerald-500 to-teal-400', 'Server'),
  ('DevOps', 'CI/CD, Docker, Kubernetes.', 'from-orange-500 to-red-500', 'Server')
ON CONFLICT DO NOTHING;
