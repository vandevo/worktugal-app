import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    // Ghost fires member.added with payload.member.current
    const member = payload?.member?.current;
    if (!member?.email) {
      return new Response(JSON.stringify({ skip: true, reason: 'no member email' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const email = member.email.toLowerCase().trim();
    const name = member.name || '';

    const listmonkUrl = Deno.env.get('LISTMONK_URL');
    const listmonkUsername = Deno.env.get('LISTMONK_USERNAME');
    const listmonkPassword = Deno.env.get('LISTMONK_PASSWORD');
    const listId = parseInt(Deno.env.get('LISTMONK_BLOG_LIST_ID') ?? '5');

    if (!listmonkUrl || !listmonkUsername || !listmonkPassword) {
      console.error('Listmonk env vars not set');
      return new Response(JSON.stringify({ error: 'Listmonk not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Login to get session
    const loginRes = await fetch(`${listmonkUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${encodeURIComponent(listmonkUsername)}&password=${encodeURIComponent(listmonkPassword)}`,
      redirect: 'manual',
    });
    const setCookie = loginRes.headers.get('set-cookie') ?? '';
    const sessionMatch = setCookie.match(/session=([^;]+)/);
    if (!sessionMatch) {
      console.error('Listmonk login failed');
      return new Response(JSON.stringify({ error: 'Listmonk login failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const sessionCookie = `session=${sessionMatch[1]}`;

    // Subscribe to Blog Subscribers list
    const subRes = await fetch(`${listmonkUrl}/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
      body: JSON.stringify({
        email,
        name,
        status: 'enabled',
        lists: [listId],
        attribs: { source: 'ghost_blog' },
        preconfirm_subscriptions: true,
      }),
    });

    const subBody = await subRes.text();

    if (subRes.ok) {
      console.log('Ghost member added to Listmonk:', email);
    } else if (subBody.includes('already')) {
      console.log('Already in Listmonk:', email);
    } else {
      console.error('Listmonk subscribe failed:', subRes.status, subBody);
    }

    // Telegram alert
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `<b>New blog subscriber</b>\n\n<b>Name:</b> ${name || 'Unknown'}\n<b>Email:</b> ${email}\n<b>List:</b> Blog Subscribers (Listmonk #${listId})`,
          parse_mode: 'HTML',
        }),
      }).catch(() => {});
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('ghost-member-webhook error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
