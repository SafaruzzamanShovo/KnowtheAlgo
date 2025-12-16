/*
  # Add display_order to community_posts

  1. Changes
    - Add `display_order` column to `community_posts` table to enable manual reordering.
*/

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
