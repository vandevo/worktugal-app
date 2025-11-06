/*
  # Create Project Changelog Table

  1. New Tables
    - `project_changelog`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz) - When change was logged
      - `date` (date) - Date of actual change (for backdating)
      - `category` (text) - Type of change: feature, fix, database, ui, integration, security, performance, content
      - `title` (text, required) - Short description of change
      - `details` (text) - Detailed explanation of what changed
      - `affected_files` (text[]) - Array of file paths changed
      - `migration_files` (text[]) - Array of migration file names if applicable
      - `created_by` (uuid) - User who logged the change
      - `pr_number` (text) - GitHub PR number if applicable
      - `version` (text) - Release version if applicable

  2. Security
    - Enable RLS on `project_changelog` table
    - Only admins can insert/update/delete changelog entries
    - Everyone (including anon) can read changelog for transparency

  3. Performance
    - Index on date for chronological sorting
    - Index on category for filtering
    - Index on created_at for recent changes
*/

CREATE TABLE IF NOT EXISTS project_changelog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Change metadata
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN ('feature', 'fix', 'database', 'ui', 'integration', 'security', 'performance', 'content', 'docs')),
  
  -- Change description
  title TEXT NOT NULL,
  details TEXT,
  
  -- Technical details
  affected_files TEXT[],
  migration_files TEXT[],
  
  -- Attribution and versioning
  created_by UUID REFERENCES auth.users(id),
  pr_number TEXT,
  version TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_project_changelog_date ON project_changelog(date DESC);
CREATE INDEX IF NOT EXISTS idx_project_changelog_category ON project_changelog(category);
CREATE INDEX IF NOT EXISTS idx_project_changelog_created_at ON project_changelog(created_at DESC);

-- Enable Row Level Security
ALTER TABLE project_changelog ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read changelog (transparency)
CREATE POLICY "Anyone can read changelog"
  ON project_changelog
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Only admins can insert changelog entries
CREATE POLICY "Admins can insert changelog"
  ON project_changelog
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Only admins can update changelog entries
CREATE POLICY "Admins can update changelog"
  ON project_changelog
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Only admins can delete changelog entries
CREATE POLICY "Admins can delete changelog"
  ON project_changelog
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Add helpful comments
COMMENT ON TABLE project_changelog IS 'Project change log for tracking updates and generating documentation';
COMMENT ON COLUMN project_changelog.category IS 'Change type: feature, fix, database, ui, integration, security, performance, content, docs';
COMMENT ON COLUMN project_changelog.title IS 'Short one-line description of the change';
COMMENT ON COLUMN project_changelog.details IS 'Detailed explanation with technical specifics';
COMMENT ON COLUMN project_changelog.affected_files IS 'Array of file paths that were modified';
COMMENT ON COLUMN project_changelog.migration_files IS 'Array of migration file names if database changes were made';
