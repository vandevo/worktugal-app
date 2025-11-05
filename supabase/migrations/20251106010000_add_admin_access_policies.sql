/*
  # Add Admin Access Policies to All Tables

  1. Problem
    - Admin users getting 403 Forbidden errors when accessing admin dashboard sections
    - Admin users cannot SELECT from tables: accounting_intakes, contact_requests, appointments, applications, accountant_profiles
    - Navigation redirects back to /dashboard due to failed database queries

  2. Solution
    - Add RLS policies for admin role to SELECT all records from admin-managed tables
    - Allow admins full access to manage platform data

  3. Security
    - Only users with role='admin' in user_profiles can access
    - Uses authenticated role (not service_role bypass)
    - Maintains proper audit trail and row-level security

  4. Tables Updated
    - accounting_intakes (for tax checkup leads and intake management)
    - contact_requests (for contact form management)
    - appointments (for consultation management)
    - applications (for accountant application review)
    - accountant_profiles (for accountant management)
*/

-- =====================================================
-- ACCOUNTING INTAKES - Admin Access
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all intakes" ON accounting_intakes;

CREATE POLICY "Admins can view all intakes"
  ON accounting_intakes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- CONTACT REQUESTS - Admin Access
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all contact requests" ON contact_requests;

CREATE POLICY "Admins can view all contact requests"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update contact requests" ON contact_requests;

CREATE POLICY "Admins can update contact requests"
  ON contact_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- APPOINTMENTS - Admin Access
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all appointments" ON appointments;

CREATE POLICY "Admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update appointments" ON appointments;

CREATE POLICY "Admins can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- APPLICATIONS - Admin Access
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all applications" ON applications;

CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update applications" ON applications;

CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- ACCOUNTANT PROFILES - Admin Access
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all accountant profiles" ON accountant_profiles;

CREATE POLICY "Admins can view all accountant profiles"
  ON accountant_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update accountant profiles" ON accountant_profiles;

CREATE POLICY "Admins can update accountant profiles"
  ON accountant_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- PAYOUTS - Admin Access
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all payouts" ON payouts;

CREATE POLICY "Admins can view all payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update payouts" ON payouts;

CREATE POLICY "Admins can update payouts"
  ON payouts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (SELECT auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- Add Helpful Comments
-- =====================================================

COMMENT ON POLICY "Admins can view all intakes" ON accounting_intakes IS 'Allows admin users to view all accounting intake records for management purposes';
COMMENT ON POLICY "Admins can view all contact requests" ON contact_requests IS 'Allows admin users to view all contact requests for management purposes';
COMMENT ON POLICY "Admins can update contact requests" ON contact_requests IS 'Allows admin users to update contact request status and notes';
COMMENT ON POLICY "Admins can view all appointments" ON appointments IS 'Allows admin users to view all appointments for management purposes';
COMMENT ON POLICY "Admins can update appointments" ON appointments IS 'Allows admin users to manage appointments and assign accountants';
COMMENT ON POLICY "Admins can view all applications" ON applications IS 'Allows admin users to view all accountant applications for review';
COMMENT ON POLICY "Admins can update applications" ON applications IS 'Allows admin users to approve or reject accountant applications';
COMMENT ON POLICY "Admins can view all accountant profiles" ON accountant_profiles IS 'Allows admin users to view all accountant profiles';
COMMENT ON POLICY "Admins can update accountant profiles" ON accountant_profiles IS 'Allows admin users to manage accountant profiles';
COMMENT ON POLICY "Admins can view all payouts" ON payouts IS 'Allows admin users to view all payouts for financial management';
COMMENT ON POLICY "Admins can update payouts" ON payouts IS 'Allows admin users to process and manage payouts';
