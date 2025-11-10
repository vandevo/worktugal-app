/*
  # Create checkup feedback table for user-submitted corrections and ratings

  1. New Tables
    - `checkup_feedback`
      - `id` (bigserial, primary key)
      - `checkup_lead_id` (bigint, foreign key to tax_checkup_leads)
      - `flag_type` (text) - 'red', 'yellow', 'green'
      - `flag_id` (text) - identifier for which specific flag
      - `feedback_type` (text) - 'helpful', 'not_helpful', 'error', 'bug', 'suggestion'
      - `is_accurate` (boolean) - quick thumbs up/down
      - `comment` (text) - detailed feedback
      - `user_email` (text) - optional contact
      - `user_name` (text) - optional name
      - `metadata` (jsonb) - additional context
      - `status` (text) - 'new', 'reviewed', 'resolved', 'dismissed'
      - `admin_notes` (text) - internal notes
      - `resolved_at` (timestamptz) - when addressed
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `checkup_feedback` table
    - Allow anonymous inserts for feedback submission
    - Admin-only access for reviewing feedback
    - Users can view their own feedback if email provided

  3. Indexes
    - Index on checkup_lead_id for lookups
    - Index on feedback_type for filtering
    - Index on status for admin dashboard
    - Index on flag_id for aggregating flag accuracy
    - Index on created_at for chronological sorting
*/

-- Create checkup_feedback table
CREATE TABLE IF NOT EXISTS checkup_feedback (
  id bigserial PRIMARY KEY,
  checkup_lead_id bigint REFERENCES tax_checkup_leads(id) ON DELETE SET NULL,
  flag_type text CHECK (flag_type IN ('red', 'yellow', 'green', 'general')),
  flag_id text,
  feedback_type text NOT NULL CHECK (feedback_type IN ('helpful', 'not_helpful', 'error', 'bug', 'suggestion', 'outdated')),
  is_accurate boolean,
  comment text,
  user_email text,
  user_name text,
  metadata jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'dismissed')),
  admin_notes text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE checkup_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to submit feedback
CREATE POLICY "Anyone can submit feedback"
  ON checkup_feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to view their own feedback by email
CREATE POLICY "Users can view own feedback by email"
  ON checkup_feedback
  FOR SELECT
  TO authenticated
  USING (
    user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admin can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON checkup_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can update feedback
CREATE POLICY "Admins can update feedback"
  ON checkup_feedback
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checkup_feedback_checkup_lead_id
  ON checkup_feedback(checkup_lead_id);

CREATE INDEX IF NOT EXISTS idx_checkup_feedback_feedback_type
  ON checkup_feedback(feedback_type);

CREATE INDEX IF NOT EXISTS idx_checkup_feedback_status
  ON checkup_feedback(status);

CREATE INDEX IF NOT EXISTS idx_checkup_feedback_flag_id
  ON checkup_feedback(flag_id) WHERE flag_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_checkup_feedback_created_at
  ON checkup_feedback(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_checkup_feedback_is_accurate
  ON checkup_feedback(is_accurate) WHERE is_accurate IS NOT NULL;

-- Create function to get flag accuracy stats
CREATE OR REPLACE FUNCTION get_flag_accuracy_stats(p_flag_id text)
RETURNS TABLE(
  flag_id text,
  total_feedback bigint,
  helpful_count bigint,
  not_helpful_count bigint,
  accuracy_percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_flag_id as flag_id,
    COUNT(*) as total_feedback,
    COUNT(*) FILTER (WHERE feedback_type = 'helpful') as helpful_count,
    COUNT(*) FILTER (WHERE feedback_type = 'not_helpful') as not_helpful_count,
    ROUND(
      (COUNT(*) FILTER (WHERE feedback_type = 'helpful')::numeric /
       NULLIF(COUNT(*), 0)::numeric) * 100,
      1
    ) as accuracy_percentage
  FROM checkup_feedback
  WHERE checkup_feedback.flag_id = p_flag_id
  AND is_accurate IS NOT NULL;
END;
$$;
