/*
  # Add function to get user by email for admin use

  1. New Functions
    - `get_user_by_email` - Returns user info by email (admin only)
  
  2. Security
    - Function uses SECURITY DEFINER to access auth.users
    - Only returns id and email (no sensitive data)
    - Requires caller to be admin
*/

CREATE OR REPLACE FUNCTION get_user_by_email(user_email text)
RETURNS TABLE(id uuid, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: admin only';
  END IF;

  RETURN QUERY
  SELECT au.id, au.email::text
  FROM auth.users au
  WHERE au.email = user_email;
END;
$$;
