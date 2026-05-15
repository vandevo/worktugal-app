-- research_cache: permanent store for all Parallel AI and manual research outputs
-- Every agent session should write here after deep research so future agents can reuse

create table if not exists public.research_cache (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  query text not null,
  source text not null default 'parallel-ai', -- parallel-ai | manual | windmill
  result text not null,
  tags text[] default '{}',
  session_id text, -- which agent session produced this
  created_at timestamptz not null default now()
);

-- index for fast topic lookups and recency checks
create index research_cache_topic_idx on public.research_cache (topic);
create index research_cache_created_at_idx on public.research_cache (created_at desc);
create index research_cache_tags_idx on public.research_cache using gin (tags);

-- RLS: anyone authenticated can read, only service role can write
alter table public.research_cache enable row level security;

create policy "authenticated users can read research cache"
  on public.research_cache for select
  to authenticated
  using (true);

-- service role bypasses RLS — edge functions and Windmill use this

comment on table public.research_cache is
  'Permanent store for all research outputs. Query before running new Parallel AI research — cache hit < 7 days old means skip the API call.';

comment on column public.research_cache.source is
  'parallel-ai | manual | windmill — which system produced this result';

comment on column public.research_cache.session_id is
  'Optional: YYYY-MM-DD-agent format, e.g. 2026-05-14-claude. Links result to the session that produced it.';
