-- Compliance Diagnostics v2: dual scoring engine (Setup Score + Exposure Index)
-- Table name frozen: compliance_diagnostics. Do not rename.

CREATE TABLE IF NOT EXISTS public.compliance_diagnostics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  country_target text NOT NULL DEFAULT 'portugal',
  setup_score integer NOT NULL,
  exposure_index integer NOT NULL,
  segment text NOT NULL,
  raw_answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  trap_flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  payment_status text NOT NULL DEFAULT 'free',
  diagnostic_version text NOT NULL,
  ruleset_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_compliance_diagnostics_email ON public.compliance_diagnostics(email);
CREATE INDEX idx_compliance_diagnostics_segment ON public.compliance_diagnostics(segment);
CREATE INDEX idx_compliance_diagnostics_user_id ON public.compliance_diagnostics(user_id);
CREATE INDEX idx_compliance_diagnostics_created_at ON public.compliance_diagnostics(created_at DESC);
CREATE INDEX idx_compliance_diagnostics_payment ON public.compliance_diagnostics(payment_status);

COMMENT ON TABLE public.compliance_diagnostics IS 'Stores diagnostic results from the Compliance Diagnostic Engine v2. Each row = one completed diagnostic.';
COMMENT ON COLUMN public.compliance_diagnostics.user_id IS 'Nullable. Linked retroactively when user creates a Supabase Auth account.';
COMMENT ON COLUMN public.compliance_diagnostics.raw_answers IS 'All quiz answers as a single JSON object. Schema evolves with question set.';
COMMENT ON COLUMN public.compliance_diagnostics.trap_flags IS 'Array of triggered trap objects with id, severity, fix, legal_basis.';
COMMENT ON COLUMN public.compliance_diagnostics.diagnostic_version IS 'Version of the question set used, e.g. 2.0';
COMMENT ON COLUMN public.compliance_diagnostics.ruleset_version IS 'Version of the trap rules used, e.g. portugal_v1';

-- RLS: allow anonymous inserts via service role (anon key insert for lead capture)
ALTER TABLE public.compliance_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert for diagnostic submissions"
  ON public.compliance_diagnostics
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow users to read their own diagnostics"
  ON public.compliance_diagnostics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow anon to read diagnostic by id"
  ON public.compliance_diagnostics
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow service role full access"
  ON public.compliance_diagnostics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
