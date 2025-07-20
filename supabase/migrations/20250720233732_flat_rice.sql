/*
  # Add customer name field for tax invoices

  1. Changes
    - Add `perk_customer_name` column to `partner_submissions` table
    - This field stores the customer's full name or company name for tax invoicing
    - Complements the existing `perk_customer_nif` field
  
  2. Details
    - Optional text field (can be null when not needed)
    - Used when `perk_needs_nif` is true for proper Fatura/Recibo Verde generation
    - Required by Portuguese tax law when issuing invoices with NIF
*/

-- Add customer name field for tax invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_submissions' AND column_name = 'perk_customer_name'
  ) THEN
    ALTER TABLE partner_submissions ADD COLUMN perk_customer_name TEXT;
  END IF;
END $$;

-- Add comment to document the field purpose
COMMENT ON COLUMN partner_submissions.perk_customer_name IS 'Customer full name or company name for tax invoice generation (Fatura/Recibo Verde)';