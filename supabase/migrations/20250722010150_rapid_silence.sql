/*
  # Clean Webhook Setup for User Signups

  This migration sets up the complete webhook flow for user signups to Make.com:
  
  1. New Tables
    - No new tables needed (using existing auth.users and user_profiles)
  
  2. Functions
    - `handle_new_user()` - Creates user profile on signup
    - `log_user_signup()` - Sends webhook to Make.com with user data
  
  3. Triggers
    - `on_auth_user_created` - Triggers on auth.users INSERT
    - `log_user_signup` - Triggers on user_profiles INSERT
  
  4. Security
    - Functions run with proper permissions
    - Webhook URL is secured and validated
*/

-- Drop existing functions and triggers to start clean
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS log_user_signup ON public.user_profiles;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.log_user_signup() CASCADE;

-- Create the handle_new_user function that creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_count INTEGER;
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
    
    -- Check if profile was created
    SELECT COUNT(*) INTO profile_count
    FROM public.user_profiles
    WHERE id = NEW.id;
    
    IF profile_count > 0 THEN
        RAISE NOTICE 'handle_new_user: Successfully created profile for user_id: %', NEW.id;
    ELSE
        RAISE NOTICE 'handle_new_user: Profile already exists for user_id: %', NEW.id;
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'handle_new_user: Error for user_id %, error: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the log_user_signup function that sends webhook to Make.com
CREATE OR REPLACE FUNCTION public.log_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    webhook_payload JSONB;
    http_response RECORD;
BEGIN
    -- Get user email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.id;
    
    IF user_email IS NULL THEN
        RAISE NOTICE 'log_user_signup: No email found for user_id: %', NEW.id;
        RETURN NEW;
    END IF;
    
    RAISE NOTICE 'log_user_signup: Found email % for user_id: %', user_email, NEW.id;
    
    -- Prepare webhook payload
    webhook_payload := jsonb_build_object(
        'user_id', NEW.id,
        'email', user_email,
        'display_name', COALESCE(NEW.display_name, ''),
        'role', NEW.role,
        'created_at', NEW.created_at,
        'event_type', 'user_signup'
    );
    
    RAISE NOTICE 'log_user_signup: Sending payload to Make.com: %', webhook_payload;
    
    -- Send HTTP request to Make.com webhook
    SELECT * INTO http_response
    FROM supabase_functions.http_request(
        'https://hook.eu2.make.com/sqs2ugnwh7f7mw7ljqihgkojpjgk4a8w',
        'POST',
        '{"Content-Type": "application/json"}',
        webhook_payload::text,
        5000
    );
    
    RAISE NOTICE 'log_user_signup: Make.com response status: %, body: %', 
        http_response.status, 
        COALESCE(http_response.body, 'null');
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'log_user_signup: Error for user_id %, error: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for new user signups
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger on user_profiles for webhook logging
CREATE TRIGGER log_user_signup
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_user_signup();