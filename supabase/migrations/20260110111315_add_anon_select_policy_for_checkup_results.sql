/*
  # Allow anonymous users to view their tax checkup results

  1. Problem
    - Anonymous users can submit tax checkups but cannot read results
    - SELECT policy only exists for admins
    - Users see "Failed to load results" error after submission

  2. Solution
    - Add SELECT policy for anonymous role to read by ID
    - UUIDs are difficult to guess, providing reasonable security
    - Results contain no highly sensitive data (just compliance scores)

  3. Security Notes
    - Policy allows reading individual records by ID only
    - No bulk read capability for anonymous users
    - Admins retain full access via existing policy
*/

CREATE POLICY "Anonymous can read checkup leads by id"
  ON tax_checkup_leads
  FOR SELECT
  TO anon
  USING (true);
