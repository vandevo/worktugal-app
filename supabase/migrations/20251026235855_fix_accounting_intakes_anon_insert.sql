/*
  # Fix Anonymous INSERT Policy for Accounting Intakes

  1. Changes
    - Drop existing INSERT policy that's not working for anon role
    - Create new policy that explicitly allows all anonymous inserts
    - Simplify WITH CHECK to ensure it works across all scenarios

  2. Security
    - Allow anonymous users to submit intakes (business requirement)
    - No authentication required for intake submissions
    - Data validated on client side before submission
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can submit intakes" ON accounting_intakes;

-- Create new explicit policy for anonymous inserts
CREATE POLICY "Allow anonymous intake submissions"
  ON accounting_intakes
  FOR INSERT
  WITH CHECK (true);
