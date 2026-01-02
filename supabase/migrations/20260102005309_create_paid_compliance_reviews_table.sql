/*
  # Create Paid Compliance Reviews Table
  
  This migration creates the infrastructure for the €49 "Detailed Compliance Risk Review" product.
  
  1. New Tables
    - `paid_compliance_reviews`
      - `id` (uuid, primary key) - Unique identifier for each review
      - `user_id` (uuid, nullable) - Links to auth.users if user has account
      - `stripe_session_id` (text, unique) - Stripe checkout session ID
      - `stripe_payment_intent_id` (text) - Stripe payment intent ID
      - `customer_email` (text) - Email from Stripe checkout
      - `customer_name` (text) - Name from Stripe checkout
      - `access_token` (text, unique) - Unique token for form access without login
      - `status` (text) - Workflow status: form_pending, submitted, in_review, completed, escalated
      - `form_data` (jsonb) - All 26 intake form answers
      - `form_progress` (jsonb) - Tracks which sections are complete for auto-save
      - `escalation_flags` (jsonb) - Computed flags indicating professional review needed
      - `ambiguity_score` (integer) - Count of "Not sure" answers
      - `admin_notes` (text) - Internal notes from reviewer
      - `review_delivered_at` (timestamptz) - When review was sent to customer
      - `created_at` (timestamptz) - Order creation time
      - `updated_at` (timestamptz) - Last modification time
  
  2. Security
    - Enable RLS on `paid_compliance_reviews` table
    - Policy for users to read their own reviews (by user_id)
    - Policy for access via unique token (using security definer functions)
    - Admin access via role check on user_profiles
  
  3. Indexes
    - Index on stripe_session_id for quick lookup
    - Index on access_token for form access
    - Index on customer_email for lookup
    - Index on status for admin filtering
    - Index on user_id for user dashboard
*/

-- Create the paid_compliance_reviews table
CREATE TABLE IF NOT EXISTS paid_compliance_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id text UNIQUE NOT NULL,
  stripe_payment_intent_id text,
  customer_email text NOT NULL,
  customer_name text,
  access_token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status text NOT NULL DEFAULT 'form_pending' CHECK (status IN ('form_pending', 'submitted', 'in_review', 'completed', 'escalated')),
  form_data jsonb DEFAULT '{}'::jsonb,
  form_progress jsonb DEFAULT '{"sections_completed": []}'::jsonb,
  escalation_flags jsonb DEFAULT '[]'::jsonb,
  ambiguity_score integer DEFAULT 0,
  admin_notes text,
  review_delivered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_paid_compliance_reviews_stripe_session 
  ON paid_compliance_reviews(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_paid_compliance_reviews_access_token 
  ON paid_compliance_reviews(access_token);

CREATE INDEX IF NOT EXISTS idx_paid_compliance_reviews_email 
  ON paid_compliance_reviews(customer_email);

CREATE INDEX IF NOT EXISTS idx_paid_compliance_reviews_status 
  ON paid_compliance_reviews(status);

CREATE INDEX IF NOT EXISTS idx_paid_compliance_reviews_user_id 
  ON paid_compliance_reviews(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_paid_compliance_reviews_created_at 
  ON paid_compliance_reviews(created_at DESC);

-- Enable RLS
ALTER TABLE paid_compliance_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own reviews (linked by user_id)
CREATE POLICY "Users can read own reviews"
  ON paid_compliance_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update their own reviews (for form submission)
CREATE POLICY "Users can update own reviews"
  ON paid_compliance_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can read all reviews
CREATE POLICY "Admins can read all reviews"
  ON paid_compliance_reviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Admins can update all reviews
CREATE POLICY "Admins can update all reviews"
  ON paid_compliance_reviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_paid_compliance_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_paid_compliance_reviews_updated_at ON paid_compliance_reviews;
CREATE TRIGGER trigger_paid_compliance_reviews_updated_at
  BEFORE UPDATE ON paid_compliance_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_paid_compliance_reviews_updated_at();

-- Create function to get review by access token (for guest access)
CREATE OR REPLACE FUNCTION get_review_by_token(token text)
RETURNS SETOF paid_compliance_reviews
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM paid_compliance_reviews
  WHERE access_token = token
  LIMIT 1;
$$;

-- Create function to update review by access token (for guest form submission)
CREATE OR REPLACE FUNCTION update_review_by_token(
  token text,
  new_form_data jsonb,
  new_form_progress jsonb,
  new_status text DEFAULT NULL,
  new_escalation_flags jsonb DEFAULT NULL,
  new_ambiguity_score integer DEFAULT NULL
)
RETURNS paid_compliance_reviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result paid_compliance_reviews;
BEGIN
  UPDATE paid_compliance_reviews
  SET 
    form_data = COALESCE(new_form_data, form_data),
    form_progress = COALESCE(new_form_progress, form_progress),
    status = COALESCE(new_status, status),
    escalation_flags = COALESCE(new_escalation_flags, escalation_flags),
    ambiguity_score = COALESCE(new_ambiguity_score, ambiguity_score),
    updated_at = now()
  WHERE access_token = token
  RETURNING * INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_review_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_review_by_token(text, jsonb, jsonb, text, jsonb, integer) TO anon, authenticated;
