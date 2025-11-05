ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS lead_email_hash text;

ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS is_latest_submission boolean DEFAULT true;

ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS submission_sequence integer DEFAULT 1;

ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS previous_submission_id bigint REFERENCES accounting_intakes(id) ON DELETE SET NULL;

ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS first_submission_at timestamptz;

UPDATE accounting_intakes
SET lead_email_hash = md5(lower(trim(email)))
WHERE lead_email_hash IS NULL;

UPDATE accounting_intakes
SET first_submission_at = created_at
WHERE first_submission_at IS NULL;

ALTER TABLE accounting_intakes
  ALTER COLUMN lead_email_hash SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_user_id
  ON accounting_intakes(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_email_hash
  ON accounting_intakes(lead_email_hash);

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_latest
  ON accounting_intakes(lead_email_hash, is_latest_submission, created_at DESC)
  WHERE is_latest_submission = true;

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_submission_sequence
  ON accounting_intakes(lead_email_hash, submission_sequence DESC);

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_previous_submission
  ON accounting_intakes(previous_submission_id)
  WHERE previous_submission_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_first_submission
  ON accounting_intakes(first_submission_at);

DROP POLICY IF EXISTS "Users can view own intakes by user_id" ON accounting_intakes;

CREATE POLICY "Users can view own intakes by user_id"
  ON accounting_intakes FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );

CREATE OR REPLACE FUNCTION generate_email_hash(email_input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN md5(lower(trim(email_input)));
END;
$$;

COMMENT ON COLUMN accounting_intakes.user_id IS 'Links anonymous submission to user account after registration. NULL = anonymous lead.';
COMMENT ON COLUMN accounting_intakes.lead_email_hash IS 'MD5 hash of normalized email (lowercase, trimmed) for deduplication matching.';
COMMENT ON COLUMN accounting_intakes.is_latest_submission IS 'TRUE = latest submission from this email. Use this flag to prevent duplicate Make.com triggers.';
COMMENT ON COLUMN accounting_intakes.submission_sequence IS 'Engagement counter: 1 = first checkup, 2 = second checkup, etc. Higher = warmer lead.';
COMMENT ON COLUMN accounting_intakes.previous_submission_id IS 'Links to previous submission from same email. Creates historical chain for engagement tracking.';
COMMENT ON COLUMN accounting_intakes.first_submission_at IS 'Date when this lead first entered system. Never changes, even on resubmissions. Used for cohort analysis.';

COMMENT ON INDEX idx_accounting_intakes_latest IS 'Optimizes "latest submission per email" queries for Make.com webhook filtering and admin dashboards.';
COMMENT ON INDEX idx_accounting_intakes_submission_sequence IS 'Optimizes engagement tracking queries to measure lead warmth and resubmission patterns.';