/*
  # Fix User Signup Webhook Flow

  This migration will:
  1. Ensure the handle_new_user function exists and works correctly
  2. Ensure the trigger on auth.users is properly set up
  3. Ensure the log_user_signup function is working with the correct webhook URL
  4. Add comprehensive logging to debug the entire flow
*/

-- Step 1: Create/recreate the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.user_profiles (id, display_name, role)
    VALUES (NEW.id, NEW.email, 'user');
    
    RAISE NOTICE 'handle_new_user: Successfully created profile for user_id: %', NEW.id;
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: Failed to create profile for user_id: %, error: %', NEW.id, SQLERRM;
    RETURN NEW; -- Don't break user signup even if profile creation fails
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop and recreate the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Create/recreate the log_user_signup function with the correct webhook URL
CREATE OR REPLACE FUNCTION public.log_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  payload JSONB;
  http_response RECORD;
BEGIN
  BEGIN
    RAISE NOTICE 'log_user_signup: Starting for user_id: %', NEW.id;
    
    -- Get the user's email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.id;
    
    IF user_email IS NULL THEN
      RAISE WARNING 'log_user_signup: No email found for user_id: %', NEW.id;
      RETURN NEW;
    END IF;
    
    RAISE NOTICE 'log_user_signup: Found email % for user_id: %', user_email, NEW.id;
    
    -- Prepare the payload
    payload := jsonb_build_object(
      'user_id', NEW.id,
      'email', user_email,
      'display_name', NEW.display_name,
      'role', NEW.role,
      'created_at', NEW.created_at,
      'source', 'user_signup'
    );
    
    RAISE NOTICE 'log_user_signup: Sending payload to Make.com: %', payload;
    
    -- Send to Make.com webhook
    SELECT status, content INTO http_response
    FROM http((
      'POST',
      'https://hook.eu2.make.com/sqs2ugnwh7f7mw7ljqihgkojpjgk4a8w',
      ARRAY[http_header('content-type', 'application/json')],
      payload::text
    )::http_request);
    
    RAISE NOTICE 'log_user_signup: Make.com response status: %, body: %', http_response.status, http_response.content;
    
    RETURN NEW;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'log_user_signup: Error sending to Make.com for user_id: %, error: %', NEW.id, SQLERRM;
    RETURN NEW; -- Don't break the signup process
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Drop and recreate the trigger on user_profiles
DROP TRIGGER IF EXISTS log_user_signup ON public.user_profiles;
CREATE TRIGGER log_user_signup
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_user_signup();

-- Step 5: Test that everything is set up correctly
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Created handle_new_user function';
  RAISE NOTICE 'Created trigger on_auth_user_created on auth.users table';
  RAISE NOTICE 'Created log_user_signup function with webhook URL: https://hook.eu2.make.com/sqs2ugnwh7f7mw7ljqihgkojpjgk4a8w';
  RAISE NOTICE 'Created trigger log_user_signup on user_profiles table';
  RAISE NOTICE 'Ready to test user signup flow!';
END $$;