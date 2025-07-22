/*
  # Temporarily disable log_user_signup trigger

  This migration temporarily disables the log_user_signup trigger to allow user signups to work normally while we debug the issue.
  
  1. Changes Made
    - Drop the log_user_signup trigger from user_profiles table
    - Keep the log_user_signup function for later use
  
  2. Impact
    - User signups will work normally again
    - Webhook calls to Make.com will temporarily stop until we fix and re-enable the trigger
*/

-- Temporarily disable the trigger to allow user signups
DROP TRIGGER IF EXISTS log_user_signup ON user_profiles;