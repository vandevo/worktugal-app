/*
  # Safe Stripe Integration Setup
  
  This migration safely sets up the Stripe integration, checking for existing objects first.
  
  ## Features
  - Creates types only if they don't exist
  - Creates tables only if they don't exist  
  - Sets up RLS policies safely
  - Creates views with proper error handling
*/

-- Create custom types only if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_subscription_status') THEN
    CREATE TYPE stripe_subscription_status AS ENUM (
      'not_started',
      'incomplete', 
      'incomplete_expired',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'paused'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_order_status') THEN
    CREATE TYPE stripe_order_status AS ENUM (
      'pending',
      'completed', 
      'canceled'
    );
  END IF;
END $$;

-- Create stripe_customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Create stripe_subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id text NOT NULL UNIQUE,
  subscription_id text,
  price_id text,
  current_period_start bigint,
  current_period_end bigint,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text,
  payment_method_last4 text,
  status stripe_subscription_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Create stripe_orders table
CREATE TABLE IF NOT EXISTS stripe_orders (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  checkout_session_id text NOT NULL,
  payment_intent_id text NOT NULL,
  customer_id text NOT NULL,
  amount_subtotal bigint NOT NULL,
  amount_total bigint NOT NULL,
  currency text NOT NULL,
  payment_status text NOT NULL,
  status stripe_order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Enable RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'stripe_customers' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'stripe_subscriptions' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'stripe_orders' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies (drop existing if they exist)
DO $$ BEGIN
  -- Customer policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own customer data') THEN
    DROP POLICY "Users can view their own customer data" ON stripe_customers;
  END IF;
  
  CREATE POLICY "Users can view their own customer data"
    ON stripe_customers FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

  -- Subscription policies  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own subscription data') THEN
    DROP POLICY "Users can view their own subscription data" ON stripe_subscriptions;
  END IF;
  
  CREATE POLICY "Users can view their own subscription data"
    ON stripe_subscriptions FOR SELECT
    TO authenticated
    USING (
      customer_id IN (
        SELECT customer_id FROM stripe_customers 
        WHERE user_id = auth.uid() AND deleted_at IS NULL
      ) AND deleted_at IS NULL
    );

  -- Order policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own order data') THEN
    DROP POLICY "Users can view their own order data" ON stripe_orders;
  END IF;
  
  CREATE POLICY "Users can view their own order data"
    ON stripe_orders FOR SELECT
    TO authenticated
    USING (
      customer_id IN (
        SELECT customer_id FROM stripe_customers 
        WHERE user_id = auth.uid() AND deleted_at IS NULL
      ) AND deleted_at IS NULL
    );
END $$;

-- Create views (drop existing if they exist)
DROP VIEW IF EXISTS stripe_user_subscriptions;
CREATE VIEW stripe_user_subscriptions AS
SELECT 
  s.customer_id,
  s.subscription_id,
  s.status as subscription_status,
  s.price_id,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.payment_method_brand,
  s.payment_method_last4
FROM stripe_subscriptions s
INNER JOIN stripe_customers c ON s.customer_id = c.customer_id
WHERE c.user_id = auth.uid() 
  AND s.deleted_at IS NULL 
  AND c.deleted_at IS NULL;

DROP VIEW IF EXISTS stripe_user_orders;
CREATE VIEW stripe_user_orders AS
SELECT 
  o.customer_id,
  o.id as order_id,
  o.checkout_session_id,
  o.payment_intent_id,
  o.amount_subtotal,
  o.amount_total,
  o.currency,
  o.payment_status,
  o.status as order_status,
  o.created_at as order_date
FROM stripe_orders o
INNER JOIN stripe_customers c ON o.customer_id = c.customer_id
WHERE c.user_id = auth.uid() 
  AND o.deleted_at IS NULL 
  AND c.deleted_at IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_customer_id ON stripe_customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id ON stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id ON stripe_orders(customer_id);