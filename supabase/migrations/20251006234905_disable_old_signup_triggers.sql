/*
  # Disable Old Signup Triggers

  1. Purpose
    - Replace legacy database trigger approach with modern Edge Function pattern
    - The old trigger called Make.com directly from database (fragile, hard to debug)
    - New approach: auth.ts → notify-signup Edge Function → Make.com (clean, testable)

  2. Changes
    - Drop trigger: on_auth_user_created (from auth.users table)
    - Keep function: handle_new_user() (for reference, but unused)
    - Keep trigger: log_user_signup (on user_profiles, separate concern)

  3. Why This is Safe
    - New Edge Function already handles signup notifications via auth.ts
    - Dropping trigger doesn't affect user creation (only webhook notification)
    - Can be re-enabled by running CREATE TRIGGER again if needed

  4. Rollback Plan
    If you need to restore the old trigger:

    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  5. Migration Path
    Old: auth.users INSERT → Database Trigger → Make.com
    New: auth.users INSERT → auth.ts calls Edge Function → Make.com
*/

-- Drop the old trigger on auth.users
-- This prevents duplicate webhook calls (old + new system)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Log the change
DO $$
BEGIN
  RAISE NOTICE 'Disabled old signup trigger: on_auth_user_created';
  RAISE NOTICE 'Signup notifications now handled by notify-signup Edge Function';
  RAISE NOTICE 'Called from: src/lib/auth.ts → signUp() function';
END $$;

-- Comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS
  'LEGACY: Previously used by on_auth_user_created trigger.
   Now replaced by notify-signup Edge Function called from frontend.
   Kept for reference but no longer active.';
