/*
  # Disable ALL Old Signup Triggers (Comprehensive Cleanup)

  1. Purpose
    - Ensure no duplicate webhook calls from old trigger system
    - Clean up all legacy signup notification triggers
    - Leave only the new Edge Function approach active

  2. Changes
    - Drop ALL triggers on auth.users related to signup webhooks
    - Drop triggers on user_profiles related to signup webhooks
    - Keep table structures intact (only remove triggers)

  3. Safety
    - Does not affect user creation or authentication
    - Only disables webhook notifications from database layer
    - New system (auth.ts → Edge Function) remains active
*/

-- Drop all known signup webhook triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS log_user_signup ON public.user_profiles;
DROP TRIGGER IF EXISTS make_worktugal_pass ON public.user_profiles;

-- Log what was disabled
DO $$
BEGIN
  RAISE NOTICE '=== Disabled Old Signup Triggers ===';
  RAISE NOTICE 'Dropped: on_auth_user_created (auth.users)';
  RAISE NOTICE 'Dropped: log_user_signup (user_profiles)';
  RAISE NOTICE 'Dropped: make_worktugal_pass (user_profiles)';
  RAISE NOTICE '';
  RAISE NOTICE 'New system active:';
  RAISE NOTICE '  auth.ts → notify-signup Edge Function → Make.com';
  RAISE NOTICE '';
  RAISE NOTICE 'Webhook URL: https://hook.eu2.make.com/pueq1sw659ym23cr3fwe7huvhxk4nx9v';
END $$;
