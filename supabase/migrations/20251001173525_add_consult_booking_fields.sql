/*
  # Add Accounting Desk Consult Booking Fields

  1. Changes to `partner_submissions` table
    - Add `submission_type` column to distinguish between 'perk' and 'consult' submissions
    - Add `service_type` for consult bookings (triage, start_pack, annual_return, add_on)
    - Add `preferred_date` for scheduling consult appointments
    - Add `outcome_url` for delivered consult outcome documents
    - Add consult-specific contact fields (full_name, phone, notes)
    - Extend status enum to include consult workflow states

  2. Important Notes
    - Existing perk submissions will have `submission_type` = 'perk' by default
    - New consult bookings will use `submission_type` = 'consult'
    - Consult status flow: requested → paid → scheduled → delivered
    - All changes use IF NOT EXISTS to prevent errors on re-run
    - No data loss - purely additive changes
*/

-- Add submission_type column to distinguish perks from consults
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'submission_type'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN submission_type text DEFAULT 'perk' NOT NULL;
  END IF;
END $$;

-- Add service_type for consult bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'service_type'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN service_type text;
  END IF;
END $$;

-- Add preferred_date for consult scheduling
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'preferred_date'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN preferred_date timestamptz;
  END IF;
END $$;

-- Add outcome_url for delivered consult documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'outcome_url'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN outcome_url text;
  END IF;
END $$;

-- Add full_name for consult bookings (different from contact_name for perks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN full_name text;
  END IF;
END $$;

-- Add phone for consult bookings (different from contact_phone for perks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'phone'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN phone text;
  END IF;
END $$;

-- Add email for consult bookings (different from contact_email for perks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'email'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN email text;
  END IF;
END $$;

-- Add notes field for additional consult information
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'notes'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN notes text;
  END IF;
END $$;

-- Add scheduled_date for confirmed appointment time
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'scheduled_date'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN scheduled_date timestamptz;
  END IF;
END $$;

-- Add stripe_session_id for tracking checkout sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'stripe_session_id'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN stripe_session_id text;
  END IF;
END $$;

-- Create index for efficient consult booking queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'partner_submissions' AND indexname = 'idx_partner_submissions_submission_type'
  ) THEN
    CREATE INDEX idx_partner_submissions_submission_type ON partner_submissions(submission_type);
  END IF;
END $$;

-- Create index for service type filtering
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'partner_submissions' AND indexname = 'idx_partner_submissions_service_type'
  ) THEN
    CREATE INDEX idx_partner_submissions_service_type ON partner_submissions(service_type);
  END IF;
END $$;

-- Create index for date-based queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'partner_submissions' AND indexname = 'idx_partner_submissions_preferred_date'
  ) THEN
    CREATE INDEX idx_partner_submissions_preferred_date ON partner_submissions(preferred_date);
  END IF;
END $$;

-- Add comment to clarify dual use of table
COMMENT ON TABLE partner_submissions IS 'Stores both perk partner submissions and accounting desk consult bookings. Use submission_type to distinguish.';
COMMENT ON COLUMN partner_submissions.submission_type IS 'Type of submission: perk (partner marketplace) or consult (accounting desk booking)';
COMMENT ON COLUMN partner_submissions.service_type IS 'For consults only: triage, start_pack, annual_return, or add_on';
COMMENT ON COLUMN partner_submissions.preferred_date IS 'For consults only: customer preferred appointment date/time';
COMMENT ON COLUMN partner_submissions.outcome_url IS 'For consults only: URL to delivered outcome document (PDF, Google Doc, etc)';
