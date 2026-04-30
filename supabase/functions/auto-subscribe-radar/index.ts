import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const listmonkUsername = Deno.env.get('LISTMONK_USERNAME');
const listmonkPassword = Deno.env.get('LISTMONK_PASSWORD');
const listmonkUrl = Deno.env.get('LISTMONK_URL');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

async function getListmonkSession(): Promise<string | null> {
  if (!listmonkUrl || !listmonkUsername || !listmonkPassword) return null;

  try {
    const loginRes = await fetch(`${listmonkUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: listmonkUsername, password: listmonkPassword }),
      redirect: 'manual',
    });

    const setCookie = loginRes.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(/session=([^;]+)/);
      if (match) return match[1];
    }
    console.error('Listmonk login failed:', loginRes.status);
    return null;
  } catch (e) {
    console.error('Listmonk login error:', e);
    return null;
  }
}

async function subscribeToListmonk(email: string, sessionCookie: string, source: string): Promise<boolean> {
  const radarListId = Deno.env.get('LISTMONK_RADAR_LIST_ID');
  if (!radarListId || !listmonkUrl) return false;

  try {
    const res = await fetch(`${listmonkUrl}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,
      },
      body: JSON.stringify({
        email,
        name: '',
        status: 'enabled',
        lists: [parseInt(radarListId, 10)],
        attribs: { source },
        preconfirm_subscriptions: true,
      }),
    });

    if (res.ok || res.status === 409) {
      // 409 = already subscribed — not an error
      return true;
    }
    console.error('Listmonk subscribe failed:', res.status);
    return false;
  } catch (e) {
    console.error('Listmonk subscribe error:', e);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let email: string | undefined;
  let userId: string | undefined;
  let source: string;

  // Try auth header first (Google OAuth path)
  const authHeader = req.headers.get('Authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    email = user.email;
    userId = user.id;
    source = 'google_signup';
  } else {
    // Email-only path (no auth)
    let body: { email?: string };
    try {
      body = await req.json();
      email = body.email;
      source = 'radar_landing';
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid email required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Check if already subscribed in radar_subscribers
  const { data: existing } = await supabase
    .from('radar_subscribers')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return new Response(JSON.stringify({ ok: true, already_subscribed: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Insert into radar_subscribers
  const insertData: Record<string, unknown> = {
    email,
    source,
    subscribed_at: new Date().toISOString(),
  };
  if (userId) {
    insertData.user_id = userId;
  }

  const { error: insertError } = await supabase.from('radar_subscribers').insert([insertData]);

  if (insertError) {
    console.error('Insert error:', insertError);
    if (insertError.code === '23505') {
      return new Response(JSON.stringify({ ok: true, already_subscribed: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Subscribe to Listmonk using session cookie login
  const sessionCookie = await getListmonkSession();
  if (sessionCookie) {
    await subscribeToListmonk(email, sessionCookie, source);
  } else {
    console.warn('Listmonk session unavailable — skipping Listmonk subscription');
  }

  return new Response(
    JSON.stringify({ ok: true, subscribed: true, email }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
});
