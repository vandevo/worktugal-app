/*
  # Complete Cleanup: Remove All Accounting Desk Fields from Partner Submissions

  ## Overview
  This migration completes the separation of Accounting Desk from Perk Marketplace
  by removing all accounting-related columns from the partner_submissions table.

  ## Changes

  ### 1. Update Foreign Key References
  - Change appointments table to reference consult_bookings instead of partner_submissions

  ### 2. Remove Accounting-Specific Columns from partner_submissions

  ### 3. Update Table Comments
  - Clarify that partner_submissions is exclusively for Perk Marketplace
*/

-- Step 1: Update appointments table to reference consult_bookings instead of partner_submissions
ALTER TABLE appointments
DROP CONSTRAINT IF EXISTS appointments_submission_id_fkey;

ALTER TABLE appointments
RENAME COLUMN submission_id TO booking_id;

ALTER TABLE appointments
ADD CONSTRAINT appointments_booking_id_fkey
FOREIGN KEY (booking_id) REFERENCES consult_bookings(id) ON DELETE CASCADE;

COMMENT ON COLUMN appointments.booking_id IS 'References consult_bookings.id (Accounting Desk consultation booking)';

-- Step 2: Remove all accounting-related columns from partner_submissions
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS submission_type;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS service_type;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS preferred_date;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS scheduled_date;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS outcome_url;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS full_name;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS phone;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS email;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS notes;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS stripe_session_id;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS residency_status;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS days_in_portugal;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS income_sources;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS has_nif;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS nif_number;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS has_vat_number;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS vat_regime;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS has_fiscal_representative;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS has_electronic_notifications;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS urgency_level;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS accounting_software;
ALTER TABLE partner_submissions DROP COLUMN IF EXISTS previous_accountant;

-- Step 3: Update indexes
DROP INDEX IF EXISTS idx_partner_submissions_submission_type;
DROP INDEX IF EXISTS idx_partner_submissions_service_type;
DROP INDEX IF EXISTS idx_partner_submissions_preferred_date;

-- Step 4: Update comments
COMMENT ON TABLE partner_submissions IS 'Perk Marketplace partner submissions - partners offering perks/discounts to members. For Accounting Desk consultations, see consult_bookings table.';

COMMENT ON COLUMN partner_submissions.status IS 'Submission status for perk partners: pending_payment, completed_payment, approved, rejected, abandoned';

COMMENT ON COLUMN partner_submissions.access_type IS 'Partner access type: lifetime (early access) or subscription (recurring)';

-- Add indexes for perk-specific queries
CREATE INDEX IF NOT EXISTS idx_partner_submissions_status ON partner_submissions(status);
CREATE INDEX IF NOT EXISTS idx_partner_submissions_business_category ON partner_submissions(business_category);
CREATE INDEX IF NOT EXISTS idx_partner_submissions_created_at ON partner_submissions(created_at DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Successfully cleaned up partner_submissions table - it is now exclusively for Perk Marketplace';
  RAISE NOTICE 'Accounting Desk data is now completely separate in consult_bookings and accounting_clients tables';
END $$;
