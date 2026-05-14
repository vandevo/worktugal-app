const EU_KEYWORDS = [
  'uk', 'united kingdom', 'london', 'england', 'great britain',
  'germany', 'berlin', 'munich', 'hamburg', 'cologne', 'frankfurt',
  'france', 'paris', 'lyon', 'nice',
  'netherlands', 'amsterdam', 'rotterdam', 'utrecht', 'hague',
  'spain', 'madrid', 'barcelona', 'valencia',
  'portugal', 'lisbon', 'porto', 'braga',
  'italy', 'milan', 'rome', 'turin',
  'ireland', 'dublin', 'cork', 'galway',
  'switzerland', 'zurich', 'geneva', 'basel',
  'sweden', 'stockholm', 'gothenburg',
  'denmark', 'copenhagen', 'aarhus',
  'finland', 'helsinki', 'espoo',
  'norway', 'oslo', 'bergen',
  'belgium', 'brussels', 'antwerp', 'ghent',
  'austria', 'vienna', 'salzburg', 'linz',
  'poland', 'warsaw', 'krakow', 'wroclaw',
  'czech', 'prague', 'brno',
  'hungary', 'budapest',
  'romania', 'bucharest', 'cluj',
  'bulgaria', 'sofia',
  'greece', 'athens',
  'europe', 'eu',
  'remote', 'global', 'anywhere',
];

const DROP_DEPTS = [
  'sales', 'marketing', 'hr', 'people', 'finance', 'legal',
  'support', 'customer success', 'professional services',
  'go to market', 'communications', 'hq management',
  'recruiting', 'safeguard', 'trust & safety', 'business',
  'field engineering', 'solutions', 'consulting', 'corporate',
];

function isEuLocation(l) {
  return EU_KEYWORDS.some(k => l.includes(k));
}

function isTechDept(d) {
  if (!d) return true;
  const lower = d.toLowerCase();
  return !DROP_DEPTS.some(bad => lower.includes(bad));
}

function seniority(t) {
  const l = t.toLowerCase();
  if (/vp |vice president|director|head of|chief|cto|cfo|svp|evp/.test(l)) return 'executive';
  if (/principal|staff|lead|manager|architect/.test(l)) return 'lead';
  if (/senior| sr[ .]/.test(l)) return 'senior';
  if (/junior|jr |intern|graduate|trainee/.test(l)) return 'entry';
  return 'mid';
}

function slug(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function stripHtml(html) {
  return html ? html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : null;
}

const CURRENCIES = { '€': 'EUR', '$': 'USD', '£': 'GBP', '€': 'EUR' };
const CURR_NAMES = { 'eur': 'EUR', 'usd': 'USD', 'gbp': 'GBP', 'euro': 'EUR', 'dollar': 'USD', 'pound': 'GBP' };

function extractSalary(text) {
  if (!text) return {};
  const t = text.toLowerCase().substring(0, 10000);
  // match: €80k - €120k, $100,000 - $150,000, EUR 80k to 120k, etc.
  const m = t.match(/(?:([€$£])|(eur|usd|gbp|euro|dollar|pound))\s*([\d,.]+)(?:\s*k)?\s*(?:–|-|to)\s*(?:([€$£])?\s*|(eur|usd|gbp|euro|dollar|pound)\s*)?([\d,.]+)(?:\s*k)?/i);
  if (!m) return {};

  const sym = m[1] || m[4] || '';
  const name = (m[2] || m[5] || '').toLowerCase();
  const currency = CURRENCIES[sym] || CURR_NAMES[name] || null;
  const isK = t.substring(Math.max(0, m.index + m[0].length - 20), m.index + m[0].length).toLowerCase().includes('k') || m[0].toLowerCase().includes('k');
  const mult = isK ? 1000 : 1;
  const min = parseFloat(m[3].replace(/[.,]/g, '')) * mult;
  const max = parseFloat(m[6].replace(/[.,]/g, '')) * mult;
  if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) return {};
  // sanity: reject anything under 15K (definitely not a real tech salary)
  if (min < 15000 || max < 15000) return {};
  return { salary_min: Math.round(min), salary_max: Math.round(max), salary_currency: currency };
}

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
  { name: 'Stability AI', slug: 'stability-ai', ats: 'greenhouse', board: 'stabilityai' },
  { name: 'Scale AI', slug: 'scale-ai', ats: 'greenhouse', board: 'scaleai' },
  { name: 'Palantir', slug: 'palantir', ats: 'lever', board: 'palantir' },
  { name: 'OpenAI', slug: 'openai', ats: 'ashby', board: 'openai' },
  { name: 'Notion', slug: 'notion', ats: 'ashby', board: 'notion' },
  { name: 'Linear', slug: 'linear', ats: 'ashby', board: 'linear' },
  { name: 'Cursor', slug: 'cursor', ats: 'ashby', board: 'cursor' },
  { name: 'Replit', slug: 'replit', ats: 'ashby', board: 'replit' },
  { name: 'Vanta', slug: 'vanta', ats: 'ashby', board: 'vanta' },
  { name: 'Cohere', slug: 'cohere', ats: 'ashby', board: 'cohere' },
];

const SUPABASE_URL = 'https://jbmfneyofhqlwnnfuqbd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibWZuZXlvZmhxbHdubmZ1cWJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjgzOTI3OCwiZXhwIjoyMDY4NDE1Mjc4fQ.N5lj7ffzoItkZir09mBxRubUGnktAtVSsOgXizJ7nlg';

const TELEGRAM_TOKEN = '7495029105:AAHls_gfBUfhLFQjPyWgUAVmB4pSAeYjqO4';
const TELEGRAM_CHAT_ID = '2099132460';

export default {
  async scheduled(event, env, ctx) {
    const r = await run(env);
    await sendTelegram(r);
    console.log(JSON.stringify(r));
  },

  async fetch(request, env) {
    if (request.method === 'GET' || request.url.includes('/trigger')) {
      const r = await run(env);
      await sendTelegram(r);
      return Response.json(r);
    }
    return new Response('GET or POST /trigger', { status: 400 });
  },
};

async function run(env) {
  const out = { companies: 0, fetched: 0, kept: 0, upserted: 0, errors: [] };

  for (const c of COMPANIES) {
    out.companies++;
    try {
      const raw = await fetchJobs(c);
      out.fetched += raw.length;

      const good = raw
        .map(j => norm(j, c))
        .filter(j => j && isTechDept(j.department) && j.is_eu_eligible);

      out.kept += good.length;

      if (good.length > 0) {
        await upsert(good);
        out.upserted += good.length;
      }
    } catch (e) {
      out.errors.push({ company: c.slug, error: e.message });
    }
  }

  return out;
}

async function fetchJobs(c) {
  if (c.ats === 'greenhouse') {
    const r = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${c.board}/jobs?content=true`,
      { headers: { 'User-Agent': 'Worktugal/1.0' } }
    );
    if (!r.ok) throw new Error(`GH ${r.status}`);
    const d = await r.json();
    return d.jobs || [];
  }

  if (c.ats === 'lever') {
    const r = await fetch(
      `https://api.lever.co/v0/postings/${c.board}?mode=json`,
      { headers: { 'User-Agent': 'Worktugal/1.0' } }
    );
    if (!r.ok) throw new Error(`Lever ${r.status}`);
    return await r.json();
  }

  if (c.ats === 'ashby') {
    const r = await fetch(
      `https://api.ashbyhq.com/posting-api/job-board/${c.board}?includeCompensation=true`,
      { headers: { 'User-Agent': 'Worktugal/1.0' } }
    );
    if (!r.ok) throw new Error(`Ashby ${r.status}`);
    const d = await r.json();
    return d.jobs || [];
  }

  return [];
}

function norm(j, c) {
  if (c.ats === 'greenhouse') {
    const title = j.title || '';
    if (!title) return null;
    const dept = j.departments?.[0]?.name || null;
    const loc = j.location?.name || 'Remote';
    const ll = loc.toLowerCase();
    const eu = isEuLocation(ll);
    const sen = seniority(title);
    const desc = stripHtml(j.content);
    const sal = extractSalary(desc || j.title + ' ' + (dept || ''));
    return {
      company_slug: c.slug, title, slug: slug(title) + '-' + (j.id || '0'), location: loc,
      locations: [loc], apply_url: j.absolute_url || '', department: dept,
      is_eu_eligible: eu, seniority: sen,
      d8_eligible: eu && (sen === 'senior' || sen === 'lead' || sen === 'executive'),
      source: 'ats_feed', source_ats_feed: 'greenhouse', is_active: true,
      description_plain: desc, ...sal,
      updated_at: new Date().toISOString(),
    };
  }

  if (c.ats === 'lever') {
    const title = j.text || j.title || '';
    if (!title) return null;
    const dept = j.categories?.team || j.department || null;
    const loc = j.categories?.location || j.location || 'Remote';
    const ll = loc.toLowerCase();
    const eu = isEuLocation(ll);
    const sen = seniority(title);
    const idHash = (j.id || (j.applyUrl || '').slice(-8) || '0').toString();
    const desc = j.descriptionPlain || null;
    const sal = extractSalary(desc || title + ' ' + (dept || ''));
    return {
      company_slug: c.slug, title, slug: slug(title) + '-' + idHash, location: loc,
      locations: [loc], apply_url: j.applyUrl || j.hostedUrl || '', department: dept,
      is_eu_eligible: eu, seniority: sen,
      d8_eligible: eu && (sen === 'senior' || sen === 'lead' || sen === 'executive'),
      source: 'ats_feed', source_ats_feed: 'lever', is_active: true,
      description_plain: desc, ...sal,
      updated_at: new Date().toISOString(),
    };
  }

  if (c.ats === 'ashby') {
    const title = j.title || '';
    if (!title) return null;
    const dept = j.department || j.team || null;
    const loc = j.location || j.address?.postalAddress?.addressLocality || 'Remote';
    const country = j.address?.postalAddress?.addressCountry || '';
    const ll = (loc + ' ' + country).toLowerCase();
    const eu = isEuLocation(ll) || (country.toLowerCase().includes('european') || country.toLowerCase().includes('germany') || country.toLowerCase().includes('uk') || country.toLowerCase().includes('united kingdom') || country.toLowerCase().includes('france') || country.toLowerCase().includes('netherlands') || country.toLowerCase().includes('spain') || country.toLowerCase().includes('ireland'));
    const sen = seniority(title);
    const desc = j.descriptionPlain || null;
    const sal = extractSalary(desc || title + ' ' + (dept || ''));
    return {
      company_slug: c.slug, title, slug: slug(title) + '-' + (j.id || '0').slice(0, 8), location: loc,
      locations: j.secondaryLocations ? [loc, ...j.secondaryLocations] : [loc],
      apply_url: j.applyUrl || j.jobUrl || '', department: dept,
      is_eu_eligible: eu, seniority: sen,
      d8_eligible: eu && (sen === 'senior' || sen === 'lead' || sen === 'executive'),
      source: 'ats_feed', source_ats_feed: 'ashby', is_active: true,
      description_plain: desc, ...sal,
      updated_at: new Date().toISOString(),
    };
  }

  return null;
}

async function sendTelegram(r) {
  if (!r || r.upserted === 0) return;
  const errList = r.errors.map(e => `${e.company}: ${e.error}`).join('\n');
  const msg = `🤖 AI Jobs Pipeline — ${new Date().toISOString().slice(0, 10)}\n- ${r.companies} companies checked\n- ${r.fetched} raw jobs fetched\n- ${r.kept} EU jobs kept\n- ${r.upserted} upserted to DB${errList ? '\n\n⚠ Errors:\n' + errList : '\n- No errors'}`;
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg }),
  });
  const body = await res.text();
  if (!res.ok) console.error('Telegram send failed:', body);
}

async function upsert(jobs) {
  const chunkSize = 100;
  for (let i = 0; i < jobs.length; i += chunkSize) {
    const chunk = jobs.slice(i, i + chunkSize).map(j => ({
      company_slug: j.company_slug, title: j.title, slug: j.slug,
      location: j.location, locations: j.locations,
      apply_url: j.apply_url, department: j.department,
      is_eu_eligible: j.is_eu_eligible, seniority: j.seniority,
      d8_eligible: j.d8_eligible, source: j.source,
      source_ats_feed: j.source_ats_feed, is_active: j.is_active,
      description_plain: j.description_plain || null,
      salary_min: j.salary_min || null, salary_max: j.salary_max || null,
      salary_currency: j.salary_currency || null,
      updated_at: j.updated_at,
    }));

    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_jobs?on_conflict=company_slug,slug`,
      {
        method: 'POST',
        headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(chunk),
      }
    );

    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Supabase ${r.status}: ${t.slice(0, 200)}`);
    }
  }
}
