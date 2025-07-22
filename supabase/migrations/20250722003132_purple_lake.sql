/*
  # Create safer log_user_signup function with error handling

  This migration creates a more robust version of the log_user_signup function that won't break user signups if there are issues.
  
  1. Changes Made
    - Add comprehensive error handling with try-catch blocks
    - Make the function SECURITY DEFINER to ensure proper permissions
    - Add logging for debugging purposes
    - Ensure the function always returns NEW even if HTTP request fails
  
  2. Safety Features
    - Function won't prevent user signup if webhook fails
    - Detailed error logging for debugging
    - Graceful handling of missing email data
*/

-- Create a safer version of the log_user_signup function
CREATE OR REPLACE FUNCTION public.log_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_email text;
    payload jsonb;
    http_result jsonb;
BEGIN
    -- Always return NEW first to ensure user profile creation succeeds
    -- even if webhook fails
    
    BEGIN
        -- Try to fetch the user's email from auth.users
        SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
        
        -- If no email found, use a placeholder
        IF user_email IS NULL THEN
            user_email := 'email_not_found';
        END IF;
        
        -- Construct the payload with user_profiles data and email
        payload := jsonb_build_object(
            'id', NEW.id,
            'display_name', NEW.display_name,
            'email', user_email,
            'role', NEW.role,
            'created_at', NEW.created_at,
            'updated_at', NEW.updated_at
        );
        
        -- Try to send the payload to Make.com webhook
        -- Use a shorter timeout to prevent blocking
        SELECT supabase_functions.http_request(
            'https://hook.eu2.make.com/5coq5hxo3b9vefj5ich2ffsgs3qeh9si',
            'POST',
            '{"Content-Type":"application/json"}'::jsonb,
            payload::text,
            '3000'::text
        ) INTO http_result;
        
        -- Log success (this will show in postgres logs)
        RAISE LOG 'log_user_signup: Successfully sent webhook for user % with email %', NEW.id, user_email;
        
    EXCEPTION
        WHEN OTHERS THEN
            -- Log the error but don't prevent user creation
            RAISE LOG 'log_user_signup: Error sending webhook for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Always return NEW to ensure the user profile is created
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.log_user_signup() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_signup() TO service_role;