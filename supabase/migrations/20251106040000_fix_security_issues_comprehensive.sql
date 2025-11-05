/*
  # Comprehensive Security Fixes

  1. Add Missing Foreign Key Indexes
    - Add indexes for all foreign keys without covering indexes
    - Improves query performance for JOIN operations
    - Essential for scaling as data grows

  2. Fix RLS Performance Issues
    - Replace auth.<function>() with (select auth.<function>())
    - Prevents re-evaluation for each row
    - Significantly improves query performance at scale

  3. Remove Unused Indexes
    - Drop indexes that are not being used
    - Reduces database overhead and write performance penalty
    - Can be recreated if usage patterns change

  4. Fix Function Search Path Issues
    - Set explicit search_path for all security definer functions
    - Prevents potential security vulnerabilities
    - Ensures predictable schema resolution

  5. Notes on Multiple Permissive Policies
    - Multiple permissive policies are intentional (different roles need different access)
    - This is a valid RLS pattern for role-based access control
    - No action needed - this is by design

  6. Manual Actions Required (cannot be automated)
    - Leaked password protection: Enable in Supabase Dashboard → Authentication → Settings
    - Postgres version upgrade: Contact Supabase support for database upgrade
*/

-- =====================================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- =====================================================

-- accounting_intakes
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_claimed_by
  ON accounting_intakes(claimed_by);

-- appointments
CREATE INDEX IF NOT EXISTS idx_appointments_accountant_id
  ON appointments(accountant_id);

CREATE INDEX IF NOT EXISTS idx_appointments_booking_id
  ON appointments(booking_id);

CREATE INDEX IF NOT EXISTS idx_appointments_consult_booking_id
  ON appointments(consult_booking_id);

-- disputes
CREATE INDEX IF NOT EXISTS idx_disputes_accountant_id
  ON disputes(accountant_id);

CREATE INDEX IF NOT EXISTS idx_disputes_appointment_id
  ON disputes(appointment_id);

-- documentation
CREATE INDEX IF NOT EXISTS idx_documentation_created_by
  ON documentation(created_by);

-- partner_submissions
CREATE INDEX IF NOT EXISTS idx_partner_submissions_stripe_order_id
  ON partner_submissions(stripe_order_id);

-- payouts
CREATE INDEX IF NOT EXISTS idx_payouts_accountant_id
  ON payouts(accountant_id);

CREATE INDEX IF NOT EXISTS idx_payouts_appointment_id
  ON payouts(appointment_id);

-- =====================================================
-- PART 2: FIX RLS PERFORMANCE ISSUES
-- =====================================================

-- Fix accounting_intakes policy
DROP POLICY IF EXISTS "Users can view own intakes by user_id" ON accounting_intakes;

CREATE POLICY "Users can view own intakes by user_id"
  ON accounting_intakes FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix contact_requests policies
DROP POLICY IF EXISTS "Admins can delete contact requests" ON contact_requests;

CREATE POLICY "Admins can delete contact requests"
  ON contact_requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (select auth.uid())
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
      WHERE user_profiles.id = (select auth.uid())
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = (select auth.uid())
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- PART 3: REMOVE UNUSED INDEXES
-- =====================================================

-- accounting_intakes unused indexes
DROP INDEX IF EXISTS idx_accounting_intakes_source_type;
DROP INDEX IF EXISTS idx_accounting_intakes_compliance_red;
DROP INDEX IF EXISTS idx_accounting_intakes_lead_quality;
DROP INDEX IF EXISTS idx_accounting_intakes_user_id;
DROP INDEX IF EXISTS idx_accounting_intakes_email_hash;
DROP INDEX IF EXISTS idx_accounting_intakes_latest;
DROP INDEX IF EXISTS idx_accounting_intakes_submission_sequence;
DROP INDEX IF EXISTS idx_accounting_intakes_previous_submission;
DROP INDEX IF EXISTS idx_accounting_intakes_first_submission;

-- contact_requests unused indexes
DROP INDEX IF EXISTS idx_contact_purpose;
DROP INDEX IF EXISTS idx_contact_status;
DROP INDEX IF EXISTS idx_contact_priority;
DROP INDEX IF EXISTS idx_contact_email;

-- =====================================================
-- PART 4: FIX FUNCTION SEARCH PATH ISSUES
-- =====================================================

-- Fix generate_email_hash function
DROP FUNCTION IF EXISTS generate_email_hash(text) CASCADE;

CREATE OR REPLACE FUNCTION generate_email_hash(email_input text)
RETURNS text
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(digest(lower(trim(email_input)), 'sha256'), 'hex');
END;
$$;

-- Fix is_admin function
DROP FUNCTION IF EXISTS is_admin() CASCADE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- Fix get_all_accounting_intakes function
DROP FUNCTION IF EXISTS get_all_accounting_intakes() CASCADE;

CREATE OR REPLACE FUNCTION get_all_accounting_intakes()
RETURNS SETOF accounting_intakes
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY SELECT * FROM accounting_intakes ORDER BY created_at DESC;
END;
$$;

-- Fix get_all_contact_requests function
DROP FUNCTION IF EXISTS get_all_contact_requests() CASCADE;

CREATE OR REPLACE FUNCTION get_all_contact_requests()
RETURNS SETOF contact_requests
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY SELECT * FROM contact_requests ORDER BY created_at DESC;
END;
$$;

-- Fix get_all_appointments function
DROP FUNCTION IF EXISTS get_all_appointments() CASCADE;

CREATE OR REPLACE FUNCTION get_all_appointments()
RETURNS SETOF appointments
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY SELECT * FROM appointments ORDER BY created_at DESC;
END;
$$;

-- Fix get_all_applications function
DROP FUNCTION IF EXISTS get_all_applications() CASCADE;

CREATE OR REPLACE FUNCTION get_all_applications()
RETURNS SETOF accountant_profiles
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY SELECT * FROM accountant_profiles ORDER BY created_at DESC;
END;
$$;

-- Fix get_all_accountant_profiles function
DROP FUNCTION IF EXISTS get_all_accountant_profiles() CASCADE;

CREATE OR REPLACE FUNCTION get_all_accountant_profiles()
RETURNS SETOF accountant_profiles
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY SELECT * FROM accountant_profiles ORDER BY created_at DESC;
END;
$$;

-- Fix get_all_payouts function
DROP FUNCTION IF EXISTS get_all_payouts() CASCADE;

CREATE OR REPLACE FUNCTION get_all_payouts()
RETURNS SETOF payouts
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY SELECT * FROM payouts ORDER BY created_at DESC;
END;
$$;

-- =====================================================
-- PART 5: ADD HELPFUL COMMENTS
-- =====================================================

COMMENT ON TABLE accountant_profiles IS
  'Multiple permissive policies are intentional for role-based access control.
   Different roles (users, accountants, admins) need different levels of access.
   This is a valid and recommended RLS pattern.';

COMMENT ON TABLE accounting_intakes IS
  'Multiple permissive policies are intentional for role-based access control.
   Accountants see claimed intakes, users see their own, admins see all.';

COMMENT ON TABLE appointments IS
  'Multiple permissive policies are intentional for role-based access control.
   Clients, accountants, and admins each have different access needs.';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '=== Security Fixes Applied ===';
  RAISE NOTICE '✓ Added 10 foreign key indexes';
  RAISE NOTICE '✓ Fixed 3 RLS performance issues';
  RAISE NOTICE '✓ Removed 13 unused indexes';
  RAISE NOTICE '✓ Fixed 8 function search paths';
  RAISE NOTICE '';
  RAISE NOTICE 'Manual actions required:';
  RAISE NOTICE '1. Enable leaked password protection in Supabase Dashboard';
  RAISE NOTICE '   → Authentication → Settings → Enable password breach detection';
  RAISE NOTICE '2. Request Postgres upgrade from Supabase support';
  RAISE NOTICE '   → Dashboard → Settings → Contact support for latest security patches';
END $$;
