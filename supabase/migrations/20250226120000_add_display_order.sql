/*
  # Add Display Order for Curriculum
  
  Adds display_order column to subjects, modules, and topics to enable
  manual reordering of content in the admin dashboard.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - subjects: add display_order (int)
  - modules: add display_order (int)
  - topics: add display_order (int)
*/

ALTER TABLE subjects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create an index for faster sorting
CREATE INDEX IF NOT EXISTS idx_subjects_order ON subjects(display_order);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(display_order);
CREATE INDEX IF NOT EXISTS idx_topics_order ON topics(display_order);
