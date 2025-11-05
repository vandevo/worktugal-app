/*
  # Add Anonymous Read Access to Approved Partners

  1. Changes
    - Add new RLS policy allowing anonymous (public) users to read approved partners
    - Maintains existing authenticated user policy for full access (approved + own + admin)
  
  2. Security
    - Anonymous users can ONLY see partners with status = 'approved'
    - Cannot see draft, pending, or rejected submissions
    - Cannot modify any data
    - Must log in to unlock/claim perks (handled by frontend)
  
  3. Use Case
    - Public homepage displays approved partners to all visitors
    - Encourages sign-ups by showing value before login
    - Partners get more visibility to drive conversions
*/

-- Add policy for anonymous users to view approved partners only
CREATE POLICY "Anonymous users can view approved partners"
  ON public.partner_submissions
  FOR SELECT
  TO anon
  USING (status = 'approved');

-- Verify RLS is enabled (should already be enabled)
ALTER TABLE public.partner_submissions ENABLE ROW LEVEL SECURITY;
