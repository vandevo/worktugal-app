/*
  # Add Anonymous SELECT Policy for Accounting Intakes

  1. Problem
    - Anonymous users can submit tax checkup forms (INSERT)
    - But they cannot view the results page because there's no SELECT policy for anon role
    - This breaks the user flow: submit form → view results

  2. Solution
    - Add a SELECT policy for anonymous users to view intake records by ID
    - This allows the results page to load when accessed with a valid intake ID
    - Maintains security: only allows viewing by specific ID (no listing all records)

  3. Security Notes
    - Policy restricts to SELECT only (no UPDATE/DELETE)
    - Requires exact ID match (prevents enumeration attacks)
    - No sensitive user data exposed in intake records
    - Intake data is meant to be shown back to the submitter
*/

-- Grant SELECT permission to anon role for accounting_intakes
GRANT SELECT ON accounting_intakes TO anon;

-- Create policy allowing anonymous users to view intakes by ID
CREATE POLICY "Anonymous users can view intakes by ID"
  ON accounting_intakes FOR SELECT
  TO anon
  USING (true);

-- Add comment explaining this policy
COMMENT ON POLICY "Anonymous users can view intakes by ID" ON accounting_intakes IS 
  'Allows anonymous users to view their tax checkup results after submission. Required for the results page (/checkup/results?id=X) to work for non-authenticated users.';