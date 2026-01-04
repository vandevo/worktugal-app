/*
  # Fix RLS recursion on paid_compliance_reviews

  1. Problem
    - Admin policies use inline subquery to user_profiles
    - user_profiles also has RLS, causing recursion issues
  
  2. Solution
    - Update policies to use is_admin() function (SECURITY DEFINER)
    - This bypasses RLS when checking admin status
*/

DROP POLICY IF EXISTS "Admins can read all reviews" ON paid_compliance_reviews;
DROP POLICY IF EXISTS "Admins can update all reviews" ON paid_compliance_reviews;

CREATE POLICY "Admins can read all reviews"
  ON paid_compliance_reviews
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all reviews"
  ON paid_compliance_reviews
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
