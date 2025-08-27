/*
  # Fix Outsite redemption text to be user-friendly
  
  1. Updates
    - Update Outsite perk redemption details to show clean user-friendly text
    - Keep the URL at the end for extraction by frontend
    - Ensure redemption method is set to 'direct_link'
  
  2. Changes
    - Display text: "Click claim perk to see the latest Outsite member deals."
    - URL remains extractable for button functionality
*/

UPDATE partner_submissions 
SET 
  perk_redemption_method = 'direct_link',
  perk_redemption_details = 'Click claim perk to see the latest Outsite member deals. https://go.worktugal.com/outsite-deals',
  updated_at = now()
WHERE 
  business_name = 'Outsite' 
  AND business_neighborhood = 'Cais do Sodré';