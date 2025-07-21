/*
  # Add access_type column to partner_submissions

  1. New Column
    - `access_type` (text, default 'lifetime')
      - Tracks whether a partner has lifetime access or subscription access
      - Defaults to 'lifetime' for all existing and new early access partners
      - Will be set to 'subscription' for future subscription-based partners

  2. Purpose
    - Allows differentiation between early access lifetime partners and future subscription partners
    - Enables proper badge display and access management
    - Maintains clear distinction for different partner tiers
*/

-- Add access_type column to partner_submissions table
ALTER TABLE partner_submissions 
ADD COLUMN access_type TEXT DEFAULT 'lifetime' NOT NULL;

-- Add comment to the column for documentation
COMMENT ON COLUMN partner_submissions.access_type IS 'Type of access: lifetime for early access partners, subscription for recurring payment partners';