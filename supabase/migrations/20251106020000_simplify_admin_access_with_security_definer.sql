/*
  # Simplify Admin Access with Security Definer Functions

  PROBLEM: RLS policies with EXISTS subqueries are slow and causing 403 errors
  SOLUTION: Create SECURITY DEFINER functions that bypass RLS for admin users

  This approach:
  1. Moves the admin check INTO a database function
  2. Uses SECURITY DEFINER to bypass RLS
  3. Still validates admin role before returning data
  4. Much faster and more reliable than complex RLS policies
*/

-- =====================================================
-- Helper Function: Check if user is admin
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_id
    AND role = 'admin'
  );
$$;

-- =====================================================
-- Admin Functions for Each Table
-- =====================================================

-- Accounting Intakes
CREATE OR REPLACE FUNCTION get_all_accounting_intakes()
RETURNS SETOF accounting_intakes
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT * FROM accounting_intakes
  ORDER BY created_at DESC;
END;
$$;

-- Contact Requests
CREATE OR REPLACE FUNCTION get_all_contact_requests()
RETURNS SETOF contact_requests
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT * FROM contact_requests
  ORDER BY created_at DESC;
END;
$$;

-- Appointments
CREATE OR REPLACE FUNCTION get_all_appointments()
RETURNS SETOF appointments
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT * FROM appointments
  ORDER BY created_at DESC;
END;
$$;

-- Applications (accountant_applications table)
CREATE OR REPLACE FUNCTION get_all_applications()
RETURNS SETOF accountant_applications
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT * FROM accountant_applications
  ORDER BY created_at DESC;
END;
$$;

-- Accountant Profiles
CREATE OR REPLACE FUNCTION get_all_accountant_profiles()
RETURNS SETOF accountant_profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT * FROM accountant_profiles
  ORDER BY created_at DESC;
END;
$$;

-- Payouts
CREATE OR REPLACE FUNCTION get_all_payouts()
RETURNS SETOF payouts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT * FROM payouts
  ORDER BY created_at DESC;
END;
$$;

-- =====================================================
-- Grant Execute Permissions
-- =====================================================

GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_accounting_intakes() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_contact_requests() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_appointments() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_applications() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_accountant_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_payouts() TO authenticated;

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON FUNCTION is_admin IS 'Check if a user has admin role - used by other security definer functions';
COMMENT ON FUNCTION get_all_accounting_intakes IS 'Admin-only: Fetch all accounting intakes bypassing RLS';
COMMENT ON FUNCTION get_all_contact_requests IS 'Admin-only: Fetch all contact requests bypassing RLS';
COMMENT ON FUNCTION get_all_appointments IS 'Admin-only: Fetch all appointments bypassing RLS';
COMMENT ON FUNCTION get_all_applications IS 'Admin-only: Fetch all accountant applications bypassing RLS';
COMMENT ON FUNCTION get_all_accountant_profiles IS 'Admin-only: Fetch all accountant profiles bypassing RLS';
COMMENT ON FUNCTION get_all_payouts IS 'Admin-only: Fetch all payouts bypassing RLS';
