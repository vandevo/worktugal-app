/*
  # Add accounting services interest field to tax_checkup_leads
  
  1. Changes
    - Add `interested_in_accounting_services` boolean column to `tax_checkup_leads` table
    - Default value: false
    - Allows tracking which leads want accounting help without committing to specific pricing/timeline
  
  2. Purpose
    - Segment warm leads who express interest in getting expert help
    - Evergreen field that works regardless of partner timeline
    - Enables targeted outreach when accounting services launch
  
  3. Notes
    - Non-breaking change (default false means existing records unaffected)
    - No RLS changes needed (inherits existing policies)
    - Column is nullable to handle any edge cases gracefully
*/

-- Add interested_in_accounting_services column to tax_checkup_leads
ALTER TABLE tax_checkup_leads 
ADD COLUMN IF NOT EXISTS interested_in_accounting_services boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN tax_checkup_leads.interested_in_accounting_services IS 'User expressed interest in accounting services for fixing compliance issues';
