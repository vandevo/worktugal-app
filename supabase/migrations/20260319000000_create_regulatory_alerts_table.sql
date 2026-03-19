-- Regulatory alerts log
-- Populated by Parallel.ai monitor webhook → Make.com scenario 8891111
-- Each row = one detected change on an official Portuguese government source
-- status: new → reviewed → action_taken | false_positive
-- content_drafted: flag to track if the alert has been turned into a blog/community post

CREATE TABLE IF NOT EXISTS regulatory_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id text NOT NULL,
  topic text NOT NULL,
  rule text NOT NULL,
  source_url text,
  summary text,
  detected_at timestamptz,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'action_taken', 'false_positive')),
  notes text,
  content_drafted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_regulatory_alerts_status ON regulatory_alerts(status);
CREATE INDEX IF NOT EXISTS idx_regulatory_alerts_rule ON regulatory_alerts(rule);
CREATE INDEX IF NOT EXISTS idx_regulatory_alerts_created_at ON regulatory_alerts(created_at DESC);

ALTER TABLE regulatory_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users can manage alerts"
  ON regulatory_alerts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service role can insert alerts"
  ON regulatory_alerts
  FOR INSERT
  TO service_role
  WITH CHECK (true);
