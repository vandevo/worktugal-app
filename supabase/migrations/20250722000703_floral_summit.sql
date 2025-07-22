/*
  # Update log_user_signup function to include user email

  ## Summary
  This migration modifies the existing `log_user_signup` function to fetch and include the user's email address from the `auth.users` table when sending webhook data to Make.com for Airtable integration.

  ## Changes Made
  1. **Enhanced Function Logic**: Modified `log_user_signup()` function to query `auth.users` table for email
  2. **Improved Payload**: Added email field to the JSON payload sent to Make.com webhook
  3. **Data Integration**: Combines user profile data with authentication data for complete user information

  ## Impact
  - Webhook payloads will now include user email addresses
  - Make.com scenarios can access email data for Airtable integration
  - No breaking changes to existing functionality
  - Email data retrieved securely from auth.users table

  ## Notes
  - Function maintains SECURITY DEFINER to access auth.users table
  - Existing trigger on user_profiles table remains unchanged
  - Webhook URL preserved from existing configuration
*/

CREATE OR REPLACE FUNCTION public.log_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_email text;
    payload jsonb;
BEGIN
    -- Fetch the user's email from auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;

    -- Construct the payload with user_profiles data and email
    payload := jsonb_build_object(
        'id', NEW.id,
        'display_name', NEW.display_name,
        'email', user_email,
        'role', NEW.role,
        'created_at', NEW.created_at,
        'updated_at', NEW.updated_at
    );

    -- Send the payload to your Make.com webhook
    PERFORM supabase_functions.http_request(
        'https://hook.eu2.make.com/5coq5hxo3b9vefj5ich2ffsgs3qeh9si',
        'POST',
        '{"Content-Type":"application/json"}',
        payload::text,
        '5000'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;