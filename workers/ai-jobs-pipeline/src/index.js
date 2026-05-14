import { classifySeniority, isEuLocation, isTechDept, makeSlug } from './utils';

const COMPANIES = [
  { name: 'Anthropic', slug: 'anthropic', ats: 'greenhouse', board: 'anthropic' },
  { name: 'GitLab', slug: 'gitlab', ats: 'greenhouse', board: 'gitlab' },
  { name: 'Databricks', slug: 'databricks', ats: 'greenhouse', board: 'databricks' },
  { name: 'Mistral AI', slug: 'mistral-ai', ats: 'lever', board: 'mistral' },
  { name: 'Stripe', slug: 'stripe', ats: 'greenhouse', board: 'stripe' },
  { name: 'Figma', slug: 'figma', ats: 'greenhouse', board: 'figma' },
  { name: 'xAI', slug: 'xai', ats: 'greenhouse', board: 'xai' },
  { name: 'Datadog', slug: 'datadog', ats: 'greenhouse', board: 'datadog' },
  { name: 'Cloudflare', slug: 'cloudflare', ats: 'greenhouse', board: 'cloudflare' },
  { name: 'Vercel', slug: 'vercel', ats: 'greenhouse', board: 'vercel' },
  { name: 'Tailscale', slug: 'tailscale', ats: 'greenhouse', board: 'tailscale' },
  { name: 'Grafana Labs', slug: 'grafana-labs', ats: 'greenhouse', board: 'grafanalabs' },
  { name: 'Neon', slug: 'neon', ats: 'greenhouse', board: 'neondatabase' },
  { name: 'Retool', slug: 'retool', ats: 'greenhouse', board: 'retool' },
  { name: 'Stability AI', slug: 'stability-ai', ats: 'greenhouse', board: 'stabilityai' },
  { name: 'Scale AI', slug: 'scale-ai', ats: 'greenhouse', board: 'scaleai' },
  { name: 'Snyk', slug: 'snyk', ats: 'greenhouse', board: 'snyk' },
  { name: 'Palantir', slug: 'palantir', ats: 'lever', board: 'palantir' },
];

const SUPABASE_URL = 'https://jbmfneyofhqlwnnfuqbd.supabase.co';

export default {
  async scheduled(event, env, ctx) {
    const results = await runPipeline(env);
    console.log('Pipeline complete:', JSON.stringify(results));
  },

  async fetch(request, env) {
    if (request.method === 'GET' || (request.method === 'POST' && new URL(request.url).pathname === '/trigger')) {
      const results = await runPipeline(env);
      return Response.json(results);
    }
    return new Response('POST /trigger to run', { status: 400 });
  },
};

async function runPipeline(env) {
  const total = { companies: 0, jobsFetched: 0, jobsKept: 0, jobsUpserted: 0, errors: [] };

  for (const company of COMPANIES) {
    total.companies++;
    try {
      const rawJobs = await fetchJobs(company);
      total.jobsFetched += rawJobs.length;

      const kept = rawJobs
        .map(j => normalizeJob(j, company))
        .filter(j => j && isTechDept(j.department) && j.is_eu_eligible);

      total.jobsKept += kept.length;

      if (kept.length > 0) {
        await upsertJobs(kept, env);
        total.jobsUpserted += kept.length;
      }
    } catch (err) {
      total.errors.push({ company: company.slug, error: err.message });
      console.error(`[${company.slug}] Failed:`, err.message);
    }
  }

  return total;
}

async function fetchJobs(company) {
  if (company.ats === 'greenhouse') {
    const url = `https://boards-api.greenhouse.io/v1/boards/${company.board}/jobs?content=true`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Worktugal/1.0' } });
    if (!res.ok) throw new Error(`Greenhouse ${res.status}: ${res.statusText}`);
    const data = await res.json();
    return data.jobs || [];
  }

  if (company.ats === 'lever') {
    const url = `https://api.lever.co/v0/postings/${company.board}?mode=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Worktugal/1.0' } });
    if (!res.ok) throw new Error(`Lever ${res.status}: ${res.statusText}`);
    return await res.json();
  }

  return [];
}

function normalizeJob(job, company) {
  if (company.ats === 'greenhouse') {
    const title = job.title || '';
    if (!title) return null;

    const department = job.departments?.[0]?.name || null;
    const location = job.location?.name || 'Remote';
    const locLower = location.toLowerCase();
    const isEu = isEuLocation(locLower);
    const seniority = classifySeniority(title);
    const slug = makeSlug(title);

    return {
      company_slug: company.slug,
      title,
      slug,
      location,
      locations: [location],
      apply_url: job.absolute_url || '',
      department,
      is_eu_eligible: isEu,
      seniority,
      d8_eligible: isEu && (seniority === 'senior' || seniority === 'lead' || seniority === 'executive'),
      source: 'ats_feed',
      source_ats_feed: 'greenhouse',
      is_active: true,
      updated_at: new Date().toISOString(),
    };
  }

  if (company.ats === 'lever') {
    const title = job.text || job.title || '';
    if (!title) return null;

    const department = job.categories?.team || job.department || null;
    const location = job.categories?.location || job.location || 'Remote';
    const locLower = location.toLowerCase();
    const isEu = isEuLocation(locLower);
    const seniority = classifySeniority(title);
    const slug = makeSlug(title);

    return {
      company_slug: company.slug,
      title,
      slug,
      location,
      locations: [location],
      apply_url: job.applyUrl || job.hostedUrl || job.apply_url || '',
      department,
      is_eu_eligible: isEu,
      seniority,
      d8_eligible: isEu && (seniority === 'senior' || seniority === 'lead' || seniority === 'executive'),
      source: 'ats_feed',
      source_ats_feed: 'lever',
      is_active: true,
      updated_at: new Date().toISOString(),
    };
  }

  return null;
}

async function upsertJobs(jobs, env) {
  const body = jobs.map(j => ({
    ...j,
    body: JSON.stringify(j),
  })).map(j => ({
    company_slug: j.company_slug,
    title: j.title,
    slug: j.slug,
    location: j.location,
    locations: j.locations,
    apply_url: j.apply_url,
    department: j.department,
    is_eu_eligible: j.is_eu_eligible,
    seniority: j.seniority,
    d8_eligible: j.d8_eligible,
    source: j.source,
    source_ats_feed: j.source_ats_feed,
    is_active: j.is_active,
    updated_at: j.updated_at,
  }));

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ai_jobs?on_conflict=company_slug,slug`,
    {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${res.status}: ${text}`);
  }
}
