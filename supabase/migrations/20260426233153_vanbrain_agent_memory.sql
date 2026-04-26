-- VanBrain: central agent memory store
-- pgvector for semantic search, full-text for keyword search
-- Used by all agents (Claude, Qwen, GLM, DeepSeek, Gemini) via n8n + Cloudflare Worker

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS agent_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('identity','project','stack','decision','event','contact','routing')),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  agent TEXT NOT NULL CHECK (agent IN ('claude','qwen','glm','deepseek','gemini','n8n','system')),
  tags TEXT[] DEFAULT '{}',
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE agent_memory ADD CONSTRAINT agent_memory_category_key_unique UNIQUE (category, key);

CREATE INDEX agent_memory_embedding_idx ON agent_memory
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX agent_memory_fts_idx ON agent_memory
  USING gin (to_tsvector('english', key || ' ' || value));

CREATE INDEX agent_memory_category_agent_idx ON agent_memory (category, agent);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_memory_updated_at
  BEFORE UPDATE ON agent_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON agent_memory
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated read" ON agent_memory
  FOR SELECT USING (auth.role() = 'authenticated');
