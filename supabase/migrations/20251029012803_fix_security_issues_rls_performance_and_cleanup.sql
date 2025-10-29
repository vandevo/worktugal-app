/*
  # Fix Security Issues - RLS Performance and Database Cleanup

  1. RLS Performance Optimization
    - Fix `leads_accounting` RLS policy to use (select auth.uid()) for better performance
    - Fix `accounting_intakes` RLS policies to use (select auth.uid()) for better performance
    - These changes prevent re-evaluation of auth functions for each row

  2. Remove Unused Indexes
    - Drop all unused indexes identified by database analysis
    - Reduces database overhead and maintenance costs
    - Indexes can be recreated if usage patterns change

  3. Fix Function Search Path Issues
    - Set explicit search_path for functions to prevent security issues
    - Ensures functions use predictable schema resolution

  4. Security Notes
    - Multiple permissive policies are intentional (different roles need different access)
    - Leaked password protection requires Supabase dashboard configuration
    - Postgres version upgrade requires Supabase support intervention
*/

-- =====================================================
-- PART 1: FIX RLS PERFORMANCE ISSUES
-- =====================================================

-- Fix leads_accounting RLS policy
DROP POLICY IF EXISTS "Users can view own leads by email" ON leads_accounting;

CREATE POLICY "Users can view own leads by email"
  ON leads_accounting FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = (select auth.uid()))
  );

-- Fix accounting_intakes RLS policies
DROP POLICY IF EXISTS "Users can view own intakes by email" ON accounting_intakes;

CREATE POLICY "Users can view own intakes by email"
  ON accounting_intakes FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Accountants can view claimed intakes" ON accounting_intakes;

CREATE POLICY "Accountants can view claimed intakes"
  ON accounting_intakes FOR SELECT
  TO authenticated
  USING (
    claimed_by = (select auth.uid())
  );

-- =====================================================
-- PART 2: REMOVE UNUSED INDEXES
-- =====================================================

-- Partner submissions indexes
DROP INDEX IF EXISTS idx_partner_submissions_business_category;
DROP INDEX IF EXISTS idx_partner_submissions_status;
DROP INDEX IF EXISTS idx_partner_submissions_stripe_order_id;

-- Accounting intakes indexes
DROP INDEX IF EXISTS idx_accounting_intakes_status;
DROP INDEX IF EXISTS idx_accounting_intakes_created_at;
DROP INDEX IF EXISTS idx_accounting_intakes_claimed_by;

-- Appointments indexes
DROP INDEX IF EXISTS idx_appointments_cal_booking_uid;
DROP INDEX IF EXISTS idx_appointments_cal_reschedule_uid;
DROP INDEX IF EXISTS idx_appointments_accountant_id;
DROP INDEX IF EXISTS idx_appointments_status;
DROP INDEX IF EXISTS idx_appointments_scheduled_date;
DROP INDEX IF EXISTS idx_appointments_cal_event_id;
DROP INDEX IF EXISTS idx_appointments_escrow_hold_until;
DROP INDEX IF EXISTS idx_appointments_submission_id;
DROP INDEX IF EXISTS idx_appointments_consult_booking_id;
DROP INDEX IF EXISTS idx_appointments_stripe_payment_intent;

-- Accountant profiles indexes
DROP INDEX IF EXISTS idx_accountant_profiles_status;
DROP INDEX IF EXISTS idx_accountant_profiles_email;
DROP INDEX IF EXISTS idx_accountant_profiles_created_at;

-- Disputes indexes
DROP INDEX IF EXISTS idx_disputes_appointment_id;
DROP INDEX IF EXISTS idx_disputes_accountant_id;
DROP INDEX IF EXISTS idx_disputes_status;
DROP INDEX IF EXISTS idx_disputes_created_at;

-- Stripe indexes
DROP INDEX IF EXISTS idx_stripe_customers_customer_id;
DROP INDEX IF EXISTS idx_stripe_subscriptions_customer_id;

-- Applications indexes
DROP INDEX IF EXISTS idx_applications_status;
DROP INDEX IF EXISTS idx_applications_email;
DROP INDEX IF EXISTS idx_applications_created_at;

-- User profiles indexes
DROP INDEX IF EXISTS idx_user_profiles_role;

-- Documentation indexes
DROP INDEX IF EXISTS idx_documentation_doc_type;
DROP INDEX IF EXISTS idx_documentation_version;
DROP INDEX IF EXISTS idx_documentation_created_at;
DROP INDEX IF EXISTS idx_documentation_created_by;

-- Payouts indexes
DROP INDEX IF EXISTS idx_payouts_accountant_id;
DROP INDEX IF EXISTS idx_payouts_appointment_id;
DROP INDEX IF EXISTS idx_payouts_status;
DROP INDEX IF EXISTS idx_payouts_created_at;
DROP INDEX IF EXISTS idx_payouts_completed_at;

-- Consult bookings indexes
DROP INDEX IF EXISTS idx_consult_bookings_status;
DROP INDEX IF EXISTS idx_consult_bookings_service_type;
DROP INDEX IF EXISTS idx_consult_bookings_created_at;
DROP INDEX IF EXISTS idx_consult_bookings_stripe_session;

-- Leads accounting indexes
DROP INDEX IF EXISTS idx_leads_accounting_email;
DROP INDEX IF EXISTS idx_leads_accounting_status;

-- =====================================================
-- PART 3: FIX FUNCTION SEARCH PATH ISSUES
-- =====================================================

-- Fix update_accounting_intakes_updated_at function
DROP FUNCTION IF EXISTS update_accounting_intakes_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_accounting_intakes_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger if it existed
DROP TRIGGER IF EXISTS update_accounting_intakes_updated_at_trigger ON accounting_intakes;

CREATE TRIGGER update_accounting_intakes_updated_at_trigger
  BEFORE UPDATE ON accounting_intakes
  FOR EACH ROW
  EXECUTE FUNCTION update_accounting_intakes_updated_at();

-- Fix send_order_with_email_to_webhook function
DROP FUNCTION IF EXISTS send_order_with_email_to_webhook() CASCADE;

CREATE OR REPLACE FUNCTION send_order_with_email_to_webhook()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  webhook_url text;
  user_email text;
  request_id bigint;
BEGIN
  webhook_url := current_setting('app.settings.webhook_url', true);
  
  IF webhook_url IS NULL OR webhook_url = '' THEN
    RAISE WARNING 'Webhook URL not configured';
    RETURN NEW;
  END IF;

  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.user_id;

  SELECT
    net.http_post(
      url := webhook_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'order_id', NEW.id,
        'email', user_email,
        'stripe_order_id', NEW.stripe_order_id,
        'business_name', NEW.business_name,
        'business_category', NEW.business_category,
        'business_description', NEW.business_description,
        'created_at', NEW.created_at
      )
    ) INTO request_id;

  RETURN NEW;
END;
$$;

-- Recreate trigger if it existed
DROP TRIGGER IF EXISTS send_order_webhook_trigger ON partner_submissions;

CREATE TRIGGER send_order_webhook_trigger
  AFTER INSERT ON partner_submissions
  FOR EACH ROW
  EXECUTE FUNCTION send_order_with_email_to_webhook();

-- Fix handle_new_user function
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger if it existed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Fix log_user_signup function
DROP FUNCTION IF EXISTS log_user_signup() CASCADE;

CREATE OR REPLACE FUNCTION log_user_signup()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE LOG 'New user signup: % (%)', NEW.email, NEW.id;
  RETURN NEW;
END;
$$;

-- Recreate trigger if it existed  
DROP TRIGGER IF EXISTS log_new_user_signup ON auth.users;

CREATE TRIGGER log_new_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION log_user_signup();
