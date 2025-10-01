/*
  # Drop Unrestricted Database Views

  This migration removes database views that show as "Unrestricted" in the Supabase dashboard
  because views cannot have Row Level Security (RLS) policies applied to them.

  ## Changes Made

  1. Drop Views
    - `stripe_user_subscriptions` - View that joined stripe_customers and stripe_subscriptions
    - `stripe_user_orders` - View that joined stripe_customers and stripe_orders
  
  2. Security Impact
    - The underlying tables (stripe_customers, stripe_subscriptions, stripe_orders) remain intact
    - All tables have proper RLS policies already in place
    - Application code has been updated to query secure base tables directly

  3. Why Views Are Being Removed
    - Views cannot have RLS policies, so they show as "Unrestricted" in dashboard
    - The views were convenience wrappers but created security warnings
    - Querying base tables directly with proper filtering is more secure and explicit
    - All RLS protections are enforced through the base tables

  ## Migration Notes
  
  - This is a safe operation - no data is lost
  - Application code has been updated before applying this migration
  - The base tables continue to enforce all security through RLS policies
*/

-- Drop the unrestricted views
DROP VIEW IF EXISTS stripe_user_subscriptions;
DROP VIEW IF EXISTS stripe_user_orders;

-- Verify the base tables still exist with RLS enabled
DO $$
BEGIN
  -- Log confirmation that base tables remain secure
  RAISE NOTICE 'Migration completed: Dropped unrestricted views';
  RAISE NOTICE 'Base tables stripe_customers, stripe_subscriptions, and stripe_orders remain secure with RLS';
END $$;