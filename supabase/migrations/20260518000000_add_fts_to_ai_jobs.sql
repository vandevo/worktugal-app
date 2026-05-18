-- Full-text search on ai_jobs
-- Enables: SELECT * FROM ai_jobs WHERE fts @@ plainto_tsquery('english', 'machine learning portugal')
-- Supabase client: .textSearch('fts', query, { type: 'plain' })

ALTER TABLE ai_jobs
ADD COLUMN IF NOT EXISTS fts tsvector GENERATED ALWAYS AS (
  to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(description_plain, '') || ' ' ||
    coalesce(company_slug, '') || ' ' ||
    coalesce(location, '') || ' ' ||
    coalesce(department, '')
  )
) STORED;

CREATE INDEX IF NOT EXISTS ai_jobs_fts_idx ON ai_jobs USING gin(fts);
