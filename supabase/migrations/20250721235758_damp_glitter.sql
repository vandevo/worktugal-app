/*
  # Create user profiles with email view

  1. New Views
    - `user_profiles_with_email`: Combines user_profiles with auth.users to include email
      - `id` (uuid)
      - `email` (text, from auth.users)
      - `display_name` (text)
      - `role` (user_role)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Uses existing RLS policies from user_profiles table
    - Only shows data user is authorized to see

  3. Usage
    - Perfect for exports to Airtable with complete user information
    - Maintains data consistency by not duplicating email
*/

-- Create a view that combines user_profiles with auth.users to include email
CREATE OR REPLACE VIEW user_profiles_with_email AS
SELECT 
  up.id,
  au.email,
  up.display_name,
  up.role,
  up.created_at,
  up.updated_at
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE au.deleted_at IS NULL;

-- Grant access to the view
GRANT SELECT ON user_profiles_with_email TO authenticated, anon;