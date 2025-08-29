/*
  # Fix Outsite perk redemption display text
  
  Update the Outsite perk to show user-friendly redemption text while keeping the URL extractable.
  
  1. Changes Made
    - Update redemption_details to show clean, user-friendly text with URL at the end
    - Keep redemption_method as 'direct_link'
    - Ensure URL is properly formatted and extractable
  
  2. Result
    - Users see: "Click claim perk to see the latest Outsite member deals."
    - Button extracts the URL and opens it correctly
    - Clean, professional display
*/

UPDATE partner_submissions 
SET 
  redemption_details = 'Click claim perk to see the latest Outsite member deals. https://go.worktugal.com/outsite-deals',
  updated_at = now()
WHERE 
  business_name = 'Outsite' 
  AND business_neighborhood = 'Cais do Sodré';</parameter>