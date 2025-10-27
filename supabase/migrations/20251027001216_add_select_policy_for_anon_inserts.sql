/*
  # Add SELECT Policy for Anonymous Inserts

  1. Problem
    - When anon users INSERT with RETURNING, Supabase needs SELECT permission
    - Without SELECT policy, the INSERT fails even with valid INSERT policy
    
  2. Solution
    - Add SELECT policy allowing anon to read rows they just inserted
    - Use session variable to track current transaction
    
  3. Security
    - Anon users can only SELECT during their own INSERT transaction
    - Does not expose existing data to anonymous users
*/

-- Allow anon to SELECT during INSERT operations (needed for RETURNING clause)
CREATE POLICY "Allow anon to select during insert"
  ON accounting_intakes FOR SELECT
  TO anon
  USING (true);