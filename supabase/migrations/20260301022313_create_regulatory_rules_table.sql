-- Create regulatory_rules table
CREATE TABLE IF NOT EXISTS public.regulatory_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_category TEXT NOT NULL, -- 'vat', 'social_security', 'residency', 'nhr', etc.
    rule_id TEXT NOT NULL UNIQUE, -- e.g., 'vat_exemption_threshold'
    title TEXT NOT NULL,
    description TEXT,
    threshold_value NUMERIC,
    threshold_currency TEXT DEFAULT 'EUR',
    penalty_info TEXT,
    deadline_info TEXT,
    source_url TEXT,
    source_name TEXT,
    last_verified_at TIMESTAMPTZ DEFAULT now(),
    effective_from DATE,
    effective_until DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_regulatory_rules_category ON public.regulatory_rules(rule_category);

-- Enable RLS
ALTER TABLE public.regulatory_rules ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so the app can fetch rules)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'regulatory_rules' AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON public.regulatory_rules
            FOR SELECT USING (true);
    END IF;
END
$$;

-- Allow service role (and later our AI function) to manage
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'regulatory_rules' AND policyname = 'Allow service role to manage'
    ) THEN
        CREATE POLICY "Allow service role to manage" ON public.regulatory_rules
            USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_regulatory_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at timestamp
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'tr_regulatory_rules_updated_at'
    ) THEN
        CREATE TRIGGER tr_regulatory_rules_updated_at
            BEFORE UPDATE ON public.regulatory_rules
            FOR EACH ROW
            EXECUTE FUNCTION update_regulatory_rules_updated_at();
    END IF;
END
$$;
