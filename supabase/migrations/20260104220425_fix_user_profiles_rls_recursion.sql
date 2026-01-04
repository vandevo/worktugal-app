/*
  # Fix RLS recursion on user_profiles

  1. Problem
    - "Users can view own profile and admins can view all" policy has self-referencing subquery
    - This causes infinite recursion when checking admin status
  
  2. Solution
    - Update policy to use is_admin() function (SECURITY DEFINER)
    - Keep simple user self-access check
*/

DROP POLICY IF EXISTS "Users can view own profile and admins can view all" ON user_profiles;

CREATE POLICY "Users can view own profile and admins can view all"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_admin());
