/*
  # Add Accountant Role to User Profiles

  1. Changes
    - Extends user_profiles.role enum to include 'accountant' role
    - This allows accountants to have their own role distinction from regular users, partners, and admins

  2. Notes
    - Accountants with accountant_profiles record can have role = 'accountant'
    - This enables role-based access control in the application
    - Accountants can access /accountant/dashboard
    - Admins can manage all accountants through /admin
*/

-- Check if role column uses a custom type or constraint
DO $$
BEGIN
  -- Try to add 'accountant' to the role check constraint if it exists
  -- First, check if there's a CHECK constraint on the role column
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    -- Drop the old constraint
    ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
    
    -- Add new constraint with accountant role
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check 
      CHECK (role IN ('user', 'partner', 'admin', 'accountant'));
  END IF;
END $$;

-- Add comment explaining the accountant role
COMMENT ON COLUMN user_profiles.role IS 'User role: user (default), partner (business listing), accountant (tax consultant), admin (platform administrator)';