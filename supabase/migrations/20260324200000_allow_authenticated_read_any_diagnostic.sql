-- Results page is publicly accessible by link.
-- Authenticated users were blocked from viewing diagnostics they don't own
-- because the existing SELECT policy requires user_id = auth.uid().
-- This adds an open read policy for authenticated users (mirrors the anon policy).

CREATE POLICY "Allow authenticated to read any diagnostic by id"
  ON public.compliance_diagnostics
  FOR SELECT
  TO authenticated
  USING (true);
