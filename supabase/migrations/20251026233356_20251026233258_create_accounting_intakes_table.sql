/*
  # Create Comprehensive Accounting Intakes Table - Phase 1 MVP

  1. New Tables
    - `accounting_intakes`
      - `id` (bigint, primary key) - Auto-incrementing intake ID
      - `created_at` (timestamptz) - When intake was submitted
      - `updated_at` (timestamptz) - Last modification

      ## Personal Information
      - `name` (text, required) - Full name
      - `email` (text, required) - Email address
      - `phone` (text) - Contact phone number
      - `country` (text) - Current country of residence

      ## Residency & Location
      - `residency_status` (text) - tourist, digital_nomad_visa, d7_visa, resident, nhr, citizen, other
      - `days_in_portugal` (integer) - Days per year in Portugal (determines tax residency)
      - `city` (text) - City in Portugal

      ## Income Sources
      - `income_sources` (jsonb) - Array of income types: freelance, employment, rental, investment, pension, business, crypto

      ## Tax Registration Status
      - `has_nif` (boolean) - Has Portuguese NIF (tax ID)
      - `nif_number` (text) - NIF number (9 digits, optional)
      - `has_niss` (boolean) - Has Social Security number
      - `niss_number` (text) - NISS number (optional)
      - `has_iban` (boolean) - Has Portuguese IBAN
      - `iban_number` (text) - IBAN (PT50 format, 25 chars)
      - `has_vat_number` (boolean) - VAT registered
      - `vat_regime` (text) - normal, simplified, exempt, not_sure
      - `has_fiscal_representative` (boolean) - Has fiscal representative
      - `has_electronic_notifications` (boolean) - eFatura setup

      ## Activity & Business
      - `activity_opened` (boolean) - Has opened activity at Financas
      - `activity_code` (text) - CAE code if known
      - `activity_date` (date) - When activity was opened
      - `previous_accountant` (boolean) - Worked with accountant before
      - `accounting_software` (text) - Software used: none, excel, invoicexpress, moloni, sage, quickbooks, other

      ## Urgency & Notes
      - `urgency_level` (text) - low, medium, high
      - `biggest_worry` (text) - Free text main concern
      - `special_notes` (text) - Additional information

      ## Document Storage
      - `files` (jsonb) - Document URLs: {passport_url, nif_doc_url, iban_screenshot_url, lease_url, niss_certificate_url}

      ## Status & Tagging
      - `status` (text) - new, ready, missing_docs, in_review, claimed, completed
      - `tags` (jsonb) - Compliance flags: [urgent, missing_niss, vat_threshold_risk, fiscal_rep_needed]
      - `claimed_by` (uuid) - Future: accountant who claimed this intake
      - `claimed_at` (timestamptz) - Future: when intake was claimed

  2. Security
    - Enable RLS on `accounting_intakes` table
    - Allow public (anonymous) INSERT - no authentication required
    - Allow authenticated users to view their own intakes by email
    - Service role can SELECT all (for admin/Make.com access)

  3. Performance
    - Index on email for lookups
    - Index on status for filtering
    - Index on created_at for sorting
    - Index on claimed_by for accountant queries (future)

  4. Purpose
    - MVP Phase 1: Capture comprehensive compliance data from freelancers/expats
    - No payments yet - just data collection and manual review
    - Structure ready for Phase 2 (accountant claims, credits, billing)
*/

-- Create accounting_intakes table
CREATE TABLE IF NOT EXISTS accounting_intakes (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Personal Information
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,

  -- Residency & Location
  residency_status text,
  days_in_portugal integer,
  city text,

  -- Income Sources (flexible array)
  income_sources jsonb DEFAULT '[]'::jsonb,

  -- Tax Registration
  has_nif boolean,
  nif_number text,
  has_niss boolean,
  niss_number text,
  has_iban boolean,
  iban_number text,
  has_vat_number boolean,
  vat_regime text,
  has_fiscal_representative boolean,
  has_electronic_notifications boolean,

  -- Activity & Business
  activity_opened boolean,
  activity_code text,
  activity_date date,
  previous_accountant boolean,
  accounting_software text,

  -- Urgency & Notes
  urgency_level text NOT NULL DEFAULT 'medium',
  biggest_worry text,
  special_notes text,

  -- Document Storage (flexible JSONB for file URLs)
  files jsonb DEFAULT '{}'::jsonb,

  -- Status & Tagging
  status text NOT NULL DEFAULT 'new',
  tags jsonb DEFAULT '[]'::jsonb,

  -- Future: Accountant Claims (Phase 2)
  claimed_by uuid REFERENCES auth.users(id),
  claimed_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_email ON accounting_intakes(email);
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_status ON accounting_intakes(status);
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_created_at ON accounting_intakes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_claimed_by ON accounting_intakes(claimed_by) WHERE claimed_by IS NOT NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_accounting_intakes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER accounting_intakes_updated_at
  BEFORE UPDATE ON accounting_intakes
  FOR EACH ROW
  EXECUTE FUNCTION update_accounting_intakes_updated_at();

-- Enable Row Level Security
ALTER TABLE accounting_intakes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public INSERT (anonymous submissions - MVP requirement)
CREATE POLICY "Anyone can submit intakes"
  ON accounting_intakes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policy: Service role can view all intakes (admin/Make.com access)
CREATE POLICY "Service role can view all intakes"
  ON accounting_intakes FOR SELECT
  TO service_role
  USING (true);

-- RLS Policy: Authenticated users can view their own intakes by email
CREATE POLICY "Users can view own intakes by email"
  ON accounting_intakes FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- RLS Policy: Future - Accountants can view claimed intakes (Phase 2)
CREATE POLICY "Accountants can view claimed intakes"
  ON accounting_intakes FOR SELECT
  TO authenticated
  USING (
    claimed_by = auth.uid()
  );

-- Add helpful comments
COMMENT ON TABLE accounting_intakes IS 'Phase 1 MVP: Comprehensive freelancer/expat intake data for manual accountant review';
COMMENT ON COLUMN accounting_intakes.email IS 'Contact email - used for Make.com confirmation and follow-up';
COMMENT ON COLUMN accounting_intakes.status IS 'Intake status: new (submitted), ready (complete info), missing_docs (needs files), in_review (being reviewed), claimed (accountant assigned), completed';
COMMENT ON COLUMN accounting_intakes.tags IS 'Compliance flags array: ["urgent", "missing_niss", "vat_threshold_risk", "fiscal_rep_needed"]';
COMMENT ON COLUMN accounting_intakes.files IS 'Document URLs object: {passport_url, nif_doc_url, iban_screenshot_url, lease_url, niss_certificate_url}';
COMMENT ON COLUMN accounting_intakes.income_sources IS 'Income type array: ["freelance", "employment", "rental", "investment", "pension", "business", "crypto"]';
COMMENT ON COLUMN accounting_intakes.claimed_by IS 'Phase 2: UUID of accountant who claimed this intake';
