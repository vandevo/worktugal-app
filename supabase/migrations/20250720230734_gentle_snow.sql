/*
  # Add perk_customer_nif column to partner_submissions table

  1. Changes
    - Add `perk_customer_nif` column to `partner_submissions` table
    - Column is nullable since it's only required when `perk_needs_nif` is true
    - TEXT type to store the 9-digit Portuguese NIF number

  2. Purpose
    - Store customer NIF numbers for businesses that need to issue Recibo Verde
    - Enables automatic invoice generation with proper tax identification
*/

-- Add perk_customer_nif column to partner_submissions table
ALTER TABLE partner_submissions 
ADD COLUMN perk_customer_nif TEXT;

-- Add a comment to document the column purpose
COMMENT ON COLUMN partner_submissions.perk_customer_nif IS 'Portuguese NIF (tax ID) number for businesses requiring Recibo Verde invoicing';