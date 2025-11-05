/*
  # Fix User Signup Trigger - Correct Column Names

  1. Problem
    - The handle_new_user() function tries to insert into (user_id, email, role)
    - But user_profiles table has (id, display_name, role, created_at, updated_at)
    - Column mismatch causes "Database error saving new user"

  2. Solution
    - Update handle_new_user() to use correct column names
    - Use 'id' instead of 'user_id'
    - Remove 'email' column (not in table schema)
    - Keep 'role' column with proper type casting

  3. Changes
    - Drop and recreate handle_new_user() function with correct schema
    - Drop and recreate on_auth_user_created trigger
    - Use ON CONFLICT (id) instead of (user_id)

  4. Impact
    - User signup will work correctly
    - User profiles will be auto-created on registration
    - No data loss (only fixing column names)
*/

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Recreate function with correct column names
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into user_profiles with correct column names
  -- Table has: id (uuid), display_name (text), role (user_role), created_at, updated_at
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, 'user'::user_role)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Add helpful comment
COMMENT ON FUNCTION handle_new_user() IS
  'Automatically creates a user_profiles record when a new user signs up.
   Uses id (not user_id) to match the actual table schema.
   Sets default role to user.';