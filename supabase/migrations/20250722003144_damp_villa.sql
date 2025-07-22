/*
  # Re-enable log_user_signup trigger with safer function

  This migration re-enables the log_user_signup trigger using the safer function that won't break user signups.
  
  1. Changes Made
    - Create trigger that calls the safer log_user_signup function
    - Trigger fires AFTER INSERT on user_profiles table
  
  2. Safety Features
    - Function has comprehensive error handling
    - User signups will work even if webhook fails
    - Detailed logging for debugging
*/

-- Re-enable the trigger with the safer function
CREATE TRIGGER log_user_signup
    AFTER INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.log_user_signup();