/*
  # Fix Webhook Trigger URL Configuration

  1. Changes
    - Update trigger function to use correct Edge Function URL format
    - Remove dynamic URL construction that was causing DNS issues
    - Use hardcoded project URL for reliable webhook delivery

  2. Notes
    - pg_net requires fully qualified URLs with proper DNS resolution
    - Edge Function is already deployed and accessible
    - Webhook will now fire reliably on each INSERT
*/

-- Update function with correct Edge Function URL
CREATE OR REPLACE FUNCTION notify_makecom_new_lead()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  request_id bigint;
  edge_function_url text := 'https://vsnibptqaxjjuoubpzow.supabase.co/functions/v1/send-lead-to-makecom';
BEGIN
  -- Make async HTTP POST request to Edge Function using pg_net
  -- This is non-blocking and won't delay the INSERT operation
  SELECT net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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
  RAISE NOTICE 'Sent lead % to Edge Function, request ID: %', NEW.id, request_id;

  -- Always return NEW to allow the INSERT to complete
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the INSERT
    RAISE WARNING 'Failed to send lead % to Edge Function: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger already exists, no need to recreate
COMMENT ON FUNCTION notify_makecom_new_lead() IS 'Automatically sends new leads to Make.com via Edge Function - Updated with correct URL';
