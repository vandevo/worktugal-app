/*
  # Fix Accounting Intakes RLS - Final Fix

  1. Changes
    - Drop existing INSERT policy
    - Create new policy with proper boolean expression (not string 'true')
    - Ensure anon role can insert without restrictions
    
  2. Security
    - Allow anonymous users to submit intakes
    - No authentication required for initial submission
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Allow anonymous intake submissions" ON accounting_intakes;

-- Create policy with proper boolean expression
CREATE POLICY "Allow anonymous intake submissions"
  ON accounting_intakes
  FOR INSERT
  TO anon
  WITH CHECK (1=1);

-- Also add policy for authenticated users who want to submit
CREATE POLICY "Allow authenticated users to submit intakes"
  ON accounting_intakes
  FOR INSERT
  TO authenticated
  WITH CHECK (1=1);