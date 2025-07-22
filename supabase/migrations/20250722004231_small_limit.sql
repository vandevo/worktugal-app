/*
  # Update log_user_signup function with new Make.com webhook URL

  1. Changes
    - Updates the webhook_url in the log_user_signup function to the new Make.com URL
    - Maintains all existing functionality and error handling
    - Function will now send user signup data to the correct Make.com webhook

  2. Function Details
    - Fetches user email from auth.users table
    - Constructs payload with user data including email
    - Sends HTTP POST request to Make.com webhook
    - Includes proper error handling and logging
*/

CREATE OR REPLACE FUNCTION public.log_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    user_email TEXT;
    webhook_url TEXT := 'https://hook.eu2.make.com/sqs2ugnwh7f7mw7ljqihgkojpjgk4a8w'; -- Updated Make.com webhook URL
    payload JSONB;
    response_status_code INT;
    response_body TEXT;
BEGIN
    -- Fetch the user's email from auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;

    -- Construct the payload
    payload := jsonb_build_object(
        'user_id', NEW.id,
        'display_name', NEW.display_name,
        'role', NEW.role,
        'created_at', NEW.created_at,
        'email', user_email -- Include the fetched email
    );

    -- Log the payload being sent (for debugging)
    RAISE NOTICE 'log_user_signup: Sending payload to Make.com: %', payload;

    -- Send the HTTP request to Make.com
    SELECT status, content INTO response_status_code, response_body
    FROM supabase_functions.http_request(
        webhook_url,
        'POST',
        '{"Content-Type": "application/json"}',
        payload::text,
        3000 -- Timeout in milliseconds (3 seconds)
    );

    -- Log the response from Make.com (for debugging)
    RAISE NOTICE 'log_user_signup: Make.com response status: %, body: %', response_status_code, response_body;

    -- If the webhook call fails, log an error but don't prevent the user signup
    IF response_status_code IS NULL OR response_status_code >= 400 THEN
        RAISE WARNING 'log_user_signup: Failed to send user signup data to Make.com. Status: %, Body: %', response_status_code, response_body;
    ELSE
        RAISE NOTICE 'log_user_signup: Successfully sent user signup data to Make.com';
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log any unexpected errors but don't prevent user profile creation
        RAISE WARNING 'log_user_signup: Unexpected error occurred: %', SQLERRM;
        RETURN NEW;
END;
$function$;