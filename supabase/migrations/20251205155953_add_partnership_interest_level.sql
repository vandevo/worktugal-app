/*
  # Add Partnership Interest Level Field

  1. New Field
    - `partnership_interest_level` (text) - Replaces 4 boolean checkboxes with single interest signal
    - Options: 'very_interested', 'interested_with_questions', 'uncertain'
  
  2. Changes
    - Adds new field to capture partnership interest without requiring commitment
    - Existing boolean fields remain for backward compatibility but will be optional in new UX
  
  3. Security
    - No RLS changes needed - covered by existing policies
*/

-- Add partnership interest level field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'partnership_interest_level'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN partnership_interest_level text;
  END IF;
END $$;

COMMENT ON COLUMN accountant_applications.partnership_interest_level IS 'Interest level in partnership model: very_interested, interested_with_questions, or uncertain';
