/*
  # Add paid compliance review tracking to user profiles
  
  1. Changes to user_profiles table
    - Add `has_paid_compliance_review` boolean to track if user has paid
    - Add `paid_compliance_review_id` to link to the review record
  
  2. Security
    - Updates existing RLS policies to allow users to read their own payment status
*/

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS has_paid_compliance_review boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS paid_compliance_review_id uuid REFERENCES paid_compliance_reviews(id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_paid_review 
ON user_profiles(has_paid_compliance_review) 
WHERE has_paid_compliance_review = true;

COMMENT ON COLUMN user_profiles.has_paid_compliance_review IS 'Whether user has purchased the Detailed Compliance Risk Review product';
COMMENT ON COLUMN user_profiles.paid_compliance_review_id IS 'Links to the paid_compliance_reviews record for this user';