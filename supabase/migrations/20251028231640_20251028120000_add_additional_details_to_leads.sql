/*
  # Add Additional Details Field to Leads Accounting Table

  1. Changes
    - Add `additional_details` column to `leads_accounting` table
      - Type: text (nullable)
      - Purpose: Store free-form text when users select "Something else" for their situation
      - This replaces the awkward pattern of asking users to explain in a confirmation email

  2. Benefits
    - Better user experience - users can explain their situation immediately in the form
    - Better data quality - no waiting for email replies that may never come
    - Immediate actionable information for the team

  3. Notes
    - Column is nullable since it's only required when main_need = "Something else"
    - No RLS policy changes needed - existing policies cover this column
*/

-- Add additional_details column to leads_accounting table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads_accounting' AND column_name = 'additional_details'
  ) THEN
    ALTER TABLE leads_accounting ADD COLUMN additional_details text;
  END IF;
END $$;

-- Add helpful comment
COMMENT ON COLUMN leads_accounting.additional_details IS 'Free-form text when main_need is "Something else" - allows users to explain their specific situation';