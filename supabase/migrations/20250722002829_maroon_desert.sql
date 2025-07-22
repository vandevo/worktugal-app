/*
  # Fix log_user_signup trigger

  The trigger was incorrectly configured to call the generic `http_request` function
  instead of our custom `public.log_user_signup()` function that includes email fetching logic.

  1. Changes
    - Drop the existing trigger
    - Recreate the trigger to call `public.log_user_signup()` function
    - This ensures the email is fetched from auth.users and included in the webhook payload

  2. Expected Outcome
    - When new users sign up, the trigger will now call our custom function
    - The webhook payload sent to Make.com will include the user's email address
    - Make.com will receive complete user data including email, display_name, role, etc.
*/

-- Drop the existing trigger that's calling the wrong function
DROP TRIGGER IF EXISTS log_user_signup ON public.user_profiles;

-- Recreate the trigger to call our custom function
CREATE TRIGGER log_user_signup
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.log_user_signup();