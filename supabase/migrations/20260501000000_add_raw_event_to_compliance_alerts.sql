ALTER TABLE compliance_alerts ADD COLUMN IF NOT EXISTS raw_event JSONB;
ALTER TABLE compliance_alerts ADD COLUMN IF NOT EXISTS source_urls TEXT[];
