/*
  # Add Tax Checkup Lead Generation Fields

  1. New Fields Added to accounting_intakes
    - `source_type` - Distinguishes "tax_checkup" vs "full_intake" leads
    - `compliance_score_red` - Count of critical compliance issues (0-5)
    - `compliance_score_yellow` - Count of warnings (0-7)
    - `compliance_score_green` - Count of compliant areas (0-5)
    - `compliance_report` - Generated personalized compliance report text
    - `lead_quality_score` - Calculated priority score (1-100)
    - `email_marketing_consent` - User opted in for updates
    - `work_type` - Simplified work category (developer, designer, etc.)
    - `estimated_annual_income` - Income bracket for qualification
    - `months_in_portugal` - Used for tax residency calculation
    - `utm_source`, `utm_campaign`, `utm_medium` - Marketing attribution
    - `last_step_reached` - Funnel analytics for abandonment tracking

  2. Indexes
    - Index on source_type for filtering checkup vs intake leads
    - Index on compliance_score_red for prioritizing urgent cases
    - Index on lead_quality_score for sorting best leads

  3. Purpose
    - Enable Tax Checkup lead generation tool
    - Track compliance scoring for automated report generation
    - Support lead quality prioritization for accountant routing
    - Provide marketing attribution data for channel optimization
*/

-- Add new columns to accounting_intakes
ALTER TABLE accounting_intakes
  ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'full_intake',
  ADD COLUMN IF NOT EXISTS compliance_score_red integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS compliance_score_yellow integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS compliance_score_green integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS compliance_report text,
  ADD COLUMN IF NOT EXISTS lead_quality_score integer,
  ADD COLUMN IF NOT EXISTS email_marketing_consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS work_type text,
  ADD COLUMN IF NOT EXISTS estimated_annual_income text,
  ADD COLUMN IF NOT EXISTS months_in_portugal integer,
  ADD COLUMN IF NOT EXISTS last_step_reached integer;

-- Create indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_source_type ON accounting_intakes(source_type);
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_compliance_red ON accounting_intakes(compliance_score_red DESC);
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_lead_quality ON accounting_intakes(lead_quality_score DESC) WHERE lead_quality_score IS NOT NULL;

-- Add helpful comments
COMMENT ON COLUMN accounting_intakes.source_type IS 'Lead source: "tax_checkup" for quick diagnostic, "full_intake" for comprehensive form';
COMMENT ON COLUMN accounting_intakes.compliance_score_red IS 'Critical compliance issues count (0-5)';
COMMENT ON COLUMN accounting_intakes.compliance_score_yellow IS 'Warning-level compliance gaps count (0-7)';
COMMENT ON COLUMN accounting_intakes.compliance_score_green IS 'Areas where user is compliant count (0-5)';
COMMENT ON COLUMN accounting_intakes.compliance_report IS 'Generated compliance report text with personalized recommendations';
COMMENT ON COLUMN accounting_intakes.lead_quality_score IS 'Calculated lead quality (1-100) for prioritization';
COMMENT ON COLUMN accounting_intakes.email_marketing_consent IS 'User consented to receive email updates';
COMMENT ON COLUMN accounting_intakes.work_type IS 'Simplified work category: developer, designer, consultant, content_creator, etc.';
COMMENT ON COLUMN accounting_intakes.estimated_annual_income IS 'Income bracket: under_10k, 10k_25k, 25k_50k, over_50k';
COMMENT ON COLUMN accounting_intakes.months_in_portugal IS 'Months per year in Portugal (for residency calculation)';
COMMENT ON COLUMN accounting_intakes.last_step_reached IS 'Highest step number reached before abandonment (for funnel analysis)';
