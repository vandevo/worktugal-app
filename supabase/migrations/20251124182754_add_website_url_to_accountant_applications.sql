/*
  # Add website_url to accountant_applications

  1. Changes
    - Add `website_url` column to `accountant_applications` table
    - Optional text field for accountant's personal or business website

  2. Purpose
    - Allows accountants to showcase their professional website
    - Provides additional context for admin review
*/

-- Add website_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN website_url text;
  END IF;
END $$;
