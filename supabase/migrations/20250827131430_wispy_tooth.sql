/*
  # Update Outsite perk redemption details with user-friendly text

  1. Changes Made
    - Update Outsite perk redemption method to 'direct_link'
    - Set user-friendly redemption details text that includes the URL
    - Update timestamp to track the change

  2. Details
    - The text will display nicely to users
    - The URL can still be extracted by the frontend for the button action
    - Maintains backward compatibility with URL extraction logic
*/

UPDATE partner_submissions 
SET 
  perk_redemption_method = 'direct_link',
  perk_redemption_details = 'Click claim perk to see the latest Outsite member deals. https://go.worktugal.com/outsite-deals',
  updated_at = NOW()
WHERE business_name = 'Outsite' 
  AND business_neighborhood = 'Cais do Sodré';