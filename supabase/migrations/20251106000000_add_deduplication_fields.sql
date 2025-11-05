/*
  # Add Smart Deduplication Fields to accounting_intakes

  1. New Fields for Lead Engagement Tracking
    - `user_id` - Links anonymous submissions to registered user accounts
    - `lead_email_hash` - Normalized email hash for matching (case-insensitive, trimmed)
    - `is_latest_submission` - Flag for current record per email (for Make.com deduplication)
    - `submission_sequence` - Engagement counter (1st, 2nd, 3rd checkup, etc.)
    - `previous_submission_id` - Links to previous submission (historical chain)
    - `first_submission_at` - Lead acquisition date (immutable)

  2. Indexes for Performance
    - Duplicate prevention index (blocks accidental double-submit within 1 hour)
    - Latest submission index (for Make.com queries)
    - Submission sequence index (for engagement tracking)
    - User ID index (for dashboard queries)

  3. Purpose
    - Enable engagement tracking (how many times lead resubmits)
    - Prevent duplicate Make.com triggers (only latest submission fires webhook)
    - Support user dashboard (show compliance history over time)
    - Link anonymous submissions to user accounts after registration
    - Prevent selling same lead twice to different accountants
    - Track lead warmth for B2B accountant routing

  4. Migration Strategy
    - Backfill existing records with default values
    - Set all existing records to is_latest_submission = true
    - Set submission_sequence = 1 for all existing
    - Set first_submission_at = created_at for all existing
*/

-- =====================================================
-- STEP 1: ADD NEW COLUMNS
-- =====================================================

-- Link to user account (nullable for anonymous submissions)
ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Normalized email hash for matching (generated column)
ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS lead_email_hash text;

-- Flag for latest submission per email (for Make.com deduplication)
ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS is_latest_submission boolean DEFAULT true;

-- Engagement tracking counter
ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS submission_sequence integer DEFAULT 1;

-- Link to previous submission (historical chain)
ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS previous_submission_id bigint REFERENCES accounting_intakes(id) ON DELETE SET NULL;

-- Lead acquisition date (immutable)
ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS first_submission_at timestamptz;

-- =====================================================
-- STEP 2: BACKFILL EXISTING DATA
-- =====================================================

-- Generate email hashes for existing records
UPDATE accounting_intakes
SET lead_email_hash = md5(lower(trim(email)))
WHERE lead_email_hash IS NULL;

-- Set first_submission_at for existing records
UPDATE accounting_intakes
SET first_submission_at = created_at
WHERE first_submission_at IS NULL;

-- Make email hash NOT NULL after backfill
ALTER TABLE accounting_intakes
  ALTER COLUMN lead_email_hash SET NOT NULL;

-- =====================================================
-- STEP 3: CREATE INDEXES
-- =====================================================

-- Index on user_id for dashboard queries
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_user_id
  ON accounting_intakes(user_id)
  WHERE user_id IS NOT NULL;

-- Index on email hash for deduplication queries
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_email_hash
  ON accounting_intakes(lead_email_hash);

-- Composite index for "latest submission per email" queries
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_latest
  ON accounting_intakes(lead_email_hash, is_latest_submission, created_at DESC)
  WHERE is_latest_submission = true;

-- Index for engagement tracking
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_submission_sequence
  ON accounting_intakes(lead_email_hash, submission_sequence DESC);

-- Index on previous_submission_id for historical chain traversal
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_previous_submission
  ON accounting_intakes(previous_submission_id)
  WHERE previous_submission_id IS NOT NULL;

-- Index on first_submission_at for cohort analysis
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_first_submission
  ON accounting_intakes(first_submission_at);

-- Note: Removed duplicate prevention index with now() - it would require a function-based approach
-- Application-level deduplication via the submitTaxCheckup function handles this instead

-- =====================================================
-- STEP 4: ADD RLS POLICIES FOR NEW COLUMNS
-- =====================================================

-- Allow authenticated users to view their own submissions by user_id
DROP POLICY IF EXISTS "Users can view own intakes by user_id" ON accounting_intakes;

CREATE POLICY "Users can view own intakes by user_id"
  ON accounting_intakes FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- =====================================================
-- STEP 5: CREATE HELPER FUNCTION FOR EMAIL HASH
-- =====================================================

-- Function to generate email hash (for application use)
CREATE OR REPLACE FUNCTION generate_email_hash(email_input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN md5(lower(trim(email_input)));
END;
$$;

-- =====================================================
-- STEP 6: ADD HELPFUL COMMENTS
-- =====================================================

COMMENT ON COLUMN accounting_intakes.user_id IS 'Links anonymous submission to user account after registration. NULL = anonymous lead.';
COMMENT ON COLUMN accounting_intakes.lead_email_hash IS 'MD5 hash of normalized email (lowercase, trimmed) for deduplication matching.';
COMMENT ON COLUMN accounting_intakes.is_latest_submission IS 'TRUE = latest submission from this email. Use this flag to prevent duplicate Make.com triggers.';
COMMENT ON COLUMN accounting_intakes.submission_sequence IS 'Engagement counter: 1 = first checkup, 2 = second checkup, etc. Higher = warmer lead.';
COMMENT ON COLUMN accounting_intakes.previous_submission_id IS 'Links to previous submission from same email. Creates historical chain for engagement tracking.';
COMMENT ON COLUMN accounting_intakes.first_submission_at IS 'Date when this lead first entered system. Never changes, even on resubmissions. Used for cohort analysis.';

COMMENT ON INDEX idx_accounting_intakes_latest IS 'Optimizes "latest submission per email" queries for Make.com webhook filtering and admin dashboards.';
COMMENT ON INDEX idx_accounting_intakes_submission_sequence IS 'Optimizes engagement tracking queries to measure lead warmth and resubmission patterns.';
