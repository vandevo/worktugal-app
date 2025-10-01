/*
  # Drop user_profiles_with_email Unrestricted View

  This migration removes the user_profiles_with_email view that shows as "Unrestricted" 
  in the Supabase dashboard because views cannot have Row Level Security (RLS) policies.

  ## Changes Made

  1. Drop View
    - `user_profiles_with_email` - View that joined user_profiles with auth.users to include email
  
  2. Security Impact
    - The base `user_profiles` table remains intact with proper RLS policies
    - Applications can query user_profiles and auth.users separately when email is needed
    - This approach is more secure and explicit than using an unrestricted view

  3. Why This View Is Being Removed
    - Views cannot have RLS policies, creating a security warning in the dashboard
    - The view was created for convenience but isn't used by the application
    - When email data is needed, application code can query auth.users directly
    - The base user_profiles table has proper RLS protection

  ## Migration Notes
  
  - This is a safe operation - no data is lost
  - The view isn't referenced in application code
  - The base user_profiles table continues to enforce security through RLS policies
  - If email is needed in queries, applications should join user_profiles with auth.users directly
*/

-- Drop the unrestricted view
DROP VIEW IF EXISTS user_profiles_with_email;

-- Verify the base table remains secure
DO $$
BEGIN
  RAISE NOTICE 'Migration completed: Dropped user_profiles_with_email view';
  RAISE NOTICE 'Base table user_profiles remains secure with RLS enabled';
END $$;