/*
  # Update Outsite perk to use direct link redemption

  1. Changes
     - Update Outsite perk_redemption_method from 'other' to 'direct_link'
     - Update perk_redemption_details to the correct URL
     - Set updated_at timestamp

  2. Target
     - Updates the Outsite business entry in partner_submissions table
     - Enables proper "Claim Perk" button functionality
*/

-- Update Outsite perk to use direct link redemption method
UPDATE partner_submissions 
SET 
  perk_redemption_method = 'direct_link',
  perk_redemption_details = 'https://go.worktugal.com/outsite-deals',
  updated_at = now()
WHERE 
  business_name = 'Outsite'
  AND status = 'approved';