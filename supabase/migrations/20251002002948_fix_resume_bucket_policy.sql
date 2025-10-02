/*
  # Fix Resume Upload Policy

  1. Updates
    - Drop and recreate the upload policy with proper WITH CHECK clause
    - Ensures bucket_id is validated on INSERT
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can upload resumes" ON storage.objects;

-- Recreate with proper WITH CHECK
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'accountant-resumes');