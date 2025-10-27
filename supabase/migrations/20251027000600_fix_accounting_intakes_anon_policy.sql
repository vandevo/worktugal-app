/*
  # Fix Anonymous Intake Submission Policy

  1. Changes
    - Drop and recreate the INSERT policy with explicit anon role
    - Grant INSERT permission to anon role explicitly
    
  2. Security
    - Allow anonymous users to submit intakes
    - No authentication required for initial submission
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Allow anonymous intake submissions" ON accounting_intakes;

-- Grant INSERT to anon role
GRANT INSERT ON accounting_intakes TO anon;

-- Recreate policy for anon role specifically
CREATE POLICY "Allow anonymous intake submissions"
  ON accounting_intakes
  FOR INSERT
  TO anon
  WITH CHECK (true);