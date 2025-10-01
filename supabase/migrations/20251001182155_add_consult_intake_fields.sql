/*
  # Add Detailed Consult Intake Fields

  1. New Columns Added
    - `residency_status`: Current residency status in Portugal
    - `days_in_portugal`: Number of days spent in Portugal
    - `income_sources`: JSON array of income source types
    - `has_nif`: Boolean indicating if user has Portuguese NIF
    - `nif_number`: Store NIF if available
    - `has_vat_number`: Boolean for VAT registration status
    - `vat_regime`: Current VAT regime (normal/simplified/exempt)
    - `has_fiscal_representative`: Boolean for fiscal representative status
    - `has_electronic_notifications`: Boolean for eFatura/electronic notification setup
    - `urgency_level`: High/medium/low priority indicator
    - `accounting_software`: Software currently used (if any)
    - `previous_accountant`: Had accountant before (yes/no)
  
  2. Purpose
    - Enables comprehensive tax situation assessment
    - Helps accountants prepare for consultation
    - Ensures compliance with Portuguese tax requirements
    - Provides context for personalized advice

  3. Security
    - All fields nullable for progressive disclosure
    - RLS policies inherited from partner_submissions table
    - Sensitive data (NIF) encrypted at rest by Supabase
*/

-- Add residency status field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'residency_status'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN residency_status text;
  END IF;
END $$;

-- Add days in Portugal field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'days_in_portugal'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN days_in_portugal integer;
  END IF;
END $$;

-- Add income sources as JSONB array
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'income_sources'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN income_sources jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add NIF status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'has_nif'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN has_nif boolean;
  END IF;
END $$;

-- Add NIF number
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'nif_number'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN nif_number text;
  END IF;
END $$;

-- Add VAT registration status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'has_vat_number'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN has_vat_number boolean;
  END IF;
END $$;

-- Add VAT regime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'vat_regime'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN vat_regime text;
  END IF;
END $$;

-- Add fiscal representative status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'has_fiscal_representative'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN has_fiscal_representative boolean;
  END IF;
END $$;

-- Add electronic notifications status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'has_electronic_notifications'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN has_electronic_notifications boolean;
  END IF;
END $$;

-- Add urgency level
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'urgency_level'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN urgency_level text DEFAULT 'medium';
  END IF;
END $$;

-- Add accounting software used
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'accounting_software'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN accounting_software text;
  END IF;
END $$;

-- Add previous accountant status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'previous_accountant'
  ) THEN
    ALTER TABLE partner_submissions 
    ADD COLUMN previous_accountant boolean;
  END IF;
END $$;

-- Add column comments for documentation
COMMENT ON COLUMN partner_submissions.residency_status IS 'Residency status in Portugal: tourist, digital_nomad_visa, d7_visa, resident, citizen, other';
COMMENT ON COLUMN partner_submissions.days_in_portugal IS 'Approximate number of days spent in Portugal per year';
COMMENT ON COLUMN partner_submissions.income_sources IS 'Array of income types: freelance, employment, rental, investment, pension, business, crypto, other';
COMMENT ON COLUMN partner_submissions.has_nif IS 'Whether user has Portuguese NIF (tax identification number)';
COMMENT ON COLUMN partner_submissions.nif_number IS 'Portuguese NIF number if available (encrypted at rest)';
COMMENT ON COLUMN partner_submissions.has_vat_number IS 'Whether user is registered for VAT in Portugal';
COMMENT ON COLUMN partner_submissions.vat_regime IS 'VAT regime: normal, simplified, exempt, not_applicable';
COMMENT ON COLUMN partner_submissions.has_fiscal_representative IS 'Whether user has appointed a fiscal representative';
COMMENT ON COLUMN partner_submissions.has_electronic_notifications IS 'Whether user has set up electronic notifications (eFatura/Portal das Finanças)';
COMMENT ON COLUMN partner_submissions.urgency_level IS 'Consultation urgency: high, medium, low';
COMMENT ON COLUMN partner_submissions.accounting_software IS 'Accounting software currently used: none, excel, invoicexpress, moloni, sage, other';
COMMENT ON COLUMN partner_submissions.previous_accountant IS 'Whether user has worked with an accountant before';
