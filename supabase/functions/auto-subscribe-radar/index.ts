import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get the user from the Authorization header (JWT)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('radar_subscribers')
    .select('id')
    .eq('email', user.email)
    .single();

  if (existing) {
    return new Response(JSON.stringify({ ok: true, already_subscribed: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Subscribe the user
  const { error: insertError } = await supabase.from('radar_subscribers').insert([
    {
      user_id: user.id,
      email: user.email,
      source: 'google_signup',
      subscribed_at: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    console.error('Insert error:', insertError);
    return new Response(JSON.stringify({ error: 'Failed to subscribe', details: insertError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ ok: true, subscribed: true, email: user.email }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
});
