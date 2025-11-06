/*
  # Create tax checkup leads table

  1. New Tables
    - `tax_checkup_leads`
      - Lightweight lead capture from 3-minute checkup form
      - Stores minimal data: work type, income estimate, time in Portugal
      - Includes compliance scoring and UTM tracking
      - Separate from full intake submissions for cleaner data

  2. Changes
    - Add `came_from_checkup_id` to `accounting_intakes` for conversion tracking
    - Link checkup leads to full intake submissions when users convert

  3. Security
    - Enable RLS on `tax_checkup_leads`
    - Allow anonymous inserts (for form submissions)
    - Admins can read/update all records
    - Users cannot read checkup data (privacy)

  4. Indexes
    - Email hash for deduplication
    - Created_at for sorting
    - Status for filtering
    - Conversion tracking fields

  Important: This separates marketing funnel (checkup) from service delivery (intake)
*/

-- Create tax_checkup_leads table
CREATE TABLE IF NOT EXISTS public.tax_checkup_leads (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Identity (minimal)
  email text NOT NULL,
  name text,
  phone text,

  -- Checkup form data (3 main fields)
  work_type text NOT NULL,
  estimated_annual_income text NOT NULL,
  months_in_portugal integer NOT NULL,

  -- Additional context from checkup
  residency_status text,
  has_nif boolean,
  activity_opened boolean,
  has_vat_number boolean,
  has_niss boolean,
  has_fiscal_representative boolean,

  -- Compliance scoring
  compliance_score_red integer DEFAULT 0,
  compliance_score_yellow integer DEFAULT 0,
  compliance_score_green integer DEFAULT 0,
  compliance_report text,
  lead_quality_score integer,

  -- Marketing tracking
  utm_source text,
  utm_campaign text,
  utm_medium text,
  email_marketing_consent boolean DEFAULT false,

  -- Lead management
  status text NOT NULL DEFAULT 'new',
  notes text,

  -- Conversion tracking
  converted_to_intake_id bigint,
  converted_at timestamptz,

  -- Deduplication
  email_hash text NOT NULL,
  is_latest_submission boolean DEFAULT true,
  submission_sequence integer DEFAULT 1,
  previous_submission_id bigint,
  first_submission_at timestamptz,

  -- Foreign keys will be added after accounting_intakes is updated
  CONSTRAINT tax_checkup_leads_previous_submission_fkey
    FOREIGN KEY (previous_submission_id)
    REFERENCES tax_checkup_leads (id)
    ON DELETE SET NULL
);

-- Add came_from_checkup_id to accounting_intakes
ALTER TABLE public.accounting_intakes
  ADD COLUMN IF NOT EXISTS came_from_checkup_id bigint;

-- Add foreign key from accounting_intakes to tax_checkup_leads
ALTER TABLE public.accounting_intakes
  ADD CONSTRAINT accounting_intakes_came_from_checkup_fkey
  FOREIGN KEY (came_from_checkup_id)
  REFERENCES tax_checkup_leads (id)
  ON DELETE SET NULL;

-- Add foreign key from tax_checkup_leads to accounting_intakes (for conversion)
ALTER TABLE public.tax_checkup_leads
  ADD CONSTRAINT tax_checkup_leads_converted_to_intake_fkey
  FOREIGN KEY (converted_to_intake_id)
  REFERENCES accounting_intakes (id)
  ON DELETE SET NULL;

-- Create indexes for tax_checkup_leads
CREATE INDEX IF NOT EXISTS idx_tax_checkup_leads_email_hash
  ON public.tax_checkup_leads (email_hash);

CREATE INDEX IF NOT EXISTS idx_tax_checkup_leads_created_at
  ON public.tax_checkup_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tax_checkup_leads_status
  ON public.tax_checkup_leads (status);

CREATE INDEX IF NOT EXISTS idx_tax_checkup_leads_converted_to_intake_id
  ON public.tax_checkup_leads (converted_to_intake_id);

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_came_from_checkup_id
  ON public.accounting_intakes (came_from_checkup_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_tax_checkup_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tax_checkup_leads_updated_at_trigger
  BEFORE UPDATE ON tax_checkup_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_tax_checkup_leads_updated_at();

-- Enable RLS
ALTER TABLE public.tax_checkup_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tax_checkup_leads

-- Anonymous users can insert (for form submissions)
CREATE POLICY "Anonymous can insert checkup leads"
  ON tax_checkup_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert checkup leads"
  ON tax_checkup_leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only admins can select checkup leads
CREATE POLICY "Admins can select all checkup leads"
  ON tax_checkup_leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Only admins can update checkup leads
CREATE POLICY "Admins can update checkup leads"
  ON tax_checkup_leads
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

-- Grant necessary permissions
GRANT INSERT ON public.tax_checkup_leads TO anon;
GRANT INSERT ON public.tax_checkup_leads TO authenticated;
GRANT SELECT, UPDATE ON public.tax_checkup_leads TO authenticated;
