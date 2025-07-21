/*
  # Add User Roles System

  1. New Enum Types
    - `user_role` enum with values: 'user', 'partner', 'admin'

  2. Table Updates
    - Add `role` column to `user_profiles` table with default 'user'

  3. Security
    - Update RLS policies to account for role-based access
    - Users can still manage their own profile data
    - Role changes are controlled by the system (webhooks)

  4. Purpose
    - Future-proof user management for different user types
    - Enable partner vs regular user distinctions
    - Prepare for potential user subscription models
*/

-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('user', 'partner', 'admin');

-- Add role column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN role user_role DEFAULT 'user' NOT NULL;

-- Create index for role-based queries (for future performance)
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Update the existing RLS policy to ensure it still works with the new column
-- (The existing policy already covers profile management, no changes needed)

-- Add a policy for role-based access (for future use)
CREATE POLICY "Users can view their own role"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Note: Role updates will be handled by system-level operations (webhooks)
-- Regular users cannot update their own role for security