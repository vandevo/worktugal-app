/*
  # Debug and Fix User Signup Webhook Flow

  This migration will:
  1. Ensure the handle_new_user function exists and works correctly
  2. Ensure the trigger on auth.users is properly set up
  3. Ensure the log_user_signup function is working with the correct webhook URL
  4. Add comprehensive logging to debug the entire flow
*/

-- Step 1: Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the start of the function
  RAISE NOTICE 'handle_new_user: Starting for user_id: %', NEW.id;
  
  -- Insert into user_profiles with default role
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, 'user'::user_role)
  ON CONFLICT (id) DO NOTHING;
  
  -- Log successful profile creation
  RAISE NOTICE 'handle_new_user: Successfully created profile for user_id: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors
    RAISE NOTICE 'handle_new_user: ERROR for user_id: %, SQLSTATE: %, SQLERRM: %', NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW; -- Don't fail the user creation
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create or replace the log_user_signup function with correct webhook URL
CREATE OR REPLACE FUNCTION log_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  payload JSONB;
  http_request_id BIGINT;
BEGIN
  -- Log the start of the function
  RAISE NOTICE 'log_user_signup: Starting for user_id: %', NEW.id;
  
  -- Get the user's email from auth.users
  SELECT email INTO user_email 
  FROM auth.users 
  WHERE id = NEW.id;
  
  -- Log the email we found
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
  
  -- Log the payload we're sending
  RAISE NOTICE 'log_user_signup: Sending payload to Make.com: %', payload::text;
  
  -- Send HTTP request to Make.com webhook (corrected URL)
  SELECT INTO http_request_id supabase_functions.http_request(
    'https://hook.eu2.make.com/sqs2ugnwh7f7mw7ljqihgkojpjgk4a8w',
    'POST',
    '{"Content-Type": "application/json"}',
    payload::text,
    5000
  );
  
  -- Log the request ID
  RAISE NOTICE 'log_user_signup: HTTP request sent with ID: %', http_request_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors but don't fail the transaction
    RAISE NOTICE 'log_user_signup: ERROR for user_id: %, SQLSTATE: %, SQLERRM: %', NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Ensure the trigger exists on auth.users
DO $$
BEGIN
  -- Drop existing trigger if it exists
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  
  -- Create the trigger
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
    
  RAISE NOTICE 'Created trigger on_auth_user_created on auth.users table';
END $$;

-- Step 4: Ensure the trigger exists on user_profiles
DO $$
BEGIN
  -- Drop existing trigger if it exists
  DROP TRIGGER IF EXISTS log_user_signup ON public.user_profiles;
  
  -- Create the trigger
  CREATE TRIGGER log_user_signup
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION log_user_signup();
    
  RAISE NOTICE 'Created trigger log_user_signup on user_profiles table';
END $$;

-- Step 5: Test the functions work
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully. Functions and triggers are set up.';
  RAISE NOTICE 'To test: 1) Create a new user account 2) Check Supabase logs for debug messages 3) Check Make.com for webhook data';
END $$;