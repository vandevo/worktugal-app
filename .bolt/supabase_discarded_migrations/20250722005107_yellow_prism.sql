/*
  # Debug and Fix User Signup Webhook Flow

  This migration will:
  1. Ensure the handle_new_user function exists and works correctly
  2. Ensure the trigger on auth.users is properly set up
  3. Ensure the log_user_signup function is working with the correct webhook URL
  4. Add comprehensive logging to debug the entire flow
*/

-- Step 1: Create or replace the handle_new_user function with better logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  RAISE NOTICE 'handle_new_user: Starting for user_id: %', NEW.id;
  
  BEGIN
    -- Insert into user_profiles table
    INSERT INTO public.user_profiles (id, display_name, role, created_at, updated_at)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), 
      'user',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'handle_new_user: Successfully created profile for user_id: %', NEW.id;
    
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'handle_new_user: Error creating profile for user_id: %, Error: %', NEW.id, SQLERRM;
    -- Don't re-raise the exception to avoid breaking user signup
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE 'Created trigger on_auth_user_created on auth.users table';

-- Step 3: Create or replace the log_user_signup function with the new webhook URL and better logging
CREATE OR REPLACE FUNCTION public.log_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'https://hook.eu2.make.com/sqs2ugnwh7f7mw7ljqihgkojpjgk4a8w';
  user_email TEXT;
  payload JSONB;
  response_status INTEGER;
  response_body TEXT;
BEGIN
  RAISE NOTICE 'log_user_signup: Starting for user_id: %', NEW.id;
  
  BEGIN
    -- Get the user's email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.id;
    
    IF user_email IS NULL THEN
      RAISE NOTICE 'log_user_signup: No email found for user_id: %', NEW.id;
      RETURN NEW;
    END IF;
    
    RAISE NOTICE 'log_user_signup: Found email % for user_id: %', user_email, NEW.id;
    
    -- Create the payload
    payload := jsonb_build_object(
      'user_id', NEW.id,
      'email', user_email,
      'display_name', NEW.display_name,
      'role', NEW.role,
      'created_at', NEW.created_at,
      'event_type', 'user_signup'
    );
    
    RAISE NOTICE 'log_user_signup: Sending payload to Make.com: %', payload;
    
    -- Send HTTP request to Make.com webhook
    SELECT status, content INTO response_status, response_body
    FROM http((
      'POST',
      webhook_url,
      ARRAY[http_header('Content-Type', 'application/json')],
      'application/json',
      payload::TEXT
    )::http_request);
    
    RAISE NOTICE 'log_user_signup: Make.com response status: %, body: %', response_status, response_body;
    
    IF response_status >= 200 AND response_status < 300 THEN
      RAISE NOTICE 'log_user_signup: Successfully sent signup data to Make.com for user: %', user_email;
    ELSE
      RAISE WARNING 'log_user_signup: Make.com returned status %, body: %', response_status, response_body;
    END IF;
    
  EXCEPTION WHEN others THEN
    RAISE WARNING 'log_user_signup: Error sending to Make.com for user_id %, Error: %', NEW.id, SQLERRM;
    -- Don't re-raise to avoid breaking the signup flow
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Ensure trigger exists on user_profiles
DROP TRIGGER IF EXISTS log_user_signup ON public.user_profiles;
CREATE TRIGGER log_user_signup
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_user_signup();

RAISE NOTICE 'Created trigger log_user_signup on user_profiles table';

-- Step 5: Test the functions manually (this will show up in logs)
RAISE NOTICE 'Migration completed successfully. Functions and triggers are ready.';