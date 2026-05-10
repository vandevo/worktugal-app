-- Create ai_companies table
create table if not exists public.ai_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  website text,
  career_page text,
  ats_platform text check (ats_platform in ('greenhouse', 'lever', 'ashby', 'workday', 'other')),
  funding_stage text,
  total_funding text,
  employee_count int,
  headquarters text,
  eu_offices text[],
  remote_policy text check (remote_policy in ('fully_remote', 'hybrid', 'on_site', 'relocation_required')),
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create ai_jobs table
create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.ai_companies(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  department text,
  location text not null,
  locations text[],
  remote_policy text check (remote_policy in ('eu_remote', 'portugal_only', 'global_remote', 'hybrid', 'on_site', 'relocation')),
  visa_sponsorship boolean default false,
  d8_eligible boolean default false,
  salary_min int,
  salary_max int,
  salary_currency text default 'EUR',
  employment_type text check (employment_type in ('full_time', 'part_time', 'contract', 'internship')),
  seniority text check (seniority in ('entry', 'mid', 'senior', 'lead', 'executive')),
  skills text[],
  apply_url text not null,
  source text check (source in ('ats_feed', 'manual', 'stripe_post')),
  source_ats_feed text,
  is_featured boolean default false,
  is_active boolean default true,
  posted_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_ai_jobs_active on public.ai_jobs(is_active) where is_active = true;
create index if not exists idx_ai_jobs_remote on public.ai_jobs(remote_policy);
create index if not exists idx_ai_jobs_location on public.ai_jobs using gin(locations);
create index if not exists idx_ai_jobs_skills on public.ai_jobs using gin(skills);
create index if not exists idx_ai_jobs_company on public.ai_jobs(company_id);
create index if not exists idx_ai_jobs_posted on public.ai_jobs(posted_at desc);
create index if not exists idx_ai_jobs_salary on public.ai_jobs(salary_max desc);

-- RLS: Enable
alter table public.ai_companies enable row level security;
alter table public.ai_jobs enable row level security;

-- RLS policies for ai_companies
create policy "Anyone can view companies" on public.ai_companies
  for select using (true);

create policy "Authenticated can insert companies" on public.ai_companies
  for insert with check (auth.role() = 'authenticated');

create policy "Service role can manage companies" on public.ai_companies
  for all using (true) with check (true);

-- RLS policies for ai_jobs
create policy "Anyone can view active jobs" on public.ai_jobs
  for select using (is_active = true);

create policy "Authenticated can insert jobs" on public.ai_jobs
  for insert with check (auth.role() = 'authenticated');

create policy "Service role can manage jobs" on public.ai_jobs
  for all using (true) with check (true);
