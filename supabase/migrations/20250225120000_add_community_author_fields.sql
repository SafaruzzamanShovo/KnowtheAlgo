-- Add author details to community_posts table
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS author_email TEXT,
ADD COLUMN IF NOT EXISTS author_avatar TEXT;
