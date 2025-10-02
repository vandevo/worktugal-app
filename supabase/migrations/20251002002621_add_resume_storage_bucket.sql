/*
  # Add Resume Storage Bucket and Update Applications Table

  1. Storage
    - Create 'accountant-resumes' bucket for CV uploads
    - Allow public access for admins to preview
    - Set size limits and file type restrictions

  2. Table Updates
    - Add resume_path column to store storage path
    - Keep resume_url for backward compatibility

  3. Security
    - Anyone (anon/authenticated) can upload during application
    - Only admins can read resumes
    - Only admins can delete resumes
*/

-- Create storage bucket for accountant resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'accountant-resumes',
  'accountant-resumes',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Add resume_path column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accountant_applications' AND column_name = 'resume_path'
  ) THEN
    ALTER TABLE accountant_applications ADD COLUMN resume_path text;
  END IF;
END $$;

-- Storage policies for accountant-resumes bucket

-- Allow anyone to upload resumes (during application submission)
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'accountant-resumes');

-- Only admins can view/download resumes
CREATE POLICY "Admins can view resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'accountant-resumes'
    AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Only admins can delete resumes
CREATE POLICY "Admins can delete resumes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'accountant-resumes'
    AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );