/*
  # Create Database Trigger for Make.com Webhook Integration

  1. Overview
    - Automatically send new leads to Make.com via Edge Function
    - Trigger fires on INSERT to leads_accounting table
    - Calls send-lead-to-makecom Edge Function with lead data
    - Non-blocking: uses pg_net for async HTTP calls

  2. Changes
    - Enable pg_net extension for async HTTP requests
    - Create trigger function to call Edge Function
    - Create trigger on leads_accounting INSERT events

  3. Security
    - Uses service role authentication for Edge Function calls
    - Trigger executes with definer security context
    - No user input processing in trigger logic

  4. Notes
    - Edge Function URL is constructed from project reference
    - Trigger is non-blocking to avoid slowing down INSERT operations
    - Failed webhook calls are logged but don't block lead creation
*/

-- Enable pg_net extension for async HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to send lead data to Make.com via Edge Function
CREATE OR REPLACE FUNCTION notify_makecom_new_lead()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  project_url text;
  service_role_key text;
  request_id bigint;
BEGIN
  -- Get the Supabase project URL from current settings
  -- The Edge Function URL format is: https://PROJECT_REF.supabase.co/functions/v1/FUNCTION_NAME
  project_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- If settings not available, construct from known pattern
  IF project_url IS NULL THEN
    -- Default to the Edge Function endpoint
    -- This will be called directly without project URL
    project_url := 'https://vsnibptqaxjjuoubpzow.supabase.co';
  END IF;

  -- Make async HTTP POST request to Edge Function using pg_net
  -- This is non-blocking and won't delay the INSERT operation
  SELECT net.http_post(
    url := project_url || '/functions/v1/send-lead-to-makecom',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(service_role_key, '')
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'leads_accounting',
      'record', jsonb_build_object(
        'id', NEW.id,
        'created_at', NEW.created_at,
        'name', NEW.name,
        'email', NEW.email,
        'country', NEW.country,
        'main_need', NEW.main_need,
        'urgency', NEW.urgency,
        'consent', NEW.consent,
        'source', NEW.source,
        'status', NEW.status
      )
    )
  ) INTO request_id;

  -- Log the request ID for debugging
  RAISE NOTICE 'Sent lead % to Make.com webhook, request ID: %', NEW.id, request_id;

  -- Always return NEW to allow the INSERT to complete
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the INSERT
    RAISE WARNING 'Failed to send lead % to Make.com: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger on leads_accounting table
DROP TRIGGER IF EXISTS on_lead_created_notify_makecom ON leads_accounting;

CREATE TRIGGER on_lead_created_notify_makecom
  AFTER INSERT ON leads_accounting
  FOR EACH ROW
  EXECUTE FUNCTION notify_makecom_new_lead();

-- Add helpful comment
COMMENT ON FUNCTION notify_makecom_new_lead() IS 'Automatically sends new leads to Make.com via Edge Function for email automation and Airtable sync';
COMMENT ON TRIGGER on_lead_created_notify_makecom ON leads_accounting IS 'Triggers Make.com webhook integration when new lead is created';
