/*
  # Add Email to Stripe Orders Webhook

  This migration safely adds email information to stripe orders webhook without breaking existing functionality.

  1. Creates a new function to fetch customer email and send rich payload
  2. Adds the new trigger alongside the existing one (non-breaking)
  3. Enables pg_net extension for better webhook handling
  4. Includes comprehensive error handling and logging

  After testing, you can optionally remove the old trigger.
*/

-- Enable pg_net extension for robust HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the new function to send order data with email to webhook
CREATE OR REPLACE FUNCTION public.send_order_with_email_to_webhook()
RETURNS TRIGGER AS $$
DECLARE
    customer_email TEXT;
    user_display_name TEXT;
    payload JSONB;
    webhook_url TEXT := 'https://hook.eu2.make.com/q1olb5ksmx1bdt4rnw5lj0ndp2xgx6ij';
    http_response RECORD;
BEGIN
    -- Log the start of the function
    RAISE NOTICE 'send_order_with_email_to_webhook: Processing order_id %', NEW.id;
    
    BEGIN
        -- Fetch customer email and display name with comprehensive join
        SELECT 
            au.email,
            COALESCE(up.display_name, split_part(au.email, '@', 1)) as display_name
        INTO customer_email, user_display_name
        FROM public.stripe_customers sc
        JOIN auth.users au ON sc.user_id = au.id
        LEFT JOIN public.user_profiles up ON sc.user_id = up.id
        WHERE sc.customer_id = NEW.customer_id 
        AND sc.deleted_at IS NULL;

        -- Check if email was found
        IF customer_email IS NULL THEN
            RAISE WARNING 'send_order_with_email_to_webhook: No email found for customer_id %', NEW.customer_id;
            RETURN NEW;
        END IF;

        RAISE NOTICE 'send_order_with_email_to_webhook: Found email % for customer_id %', customer_email, NEW.customer_id;

        -- Build comprehensive payload
        payload := jsonb_build_object(
            'event_type', 'stripe_order_completed',
            'order', jsonb_build_object(
                'id', NEW.id,
                'checkout_session_id', NEW.checkout_session_id,
                'payment_intent_id', NEW.payment_intent_id,
                'customer_id', NEW.customer_id,
                'amount_subtotal', NEW.amount_subtotal,
                'amount_total', NEW.amount_total,
                'currency', NEW.currency,
                'payment_status', NEW.payment_status,
                'status', NEW.status,
                'created_at', NEW.created_at
            ),
            'customer', jsonb_build_object(
                'email', customer_email,
                'display_name', user_display_name
            ),
            'timestamp', NOW()
        );

        RAISE NOTICE 'send_order_with_email_to_webhook: Sending payload to Make.com: %', payload;

        -- Send to webhook using pg_net (more reliable than supabase_functions.http_request)
        SELECT INTO http_response * FROM net.http_post(
            url := webhook_url,
            body := payload::text,
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'User-Agent', 'Supabase-Webhook/1.0'
            ),
            timeout_milliseconds := 10000
        );

        -- Log the response
        RAISE NOTICE 'send_order_with_email_to_webhook: Make.com response status: %, body: %', 
            http_response.status_code, 
            http_response.content;

        -- Check if webhook was successful
        IF http_response.status_code BETWEEN 200 AND 299 THEN
            RAISE NOTICE 'send_order_with_email_to_webhook: Successfully sent to Make.com';
        ELSE
            RAISE WARNING 'send_order_with_email_to_webhook: Make.com returned error status %: %', 
                http_response.status_code, http_response.content;
        END IF;

    EXCEPTION WHEN OTHERS THEN
        -- Log any errors but don't fail the transaction
        RAISE WARNING 'send_order_with_email_to_webhook: Error occurred: %', SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger (keeping the old one intact for now)
CREATE TRIGGER make_worktugal_pass_with_email
    AFTER INSERT ON public.stripe_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.send_order_with_email_to_webhook();

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Migration completed: Added email webhook trigger alongside existing trigger';
    RAISE NOTICE 'Test with a new order to verify both webhooks work';
    RAISE NOTICE 'Once confirmed working, you can optionally remove the old trigger';
END $$;