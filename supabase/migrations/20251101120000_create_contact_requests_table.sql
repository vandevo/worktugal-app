/*
  # Create Contact Requests Table

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `purpose` (text) - Type of inquiry: accounting, partnership, job, info, other
      - `full_name` (text, required)
      - `email` (text, required)
      - `company_name` (text, optional)
      - `website_url` (text, optional)
      - `message` (text) - Main inquiry message
      - `budget_range` (text, optional) - For partnerships: 200-499, 500-999, 1000+, not_yet, exploring
      - `timeline` (text, optional) - this_month, 3_months, later, flexible
      - `status` (text) - Request status tracking: new, reviewed, replied, converted, archived
      - `priority` (text) - Priority level: high, normal, low
      - `notes` (text) - Private admin notes
      - `webhook_sent` (boolean) - Track if Make.com webhook was triggered
      - `webhook_sent_at` (timestamp)
      - `replied_at` (timestamp)

  2. Security
    - Enable RLS on `contact_requests` table
    - Allow anonymous users to insert their own requests
    - Only admins can view and manage requests

  3. Performance
    - Add indexes for common query patterns (purpose, status, priority, created_at)
*/

CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Purpose and routing
  purpose TEXT NOT NULL CHECK (purpose IN ('accounting', 'partnership', 'job', 'info', 'other')),

  -- Identity
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  website_url TEXT,

  -- Request details
  message TEXT,

  -- Qualification (for partnerships)
  budget_range TEXT CHECK (budget_range IN ('200-499', '500-999', '1000+', 'not_yet', 'exploring')),
  timeline TEXT CHECK (timeline IN ('this_month', '3_months', 'later', 'flexible')),

  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'replied', 'converted', 'archived')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  notes TEXT,

  -- Make.com webhook tracking
  webhook_sent BOOLEAN DEFAULT false,
  webhook_sent_at TIMESTAMPTZ,

  replied_at TIMESTAMPTZ
);

-- Indexes for admin filtering and performance
CREATE INDEX IF NOT EXISTS idx_contact_purpose ON contact_requests(purpose);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_priority ON contact_requests(priority);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_requests(email);

-- Enable Row Level Security
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert contact requests (anonymous submissions)
CREATE POLICY "Anyone can submit contact requests"
  ON contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated admins can view requests
CREATE POLICY "Admins can view all contact requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Only authenticated admins can update requests
CREATE POLICY "Admins can update contact requests"
  ON contact_requests
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

-- Policy: Only authenticated admins can delete requests
CREATE POLICY "Admins can delete contact requests"
  ON contact_requests
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
