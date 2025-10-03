/*
  # Fix Security and Performance Issues - Part 1: Add Missing Indexes

  ## Changes Made

  1. **Add Missing Indexes on Foreign Keys**
     - Add index on `accountant_applications.reviewed_by`
     - Add index on `disputes.resolved_by`
     - Add index on `documentation.created_by`
     - Add index on `partner_submissions.stripe_order_id`
     - Add index on `payouts.initiated_by`

  These indexes improve query performance when joining tables or filtering by foreign key values.
*/

-- Index for accountant_applications.reviewed_by
CREATE INDEX IF NOT EXISTS idx_accountant_applications_reviewed_by 
ON public.accountant_applications(reviewed_by);

-- Index for disputes.resolved_by
CREATE INDEX IF NOT EXISTS idx_disputes_resolved_by 
ON public.disputes(resolved_by);

-- Index for documentation.created_by
CREATE INDEX IF NOT EXISTS idx_documentation_created_by 
ON public.documentation(created_by);

-- Index for partner_submissions.stripe_order_id
CREATE INDEX IF NOT EXISTS idx_partner_submissions_stripe_order_id 
ON public.partner_submissions(stripe_order_id);

-- Index for payouts.initiated_by
CREATE INDEX IF NOT EXISTS idx_payouts_initiated_by 
ON public.payouts(initiated_by);
