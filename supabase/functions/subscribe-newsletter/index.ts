import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const listmonkUsername = Deno.env.get('LISTMONK_USERNAME');
const listmonkPassword = Deno.env.get('LISTMONK_PASSWORD');
const listmonkUrl = Deno.env.get('LISTMONK_URL');
const newsletterListId = Deno.env.get('LISTMONK_NEWSLETTER_LIST_ID');

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
  const listId = newsletterListId ? parseInt(newsletterListId, 10) : 1;
  if (!listmonkUrl) return false;
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
        lists: [listId],
        attribs: { source },
        preconfirm_subscriptions: true,
      }),
    });
    if (res.ok || res.status === 409) return true;
    console.error('Listmonk subscribe failed:', res.status);
    return false;
  } catch (e) {
    console.error('Listmonk subscribe error:', e);
    return false;
  }
}

async function sendWelcomeEmail(email: string): Promise<boolean> {
  if (!resendApiKey) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Worktugal <hello@worktugal.com>',
        reply_to: 'hello@worktugal.com',
        to: [email],
        subject: 'You are in. AI jobs land in your inbox every Monday.',
        html: `<div style="max-width:560px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;">

<p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Hey,</p>

<p style="font-size:15px;line-height:1.7;margin-bottom:16px;">You signed up for the Worktugal newsletter. Every Monday, you get a roundup of the most important moves in European AI hiring.</p>

<p style="font-size:15px;line-height:1.7;margin-bottom:16px;">What's in it:</p>

<p style="font-size:14px;line-height:1.7;color:#444;margin-bottom:8px;">New AI job listings across Europe, immigration and visa changes that affect tech talent, company expansions and funding rounds that signal where hiring is heading, and analysis you won't find in the headlines.</p>

<div style="margin:32px 0;"></div>

<p style="font-size:15px;line-height:1.7;">Van<br>Founder, Worktugal</p>
<p style="font-size:13px;color:#888;margin-top:6px;">P.S. Reply to this email anytime. I read every message.</p>

<p style="font-size:11px;color:#bbb;margin-top:40px;border-top:1px solid #f0f0f0;padding-top:16px;line-height:1.6;">Worktugal curates AI job openings in Europe. You received this because you subscribed at app.worktugal.com. If you no longer want these emails, one click and you are out.</p>

</div>`,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('Resend welcome email failed:', res.status, body);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Resend welcome email error:', e);
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

  let body: { email?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { email, name } = body;

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid email required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return new Response(JSON.stringify({ ok: true, already_subscribed: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { error: insertError } = await supabase.from('newsletter_subscribers').insert([{
    email,
    name: name || '',
    subscribed_at: new Date().toISOString(),
    source: 'newsletter_signup',
  }]);

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

  const sessionCookie = await getListmonkSession();
  if (sessionCookie) {
    await subscribeToListmonk(email, sessionCookie, 'newsletter_signup');
  } else {
    console.warn('Listmonk session unavailable — skipping Listmonk subscription');
  }

  await sendWelcomeEmail(email);

  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
  if (botToken && chatId) {
    const displayName = name || email.split('@')[0];
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `<b>Newsletter subscriber</b>\n\n<b>Name:</b> ${displayName}\n<b>Email:</b> ${email}\n<b>Source:</b> Landing page`,
        parse_mode: 'HTML',
      }),
    }).catch(() => {});
  }

  return new Response(
    JSON.stringify({ ok: true, subscribed: true, email }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
});
