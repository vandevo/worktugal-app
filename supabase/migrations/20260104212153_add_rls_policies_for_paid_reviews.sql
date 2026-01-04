/*
  # Add RLS policies for paid_compliance_reviews
  
  1. Security
    - Users can read their own reviews
    - Users can update their own reviews (for form progress)
    - Admins can read all reviews
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'paid_compliance_reviews' 
    AND policyname = 'Users can read own reviews'
  ) THEN
    CREATE POLICY "Users can read own reviews"
      ON paid_compliance_reviews
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'paid_compliance_reviews' 
    AND policyname = 'Users can update own reviews'
  ) THEN
    CREATE POLICY "Users can update own reviews"
      ON paid_compliance_reviews
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can read own paid review status'
  ) THEN
    CREATE POLICY "Users can read own paid review status"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;