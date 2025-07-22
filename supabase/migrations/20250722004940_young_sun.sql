/*
  # Create handle_new_user function and trigger

  1. New Functions
    - `handle_new_user()` - Creates a user profile when a new user signs up
  
  2. New Triggers
    - `on_auth_user_created` on `auth.users` table - Automatically calls handle_new_user when a new user is created
  
  3. Purpose
    - Ensures that every new user gets a corresponding record in public.user_profiles
    - This enables the existing log_user_signup trigger to fire and send data to Make.com
    - Fixes the issue where user signups weren't creating profiles and triggering webhooks
*/

-- Function to create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a new profile for the user with default role 'user'
  INSERT INTO public.user_profiles (id, display_name, role)
  VALUES (NEW.id, NEW.email, 'user');
  
  -- Log that we created a profile (for debugging)
  RAISE NOTICE 'Created user profile for user_id: %, email: %', NEW.id, NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If profile already exists, just log and continue
    RAISE NOTICE 'User profile already exists for user_id: %', NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log any other errors but don't prevent user creation
    RAISE WARNING 'Error creating user profile for user_id: %. Error: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop the trigger if it exists to prevent duplicates
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call handle_new_user after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created successfully
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created' 
    AND event_object_table = 'users'
    AND event_object_schema = 'auth'
  ) THEN
    RAISE NOTICE 'SUCCESS: on_auth_user_created trigger created successfully';
  ELSE
    RAISE WARNING 'FAILED: on_auth_user_created trigger was not created';
  END IF;
END $$;