/*
  # Fix Security Issues - Indexes and Functions
  
  1. Performance Improvements
    - Add missing indexes for foreign keys in accounting_intakes table:
      - came_from_checkup_id
      - previous_submission_id
      - user_id
    
  2. Cleanup
    - Drop unused indexes to reduce maintenance overhead:
      - idx_accounting_intakes_claimed_by
      - idx_appointments_accountant_id
      - idx_appointments_booking_id
      - idx_appointments_consult_booking_id
      - idx_disputes_accountant_id
      - idx_disputes_appointment_id
      - idx_partner_submissions_stripe_order_id
      - idx_payouts_accountant_id
      - idx_payouts_appointment_id
      - idx_project_changelog_created_by
      - idx_tax_checkup_leads_previous_submission_id
  
  3. Security
    - Fix search_path for functions to prevent search path injection attacks:
      - is_admin(user_id uuid)
      - get_flag_accuracy_stats(p_flag_id text)
  
  Notes:
    - Leaked Password Protection and Postgres version upgrade require Supabase dashboard configuration
*/

-- Add missing indexes for foreign keys in accounting_intakes
CREATE INDEX IF NOT EXISTS idx_accounting_intakes_came_from_checkup 
  ON accounting_intakes(came_from_checkup_id) 
  WHERE came_from_checkup_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_previous_submission 
  ON accounting_intakes(previous_submission_id) 
  WHERE previous_submission_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_user_id 
  ON accounting_intakes(user_id) 
  WHERE user_id IS NOT NULL;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_accounting_intakes_claimed_by;
DROP INDEX IF EXISTS idx_appointments_accountant_id;
DROP INDEX IF EXISTS idx_appointments_booking_id;
DROP INDEX IF EXISTS idx_appointments_consult_booking_id;
DROP INDEX IF EXISTS idx_disputes_accountant_id;
DROP INDEX IF EXISTS idx_disputes_appointment_id;
DROP INDEX IF EXISTS idx_partner_submissions_stripe_order_id;
DROP INDEX IF EXISTS idx_payouts_accountant_id;
DROP INDEX IF EXISTS idx_payouts_appointment_id;
DROP INDEX IF EXISTS idx_project_changelog_created_by;
DROP INDEX IF EXISTS idx_tax_checkup_leads_previous_submission_id;

-- Fix search_path for is_admin(user_id uuid) function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_id
    AND role = 'admin'
  );
$function$;

-- Fix search_path for get_flag_accuracy_stats(p_flag_id text) function
CREATE OR REPLACE FUNCTION public.get_flag_accuracy_stats(p_flag_id text)
RETURNS TABLE(
  flag_id text, 
  total_feedback bigint, 
  helpful_count bigint, 
  not_helpful_count bigint, 
  accuracy_percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    p_flag_id as flag_id,
    COUNT(*) as total_feedback,
    COUNT(*) FILTER (WHERE feedback_type = 'helpful') as helpful_count,
    COUNT(*) FILTER (WHERE feedback_type = 'not_helpful') as not_helpful_count,
    ROUND(
      (COUNT(*) FILTER (WHERE feedback_type = 'helpful')::numeric /
       NULLIF(COUNT(*), 0)::numeric) * 100,
      1
    ) as accuracy_percentage
  FROM checkup_feedback
  WHERE checkup_feedback.flag_id = p_flag_id
    AND is_accurate IS NOT NULL;
END;
$function$;
