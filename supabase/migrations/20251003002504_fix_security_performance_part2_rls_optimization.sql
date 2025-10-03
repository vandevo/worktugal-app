/*
  # Fix Security and Performance Issues - Part 2: Optimize RLS Policies

  ## Changes Made

  **Optimize RLS Policies for Performance**
  - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
  - This prevents re-evaluation of auth functions for each row
  - Applies to all affected tables:
    - stripe_customers
    - stripe_subscriptions
    - stripe_orders
    - partner_submissions
    - user_profiles
    - documentation
    - accountant_profiles
    - appointments
    - payouts
    - disputes
    - consult_bookings
    - accounting_clients
    - accountant_applications

  ## Performance Impact
  - Significantly improves query performance at scale by evaluating auth.uid() once per query instead of once per row
  - Reduces CPU usage on large datasets
*/

-- ============================================================================
-- Stripe Tables
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own customer data" ON public.stripe_customers;
CREATE POLICY "Users can view their own customer data"
  ON public.stripe_customers FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can view their own subscription data" ON public.stripe_subscriptions;
CREATE POLICY "Users can view their own subscription data"
  ON public.stripe_subscriptions FOR SELECT TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM stripe_customers
    WHERE user_id = (select auth.uid()) AND deleted_at IS NULL
  ) AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can view their own order data" ON public.stripe_orders;
CREATE POLICY "Users can view their own order data"
  ON public.stripe_orders FOR SELECT TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM stripe_customers
    WHERE user_id = (select auth.uid()) AND deleted_at IS NULL
  ) AND deleted_at IS NULL);

-- ============================================================================
-- Partner Submissions
-- ============================================================================

DROP POLICY IF EXISTS "Users can manage their own partner submissions" ON public.partner_submissions;
CREATE POLICY "Users can manage their own partner submissions"
  ON public.partner_submissions FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- User Profiles
-- ============================================================================

DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_profiles;

CREATE POLICY "Users can manage their own profile"
  ON public.user_profiles FOR ALL TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can view their own role"
  ON public.user_profiles FOR SELECT TO authenticated
  USING (id = (select auth.uid()));

-- ============================================================================
-- Documentation
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert documentation" ON public.documentation;
DROP POLICY IF EXISTS "Users can update own documentation" ON public.documentation;

CREATE POLICY "Authenticated users can insert documentation"
  ON public.documentation FOR INSERT TO authenticated
  WITH CHECK (created_by = (select auth.uid()));

CREATE POLICY "Users can update own documentation"
  ON public.documentation FOR UPDATE TO authenticated
  USING (created_by = (select auth.uid()))
  WITH CHECK (created_by = (select auth.uid()));

-- ============================================================================
-- Accountant Profiles
-- ============================================================================

DROP POLICY IF EXISTS "Accountants can view their own profile" ON public.accountant_profiles;
DROP POLICY IF EXISTS "Accountants can update their own profile" ON public.accountant_profiles;
DROP POLICY IF EXISTS "Admins can view all accountant profiles" ON public.accountant_profiles;
DROP POLICY IF EXISTS "Admins can update all accountant profiles" ON public.accountant_profiles;
DROP POLICY IF EXISTS "Admins can insert accountant profiles" ON public.accountant_profiles;

CREATE POLICY "Accountants can view their own profile"
  ON public.accountant_profiles FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Accountants can update their own profile"
  ON public.accountant_profiles FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Admins can view all accountant profiles"
  ON public.accountant_profiles FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

CREATE POLICY "Admins can update all accountant profiles"
  ON public.accountant_profiles FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

CREATE POLICY "Admins can insert accountant profiles"
  ON public.accountant_profiles FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

-- ============================================================================
-- Appointments
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Clients can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Accountants can view their assigned appointments" ON public.appointments;
DROP POLICY IF EXISTS "Accountants can update their assigned appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can insert appointments" ON public.appointments;

CREATE POLICY "Clients can view their own appointments"
  ON public.appointments FOR SELECT TO authenticated
  USING (client_id = (select auth.uid()));

CREATE POLICY "Clients can update their own appointments"
  ON public.appointments FOR UPDATE TO authenticated
  USING (client_id = (select auth.uid()))
  WITH CHECK (client_id = (select auth.uid()));

CREATE POLICY "Accountants can view their assigned appointments"
  ON public.appointments FOR SELECT TO authenticated
  USING (accountant_id = (select auth.uid()));

CREATE POLICY "Accountants can update their assigned appointments"
  ON public.appointments FOR UPDATE TO authenticated
  USING (accountant_id = (select auth.uid()))
  WITH CHECK (accountant_id = (select auth.uid()));

CREATE POLICY "Admins can view all appointments"
  ON public.appointments FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

CREATE POLICY "Admins can update all appointments"
  ON public.appointments FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

CREATE POLICY "Admins can insert appointments"
  ON public.appointments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

-- ============================================================================
-- Payouts
-- ============================================================================

DROP POLICY IF EXISTS "Accountants can view their own payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can view all payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can insert payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can update payouts" ON public.payouts;

CREATE POLICY "Accountants can view their own payouts"
  ON public.payouts FOR SELECT TO authenticated
  USING (accountant_id = (select auth.uid()));

CREATE POLICY "Admins can view all payouts"
  ON public.payouts FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

CREATE POLICY "Admins can insert payouts"
  ON public.payouts FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

CREATE POLICY "Admins can update payouts"
  ON public.payouts FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

-- ============================================================================
-- Disputes
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view their own disputes" ON public.disputes;
DROP POLICY IF EXISTS "Clients can create disputes for their appointments" ON public.disputes;
DROP POLICY IF EXISTS "Accountants can view disputes about them" ON public.disputes;
DROP POLICY IF EXISTS "Admins can view all disputes" ON public.disputes;
DROP POLICY IF EXISTS "Admins can update disputes" ON public.disputes;

CREATE POLICY "Clients can view their own disputes"
  ON public.disputes FOR SELECT TO authenticated
  USING (client_id = (select auth.uid()));

CREATE POLICY "Clients can create disputes for their appointments"
  ON public.disputes FOR INSERT TO authenticated
  WITH CHECK (
    client_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM appointments
      WHERE id = appointment_id AND client_id = (select auth.uid())
    )
  );

CREATE POLICY "Accountants can view disputes about them"
  ON public.disputes FOR SELECT TO authenticated
  USING (accountant_id = (select auth.uid()));

CREATE POLICY "Admins can view all disputes"
  ON public.disputes FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

CREATE POLICY "Admins can update disputes"
  ON public.disputes FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

-- ============================================================================
-- Consult Bookings
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own bookings" ON public.consult_bookings;
DROP POLICY IF EXISTS "Clients can create bookings" ON public.consult_bookings;
DROP POLICY IF EXISTS "Clients can update own bookings" ON public.consult_bookings;

CREATE POLICY "Clients can view own bookings"
  ON public.consult_bookings FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Clients can create bookings"
  ON public.consult_bookings FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Clients can update own bookings"
  ON public.consult_bookings FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- Accounting Clients
-- ============================================================================

DROP POLICY IF EXISTS "Clients can view own record" ON public.accounting_clients;
DROP POLICY IF EXISTS "Clients can create own record" ON public.accounting_clients;
DROP POLICY IF EXISTS "Clients can update own record" ON public.accounting_clients;

CREATE POLICY "Clients can view own record"
  ON public.accounting_clients FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Clients can create own record"
  ON public.accounting_clients FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Clients can update own record"
  ON public.accounting_clients FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- Accountant Applications
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view all applications" ON public.accountant_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.accountant_applications;

CREATE POLICY "Admins can view all applications"
  ON public.accountant_applications FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));

CREATE POLICY "Admins can update applications"
  ON public.accountant_applications FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  ));
