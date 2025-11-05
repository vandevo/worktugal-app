/*
  # Rollback Unsafe Anonymous SELECT Policy

  1. Problem with Previous Approach
    - Giving anon role broad SELECT access to accounting_intakes was too permissive
    - Using SELECT * tried to join with users table, causing permission errors
    - Security concern: anon users could potentially enumerate all records

  2. Better Solution
    - Modify the application code to select only specific columns (not *)
    - This avoids foreign key joins that require access to other tables
    - Maintains tighter security by limiting what anon users can access
    - The existing INSERT policy is sufficient for anonymous submissions

  3. Changes
    - Remove the anonymous SELECT policy
    - Revoke SELECT grant from anon role
    - Application code now selects specific columns only
*/

-- Remove the policy we added
DROP POLICY IF EXISTS "Anonymous users can view intakes by ID" ON accounting_intakes;

-- Revoke the grant
REVOKE SELECT ON accounting_intakes FROM anon;

-- Note: Anonymous users can still INSERT (submit tax checkups)
-- The results page will work because we're selecting specific columns
-- that don't require foreign key lookups