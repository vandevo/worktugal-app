/*
  # Fix get_all_applications Function Return Type

  1. Problem
    - The `get_all_applications()` function currently returns `accountant_profiles` table
    - It should return `accountant_applications` table (where applications are stored)
    - This causes type mismatch errors and 403 issues on the admin dashboard

  2. Solution
    - Drop and recreate the function with correct return type
    - Ensure it returns data from `accountant_applications` table
    - Maintain all security checks (admin role verification)
    - Keep SECURITY DEFINER to bypass RLS

  3. Security
    - Function still checks if user has admin role
    - Uses SECURITY DEFINER to bypass RLS policies
    - Only accessible to authenticated users with admin role
*/

-- Drop the existing buggy function
DROP FUNCTION IF EXISTS get_all_applications() CASCADE;

-- Recreate with correct return type
CREATE OR REPLACE FUNCTION get_all_applications()
RETURNS SETOF accountant_applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  -- Return applications, not profiles
  RETURN QUERY 
  SELECT * FROM accountant_applications 
  ORDER BY created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_applications() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_all_applications IS 'Admin-only: Fetch all accountant applications (not profiles) bypassing RLS';
