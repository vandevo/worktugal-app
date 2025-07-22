/*
  # Add Public Read Access for Approved Perks

  1. Security Changes
    - Add RLS policy to `partner_submissions` table
    - Enable public SELECT access for approved perks only
    - Maintain existing security for all other submission statuses

  2. Purpose
    - Allow PerksDirectory component to fetch live approved perks from database
    - Prepare for switching from mock data to live data
    - Enable public browsing of verified partner offers

  3. Security Notes
    - Only submissions with status = 'approved' become publicly readable
    - All other statuses (pending_payment, completed_payment, abandoned, rejected) remain protected
    - Existing user-specific policies remain unchanged
    - No write access granted to public users
*/

-- Add RLS policy for public read access to approved perks
CREATE POLICY "Enable public read access for approved perks"
  ON partner_submissions
  FOR SELECT
  TO public
  USING (status = 'approved');