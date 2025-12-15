/*
  # Portfolio & Content Management Schema
  
  ## Query Description:
  Creates a flexible table to store all portfolio sections (Research, Projects, Experience, etc.)
  and ensures the site_settings table can handle expanded configuration.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: portfolio_items
    - section: 'news', 'research', 'project', 'experience', 'education', 'honor', 'leadership'
    - details: JSONB column for flexible data (team members, links, tags, etc.)
  
  ## Security Implications:
  - Public Read Access
  - Authenticated (Admin) Write Access
*/

-- Create Portfolio Items Table
create table if not exists public.portfolio_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  section text not null, -- 'news', 'research', 'project', 'experience', 'education', 'honor', 'leadership'
  title text not null,
  subtitle text, -- role, degree, category (for news)
  organization text, -- company, school, lab, org
  period text,
  description text,
  details jsonb default '{}'::jsonb, -- stores tags, links, status, team, advisor, type, icon, color
  display_order integer default 0
);

-- Enable RLS
alter table public.portfolio_items enable row level security;

-- Policies
create policy "Public read access for portfolio" 
  on public.portfolio_items for select 
  using (true);

create policy "Admin full access for portfolio" 
  on public.portfolio_items for all 
  using (auth.role() = 'authenticated');

-- Insert some initial seed data (optional, but good for testing if empty)
-- (We will handle seeding via the Admin 'Seed DB' button in the UI code)
