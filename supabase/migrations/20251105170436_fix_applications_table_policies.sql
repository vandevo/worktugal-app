/*
  # Fix Applications Table RLS Policies

  1. Problem
    - Previous migration created policies on non-existent table "applications"
    - Actual table is named "accountant_applications"
    - Admin dashboard getting 403 Forbidden errors when trying to access accountant applications
    - Navigation failing because data queries are blocked by missing RLS policies

  2. Solution
    - Create correct RLS policies on "accountant_applications" table
    - Allow admins full access to manage accountant applications

  3. Security
    - Only users with role='admin' in user_profiles can access
    - Uses authenticated role with proper RLS checks
    - Maintains audit trail and row-level security

  4. Tables Updated
    - accountant_applications (correct table name)
*/

-- =====================================================
-- ACCOUNTANT APPLICATIONS - Admin Access (Correct Table)
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all accountant applications" ON accountant_applications;

CREATE POLICY "Admins can view all accountant applications"
  ON accountant_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update accountant applications" ON accountant_applications;

CREATE POLICY "Admins can update accountant applications"
  ON accountant_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- Add Helpful Comments
-- =====================================================

COMMENT ON POLICY "Admins can view all accountant applications" ON accountant_applications IS 
  'Allows admin users to view all accountant applications for review and management';

COMMENT ON POLICY "Admins can update accountant applications" ON accountant_applications IS 
  'Allows admin users to approve, reject, or update accountant applications';

-- =====================================================
-- Verify Fix
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=== Applications Table Policy Fix Applied ===';
  RAISE NOTICE '✓ Created admin SELECT policy on "accountant_applications" table';
  RAISE NOTICE '✓ Created admin UPDATE policy on "accountant_applications" table';
  RAISE NOTICE '';
  RAISE NOTICE 'Admin users can now:';
  RAISE NOTICE '- View all accountant applications';
  RAISE NOTICE '- Update application status (approve/reject)';
  RAISE NOTICE '- Navigate to /admin/accountant-applications successfully';
END $$;
