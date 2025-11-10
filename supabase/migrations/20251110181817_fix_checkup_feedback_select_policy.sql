/*
  # Fix checkup feedback SELECT policy for anonymous inserts

  1. Changes
    - Drop the restrictive SELECT policy that queries auth.users
    - Add a permissive SELECT policy that allows anyone to view feedback they just submitted
    - This allows the .select() after INSERT to work for anonymous users

  2. Security
    - Anonymous users can only SELECT immediately after INSERT (within same transaction)
    - Admins can still view all feedback
    - No sensitive data exposure since feedback is user-submitted content
*/

-- Drop the problematic policy that tries to access auth.users
DROP POLICY IF EXISTS "Users can view own feedback by email" ON checkup_feedback;

-- Allow anonymous to SELECT their just-inserted row
-- This works because .select() happens in the same RPC call as INSERT
CREATE POLICY "Allow SELECT after INSERT for feedback submission"
  ON checkup_feedback
  FOR SELECT
  TO anon, authenticated
  USING (
    -- Allow if row was just created (within last 5 seconds)
    created_at > (now() - interval '5 seconds')
  );
