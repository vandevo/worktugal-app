/*
  # Add CASCADE foreign key constraints for Stripe tables

  This migration adds foreign key constraints with ON DELETE CASCADE to ensure
  that when a stripe_customers record is deleted (which happens when a user is deleted),
  all related stripe_subscriptions and stripe_orders records are automatically deleted.

  ## What this fixes:
  - Prevents "Database error deleting user" when users have associated Stripe data
  - Eliminates orphaned records in stripe_subscriptions and stripe_orders tables
  - Automates cleanup that previously required manual intervention

  ## Changes:
  1. Adds foreign key constraint to stripe_subscriptions.customer_id → stripe_customers.customer_id
  2. Adds foreign key constraint to stripe_orders.customer_id → stripe_customers.customer_id
  3. Both constraints include ON DELETE CASCADE for automatic cleanup
*/

-- Add foreign key constraint to stripe_subscriptions table
ALTER TABLE public.stripe_subscriptions
ADD CONSTRAINT fk_stripe_subscriptions_customer_id
FOREIGN KEY (customer_id) REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE;

-- Add foreign key constraint to stripe_orders table
ALTER TABLE public.stripe_orders
ADD CONSTRAINT fk_stripe_orders_customer_id
FOREIGN KEY (customer_id) REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE;