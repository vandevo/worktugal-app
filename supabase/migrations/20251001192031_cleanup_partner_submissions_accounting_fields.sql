/*
  # Complete Cleanup: Remove All Accounting Desk Fields from Partner Submissions

  ## Overview
  This migration completes the separation of Accounting Desk from Perk Marketplace
  by removing all accounting-related columns from the partner_submissions table.

  ## Changes

  ### 1. Update Foreign Key References
  - Change appointments table to reference consult_bookings instead of partner_submissions
  - This properly links appointments to the correct booking table

  ### 2. Remove Accounting-Specific Columns from partner_submissions
  The following columns are accounting-desk specific and will be removed:
  - submission_type (no longer needed - table is perk-only)
  - service_type (accounting service type)
  - preferred_date (consultation scheduling)
  - scheduled_date (confirmed appointment time)
  - outcome_url (delivered consultation documents)
  - full_name (client name - different from contact_name for partners)
  - phone (client phone - different from contact_phone for partners)
  - email (client email - different from contact_email for partners)
  - notes (client notes)
  - stripe_session_id (moved to consult_bookings)
  - residency_status (tax consultation intake field)
  - days_in_portugal (tax consultation intake field)
  - income_sources (tax consultation intake field)
  - has_nif (tax consultation intake field)
  - nif_number (tax consultation intake field)
  - has_vat_number (tax consultation intake field)
  - vat_regime (tax consultation intake field)
  - has_fiscal_representative (tax consultation intake field)
  - has_electronic_notifications (tax consultation intake field)
  - urgency_level (consultation priority)
  - accounting_software (tax consultation intake field)
  - previous_accountant (tax consultation intake field)

  ### 3. Update Table Comments
  - Clarify that partner_submissions is exclusively for Perk Marketplace

  ## Result
  After this migration:
  - partner_submissions = Perk Marketplace partners ONLY
  - consult_bookings = Accounting Desk consultations ONLY
  - appointments = Links to consult_bookings (not partner_submissions)
  - Complete architectural separation achieved
*/

-- Step 1: Update appointments table to reference consult_bookings instead of partner_submissions
-- First, drop the existing foreign key constraint
ALTER TABLE appointments
DROP CONSTRAINT IF EXISTS appointments_submission_id_fkey;

-- Rename the column to be more clear about what it references
ALTER TABLE appointments
RENAME COLUMN submission_id TO booking_id;

-- Add new foreign key to consult_bookings
ALTER TABLE appointments
ADD CONSTRAINT appointments_booking_id_fkey
FOREIGN KEY (booking_id) REFERENCES consult_bookings(id) ON DELETE CASCADE;

-- Add comment to clarify
COMMENT ON COLUMN appointments.booking_id IS 'References consult_bookings.id (Accounting Desk consultation booking)';

-- Step 2: Remove all accounting-related columns from partner_submissions
-- These fields are now exclusively in consult_bookings table

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

-- Step 3: Update indexes to remove accounting-related ones
DROP INDEX IF EXISTS idx_partner_submissions_submission_type;
DROP INDEX IF EXISTS idx_partner_submissions_service_type;
DROP INDEX IF EXISTS idx_partner_submissions_preferred_date;

-- Step 4: Update table and column comments for clarity
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
