-- Allow authenticated users to insert their own diagnostics
-- Previously only anon role had INSERT access, blocking logged-in users

CREATE POLICY "Allow authenticated insert for diagnostic submissions"
  ON public.compliance_diagnostics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
