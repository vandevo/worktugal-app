/*
  # Comprehensive Security & Performance Fixes

  Fixes all identified security and performance issues including:
  - 12 missing foreign key indexes
  - 15 RLS policies with inefficient auth.uid() calls
  - 11 unused indexes
  - Duplicate permissive policies
  - 3 functions with mutable search_path

  Expected improvements:
  - Faster queries on foreign key joins
  - Reduced RLS evaluation overhead
  - Lower database maintenance costs
  - Prevention of search_path injection attacks
*/

-- ==================================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- ==================================================

CREATE INDEX IF NOT EXISTS idx_accounting_intakes_claimed_by 
  ON accounting_intakes(claimed_by);

CREATE INDEX IF NOT EXISTS idx_appointments_accountant_id 
  ON appointments(accountant_id);

CREATE INDEX IF NOT EXISTS idx_appointments_booking_id 
  ON appointments(booking_id);

CREATE INDEX IF NOT EXISTS idx_appointments_consult_booking_id 
  ON appointments(consult_booking_id);

CREATE INDEX IF NOT EXISTS idx_disputes_accountant_id 
  ON disputes(accountant_id);

CREATE INDEX IF NOT EXISTS idx_disputes_appointment_id 
  ON disputes(appointment_id);

CREATE INDEX IF NOT EXISTS idx_documentation_created_by 
  ON documentation(created_by);

CREATE INDEX IF NOT EXISTS idx_partner_submissions_stripe_order_id 
  ON partner_submissions(stripe_order_id);

CREATE INDEX IF NOT EXISTS idx_payouts_accountant_id 
  ON payouts(accountant_id);

CREATE INDEX IF NOT EXISTS idx_payouts_appointment_id 
  ON payouts(appointment_id);

CREATE INDEX IF NOT EXISTS idx_project_changelog_created_by 
  ON project_changelog(created_by);

CREATE INDEX IF NOT EXISTS idx_tax_checkup_leads_previous_submission_id 
  ON tax_checkup_leads(previous_submission_id);

-- ==================================================
-- PART 2: DROP UNUSED INDEXES
-- ==================================================

DROP INDEX IF EXISTS idx_tax_checkup_leads_status;
DROP INDEX IF EXISTS idx_accounting_intakes_came_from_checkup_id;
DROP INDEX IF EXISTS idx_accounting_intakes_previous_submission_id;
DROP INDEX IF EXISTS idx_accounting_intakes_user_id;
DROP INDEX IF EXISTS idx_checkup_feedback_is_accurate;
DROP INDEX IF EXISTS idx_checkup_feedback_feedback_type;
DROP INDEX IF EXISTS idx_checkup_feedback_status;
DROP INDEX IF EXISTS idx_checkup_feedback_flag_id;
DROP INDEX IF EXISTS idx_checkup_feedback_created_at;
DROP INDEX IF EXISTS idx_project_changelog_date;
DROP INDEX IF EXISTS idx_project_changelog_category;
DROP INDEX IF EXISTS idx_project_changelog_created_at;

-- ==================================================
-- PART 3: FIX RLS POLICIES - OPTIMIZE AUTH.UID() CALLS
-- ==================================================

-- checkup_feedback policies
DROP POLICY IF EXISTS "Admins can view all feedback" ON checkup_feedback;
CREATE POLICY "Admins can view all feedback" ON checkup_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update feedback" ON checkup_feedback;
CREATE POLICY "Admins can update feedback" ON checkup_feedback
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- accountant_profiles policies
DROP POLICY IF EXISTS "Users and admins can view accountant profiles" ON accountant_profiles;
CREATE POLICY "Users and admins can view accountant profiles" ON accountant_profiles
  FOR SELECT
  TO authenticated
  USING (
    id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Accountants and admins can update profiles" ON accountant_profiles;
CREATE POLICY "Accountants and admins can update profiles" ON accountant_profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- accounting_intakes policies (uses user_id, not client_id)
DROP POLICY IF EXISTS "Users can view relevant intakes" ON accounting_intakes;
CREATE POLICY "Users can view relevant intakes" ON accounting_intakes
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    claimed_by = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- appointments policies (uses client_id, not user_id)
DROP POLICY IF EXISTS "Users can view relevant appointments" ON appointments;
CREATE POLICY "Users can view relevant appointments" ON appointments
  FOR SELECT
  TO authenticated
  USING (
    client_id = (select auth.uid()) OR
    accountant_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can update relevant appointments" ON appointments;
CREATE POLICY "Users can update relevant appointments" ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    client_id = (select auth.uid()) OR
    accountant_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- disputes policies (uses client_id)
DROP POLICY IF EXISTS "Users can view relevant disputes" ON disputes;
CREATE POLICY "Users can view relevant disputes" ON disputes
  FOR SELECT
  TO authenticated
  USING (
    client_id = (select auth.uid()) OR
    accountant_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_submissions policies (uses user_id)
DROP POLICY IF EXISTS "Users can view partner submissions" ON partner_submissions;
CREATE POLICY "Users can view partner submissions" ON partner_submissions
  FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- payouts policies (only has accountant_id, no client_id)
DROP POLICY IF EXISTS "Users can view relevant payouts" ON payouts;
CREATE POLICY "Users can view relevant payouts" ON payouts
  FOR SELECT
  TO authenticated
  USING (
    accountant_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- user_profiles policies
DROP POLICY IF EXISTS "Users can view own profile and admins can view all" ON user_profiles;
CREATE POLICY "Users can view own profile and admins can view all" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = (select auth.uid()) AND up.role = 'admin'
    )
  );

-- project_changelog policies
DROP POLICY IF EXISTS "Admins can insert changelog" ON project_changelog;
CREATE POLICY "Admins can insert changelog" ON project_changelog
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update changelog" ON project_changelog;
CREATE POLICY "Admins can update changelog" ON project_changelog
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete changelog" ON project_changelog;
CREATE POLICY "Admins can delete changelog" ON project_changelog
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- tax_checkup_leads policies
DROP POLICY IF EXISTS "Admins can select all checkup leads" ON tax_checkup_leads;
CREATE POLICY "Admins can select all checkup leads" ON tax_checkup_leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update checkup leads" ON tax_checkup_leads;
CREATE POLICY "Admins can update checkup leads" ON tax_checkup_leads
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ==================================================
-- PART 4: FIX MULTIPLE PERMISSIVE POLICIES
-- ==================================================

DROP POLICY IF EXISTS "Allow SELECT after INSERT for feedback submission" ON checkup_feedback;

-- ==================================================
-- PART 5: FIX FUNCTION SEARCH PATHS
-- ==================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_tax_checkup_leads_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_flag_accuracy_stats()
RETURNS TABLE (
  flag_id text,
  flag_name text,
  total_feedback bigint,
  accurate_count bigint,
  inaccurate_count bigint,
  accuracy_rate numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cf.flag_id,
    cf.flag_id as flag_name,
    COUNT(*) as total_feedback,
    COUNT(*) FILTER (WHERE cf.is_accurate = true) as accurate_count,
    COUNT(*) FILTER (WHERE cf.is_accurate = false) as inaccurate_count,
    ROUND(
      (COUNT(*) FILTER (WHERE cf.is_accurate = true)::numeric / NULLIF(COUNT(*), 0)) * 100,
      2
    ) as accuracy_rate
  FROM checkup_feedback cf
  WHERE cf.flag_id IS NOT NULL
  GROUP BY cf.flag_id
  ORDER BY total_feedback DESC;
END;
$$;
