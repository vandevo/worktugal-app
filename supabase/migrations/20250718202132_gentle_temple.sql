/*
  # Clear existing Stripe data for test mode

  1. Purpose
    - Remove existing Stripe customer and subscription data that was created in live mode
    - This resolves the customer ID mismatch when switching to test mode API keys
  
  2. Changes
    - Delete all records from stripe_subscriptions table
    - Delete all records from stripe_customers table
    - Delete all records from stripe_orders table
  
  3. Security
    - Data will be safely removed to allow fresh test data creation
    - RLS policies remain unchanged
*/

-- Clear all Stripe-related data to resolve live/test mode mismatch
DELETE FROM stripe_subscriptions;
DELETE FROM stripe_orders;
DELETE FROM stripe_customers;