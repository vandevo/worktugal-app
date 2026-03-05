/*
  # Create CMS Posts Table

  1. New Tables
    - `cms_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique index, required)
      - `content` (text, markdown)
      - `excerpt` (text)
      - `meta_title` (text)
      - `meta_description` (text)
      - `featured_image` (text)
      - `status` (text, default 'draft')
      - `author_id` (uuid, references auth.users)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public read for published posts
    - Admin-only management
*/

-- Create post status type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
    CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS cms_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  meta_title text,
  meta_description text,
  featured_image text,
  status post_status DEFAULT 'draft' NOT NULL,
  author_id uuid REFERENCES auth.users(id),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_cms_posts_slug ON cms_posts(slug);
CREATE INDEX idx_cms_posts_status ON cms_posts(status);
CREATE INDEX idx_cms_posts_published_at ON cms_posts(published_at);

-- Enable RLS
ALTER TABLE cms_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view published posts"
  ON cms_posts
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage all posts"
  ON cms_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_cms_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_cms_posts_updated_at
  BEFORE UPDATE ON cms_posts
  FOR EACH ROW
  EXECUTE PROCEDURE update_cms_posts_updated_at();
