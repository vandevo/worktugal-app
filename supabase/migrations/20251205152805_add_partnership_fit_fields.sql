/*
  # Add Partnership Fit Fields to Accountant Applications

  1. New Fields Added
    - `current_freelancer_clients` (text) - Number range of current freelancer clients
    - `foreign_client_percentage` (text) - Percentage range of foreign/digital nomad clients
    - `preferred_communication` (text) - Preferred communication method
    - `accepts_triage_role` (text) - Acceptance of Worktugal triage model
    - `vat_scenario_answer` (text) - Technical competency test answer
    - `open_to_revenue_share` (boolean) - Willingness to discuss revenue-share model
    - `can_commit_cases_weekly` (boolean) - Can handle 3-5 cases per week
    - `comfortable_english_clients` (boolean) - Comfortable with English-speaking clients
    - `understands_relationship_model` (boolean) - Understands Worktugal client ownership model

  2. Changes
    - Extends accountant_applications table with partnership compatibility screening fields
    - All new fields are nullable to maintain backward compatibility with existing applications

  3. Security
    - No RLS changes needed - existing policies cover new fields
*/

-- Add partnership fit screening fields
DO $$
BEGIN
  -- Current client base indicators
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'current_freelancer_clients'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN current_freelancer_clients text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'foreign_client_percentage'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN foreign_client_percentage text;
  END IF;

  -- Communication and operational fit
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'preferred_communication'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN preferred_communication text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'accepts_triage_role'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN accepts_triage_role text;
  END IF;

  -- Technical competency
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'vat_scenario_answer'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN vat_scenario_answer text;
  END IF;

  -- Partnership terms acceptance
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'open_to_revenue_share'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN open_to_revenue_share boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'can_commit_cases_weekly'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN can_commit_cases_weekly boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'comfortable_english_clients'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN comfortable_english_clients boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'understands_relationship_model'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN understands_relationship_model boolean DEFAULT false;
  END IF;
END $$;

-- Add helpful column comments
COMMENT ON COLUMN accountant_applications.current_freelancer_clients IS 'Range of current freelancer/independent professional clients served';
COMMENT ON COLUMN accountant_applications.foreign_client_percentage IS 'Percentage of clients who are foreign residents or digital nomads';
COMMENT ON COLUMN accountant_applications.preferred_communication IS 'Preferred method for client communication during working hours';
COMMENT ON COLUMN accountant_applications.accepts_triage_role IS 'Acceptance of Worktugal handling intake/diagnostics while accountant focuses on filings';
COMMENT ON COLUMN accountant_applications.vat_scenario_answer IS 'Answer to technical VAT threshold scenario question for competency assessment';
COMMENT ON COLUMN accountant_applications.open_to_revenue_share IS 'Willing to discuss revenue-share partnership model';
COMMENT ON COLUMN accountant_applications.can_commit_cases_weekly IS 'Can commit to handling 3-5 client cases per week if matched';
COMMENT ON COLUMN accountant_applications.comfortable_english_clients IS 'Comfortable working with English-speaking clients';
COMMENT ON COLUMN accountant_applications.understands_relationship_model IS 'Acknowledges Worktugal owns client relationship and accountant focuses on compliance tasks';