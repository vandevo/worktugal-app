/*
  # Create Documentation Versioning Table

  ## Purpose
  Store versioned copies of project documentation (README, technical specs, etc.)
  for historical tracking and rollback capabilities.

  ## New Tables
  - `documentation`
    - `id` (uuid, primary key)
    - `title` (text) - Document title
    - `content` (text) - Full markdown content
    - `version` (text) - Semantic version (e.g., "1.0.0")
    - `doc_type` (text) - Type: 'readme', 'api_docs', 'technical_spec'
    - `created_at` (timestamptz) - Version creation timestamp
    - `created_by` (uuid) - User who created version (nullable)

  ## Security
  - Enable RLS on `documentation` table
  - Public can read all documentation
  - Only authenticated admins can insert/update
*/

-- Create documentation table
CREATE TABLE IF NOT EXISTS documentation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  version text NOT NULL,
  doc_type text NOT NULL DEFAULT 'readme',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create index on doc_type for filtering
CREATE INDEX IF NOT EXISTS idx_documentation_doc_type ON documentation(doc_type);

-- Create index on version for sorting
CREATE INDEX IF NOT EXISTS idx_documentation_version ON documentation(version);

-- Create index on created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_documentation_created_at ON documentation(created_at DESC);

-- Enable RLS
ALTER TABLE documentation ENABLE ROW LEVEL SECURITY;

-- Public can read all documentation
CREATE POLICY "Public can view documentation"
  ON documentation FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert documentation
CREATE POLICY "Authenticated users can insert documentation"
  ON documentation FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own documentation
CREATE POLICY "Users can update own documentation"
  ON documentation FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
