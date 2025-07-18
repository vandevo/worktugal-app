/*
  # Fix Security Definer Issue

  This migration fixes the SECURITY DEFINER syntax error by recreating views without
  the SECURITY DEFINER clause, which is not supported in Supabase.

  1. Drop existing views that might have SECURITY DEFINER
  2. Recreate views with proper Supabase-compatible syntax
  3. Ensure all RLS policies are properly configured
*/

-- Drop existing views if they exist
DROP VIEW IF EXISTS stripe_user_subscriptions;
DROP VIEW IF EXISTS stripe_user_orders;

-- Recreate stripe_user_subscriptions view (Supabase compatible)
CREATE VIEW stripe_user_subscriptions AS
SELECT 
  sc.customer_id,
  ss.subscription_id,
  ss.status as subscription_status,
  ss.price_id,
  ss.current_period_start,
  ss.current_period_end,
  ss.cancel_at_period_end,
  ss.payment_method_brand,
  ss.payment_method_last4
FROM stripe_customers sc
LEFT JOIN stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE sc.user_id = auth.uid()
  AND sc.deleted_at IS NULL
  AND (ss.deleted_at IS NULL OR ss.deleted_at IS NOT NULL);

-- Recreate stripe_user_orders view (Supabase compatible)
CREATE VIEW stripe_user_orders AS
SELECT 
  sc.customer_id,
  so.id as order_id,
  so.checkout_session_id,
  so.payment_intent_id,
  so.amount_subtotal,
  so.amount_total,
  so.currency,
  so.payment_status,
  so.status as order_status,
  so.created_at as order_date
FROM stripe_customers sc
LEFT JOIN stripe_orders so ON sc.customer_id = so.customer_id
WHERE sc.user_id = auth.uid()
  AND sc.deleted_at IS NULL
  AND (so.deleted_at IS NULL OR so.deleted_at IS NOT NULL);

-- Ensure all tables have proper RLS policies
-- (Re-create if needed to ensure they work correctly)

-- Stripe customers policies
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Stripe subscriptions policies
DROP POLICY IF EXISTS "Users can view their own subscription data" ON stripe_subscriptions;
CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id 
      FROM stripe_customers 
      WHERE user_id = auth.uid() 
        AND deleted_at IS NULL
    ) 
    AND deleted_at IS NULL
  );

-- Stripe orders policies
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;
CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id 
      FROM stripe_customers 
      WHERE user_id = auth.uid() 
        AND deleted_at IS NULL
    ) 
    AND deleted_at IS NULL
  );