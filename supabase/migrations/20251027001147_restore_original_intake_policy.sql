/*
  # Restore Original Accounting Intakes Policy

  1. Changes
    - Drop all existing INSERT policies
    - Restore original "Anyone can submit intakes" policy
    - This policy explicitly allows BOTH anon and authenticated roles
    
  2. Security
    - Allow anonymous AND authenticated users to submit intakes
    - No restrictions on intake submission (MVP requirement)
*/

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Allow anonymous intake submissions" ON accounting_intakes;
DROP POLICY IF EXISTS "Allow authenticated users to submit intakes" ON accounting_intakes;

-- Restore the original policy from the initial migration
CREATE POLICY "Anyone can submit intakes"
  ON accounting_intakes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);