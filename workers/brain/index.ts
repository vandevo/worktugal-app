export interface Env {
  BRAIN_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  N8N_WEBHOOK: string;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function err(message: string, status = 400) {
  return json({ error: message }, status);
}

function authorized(request: Request, env: Env): boolean {
  const auth = request.headers.get('Authorization') ?? '';
  return auth === `Bearer ${env.BRAIN_API_KEY}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (!authorized(request, env)) {
      return err('Unauthorized', 401);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    // POST /memory — write via n8n (handles embedding)
    if (request.method === 'POST' && path === '/memory') {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return err('Invalid JSON body');
      }

      const res = await fetch(env.N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      return json(data, res.status);
    }

    // GET /memory — read with optional filters
    if (request.method === 'GET' && path === '/memory') {
      const category = url.searchParams.get('category');
      const key = url.searchParams.get('key');
      const agent = url.searchParams.get('agent');
      const q = url.searchParams.get('q'); // keyword search
      const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 100);

      const params = new URLSearchParams();
      params.set('select', 'id,category,key,value,agent,tags,created_at,updated_at');
      params.set('order', 'updated_at.desc');
      params.set('limit', String(limit));

      if (category) params.set('category', `eq.${category}`);
      if (key) params.set('key', `eq.${key}`);
      if (agent) params.set('agent', `eq.${agent}`);

      let supabaseUrl = `${env.SUPABASE_URL}/rest/v1/agent_memory?${params}`;

      // Full-text search via GIN index
      if (q) {
        const ftsParam = `fts=phraseto_tsquery.${encodeURIComponent(q)}`;
        supabaseUrl += `&${ftsParam}`;
      }

      const res = await fetch(supabaseUrl, {
        headers: {
          apikey: env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      return json(data, res.status);
    }

    // GET /memory/categories — list distinct categories + counts
    if (request.method === 'GET' && path === '/memory/categories') {
      const res = await fetch(
        `${env.SUPABASE_URL}/rest/v1/agent_memory?select=category&order=category`,
        {
          headers: {
            apikey: env.SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          },
        },
      );
      const rows = (await res.json()) as { category: string }[];
      const counts: Record<string, number> = {};
      for (const r of rows) counts[r.category] = (counts[r.category] ?? 0) + 1;
      return json(counts);
    }

    return err('Not found', 404);
  },
};
