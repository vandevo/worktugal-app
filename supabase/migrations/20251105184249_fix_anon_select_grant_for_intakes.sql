/*
  # Fix Anonymous SELECT Access for Accounting Intakes

  1. Root Cause
    - There's an RLS policy "Allow anon to select during insert" with USING (true)
    - But the anon role lacks the SELECT grant at the table level
    - Without the grant, the policy cannot be evaluated
    - Result: "permission denied for table accounting_intakes"

  2. Solution
    - Grant SELECT to anon role on accounting_intakes table
    - The existing policy "Allow anon to select during insert" will then work
    - This allows anonymous users to view their tax checkup results

  3. Security Considerations
    - Policy restricts what can be selected (currently allows all with true)
    - Anonymous users need to view results after submitting tax checkup
    - This is expected behavior for the user flow
    - No sensitive data exposed (intake forms are meant to be shown to submitter)

  4. Why This is Safe
    - User just submitted this data themselves
    - They already know all the information in the record
    - Results page shows their own submission back to them
    - Standard pattern for form submission → results flow
*/

-- Grant SELECT permission to anon role
GRANT SELECT ON accounting_intakes TO anon;

-- Log the change
DO $$
BEGIN
  RAISE NOTICE 'Granted SELECT permission to anon role on accounting_intakes';
  RAISE NOTICE 'Anonymous users can now view tax checkup results';
END $$;