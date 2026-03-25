import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    // Supabase Auth hook payload: { type: 'INSERT', record: { id, email, ... } }
    const email: string = payload?.record?.email || payload?.email;
    const rawMeta = payload?.record?.raw_user_meta_data || payload?.raw_user_meta_data || {};
    const appMeta = payload?.record?.raw_app_meta_data || payload?.raw_app_meta_data || {};
    const name: string = rawMeta?.full_name || rawMeta?.name || '';
    const displayName = name ? name.split(' ')[0] : email?.split('@')[0] ?? 'there';
    const authProvider: string = appMeta?.provider || 'email';

    if (!email) {
      return new Response(JSON.stringify({ skip: true, reason: 'no email' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not set');
      return new Response(JSON.stringify({ skip: true, reason: 'no resend key' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = `<div style="max-width:560px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;">

<p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Hi ${displayName},</p>

<p style="font-size:15px;line-height:1.7;margin-bottom:24px;">Your Worktugal account is live. Your next step is the diagnostic — it takes 2 minutes and tells you exactly where you stand on Portugal compliance.</p>

<div style="background:#f7f7f7;border-left:3px solid #1a1a1a;padding:16px 20px;margin-bottom:28px;font-size:14px;line-height:1.9;">
Your account saves your results automatically.<br>
Re-run the diagnostic whenever your situation changes — new visa, new clients, new country.
</div>

<p style="margin-bottom:32px;">
<a href="https://app.worktugal.com/diagnostic" style="display:inline-block;background:#0F3D2E;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:600;border-radius:8px;font-size:14px;">Run your free diagnostic →</a>
</p>

<p style="font-size:14px;line-height:1.7;color:#444;margin-bottom:16px;">The diagnostic covers tax residency, social security, immigration status, and business structure — the four areas where most people in Portugal get it wrong without realising it.</p>

<div style="margin:32px 0;"></div>

<p style="font-size:14px;font-weight:700;margin-bottom:8px;">Stay ahead of compliance changes.</p>
<p style="font-size:14px;line-height:1.7;color:#444;margin-bottom:16px;">Portuguese regulations change more often than people expect — AIMA deadlines, SS contribution rules, IRS filing windows. I post updates as they happen, with no noise.</p>
<p style="margin-bottom:32px;">
<a href="https://t.me/worktugal" style="font-size:14px;color:#0F3D2E;font-weight:700;text-decoration:underline;">Follow Worktugal on Telegram →</a>
</p>

<div style="margin:32px 0;"></div>

<p style="font-size:15px;line-height:1.7;">Van<br>Founder, Worktugal</p>
<p style="font-size:13px;color:#888;margin-top:6px;">P.S. We publish free compliance guides at <a href="https://blog.worktugal.com" style="color:#0F3D2E;">blog.worktugal.com</a> — NISS, tax residency, AIMA — the stuff no one explains clearly. No paywall.</p>

<p style="font-size:11px;color:#bbb;margin-top:40px;border-top:1px solid #f0f0f0;padding-top:16px;line-height:1.6;">Worktugal provides compliance risk information for educational purposes only. Not legal or tax advice. You received this because you created a free account at app.worktugal.com.</p>

</div>`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Van from Worktugal <hello@worktugal.com>',
        reply_to: 'hello@worktugal.com',
        to: [email],
        subject: 'Your Worktugal account is live — run your diagnostic',
        html,
      }),
    });

    if (!emailRes.ok) {
      console.error('Welcome email failed:', emailRes.status, await emailRes.text());
    } else {
      console.log('Welcome email sent to:', email);
    }

    // Telegram alert to Van
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `<b>New account created</b>\n\n<b>Name:</b> ${name || 'Unknown'}\n<b>Email:</b> ${email}\n<b>Provider:</b> ${authProvider}\n\nWelcome email sent.`,
          parse_mode: 'HTML',
        }),
      }).catch(() => {});
    }

    // Listmonk — add new account to Worktugal Main list (list 3)
    const listmonkUrl = Deno.env.get('LISTMONK_URL');
    const listmonkUsername = Deno.env.get('LISTMONK_USERNAME');
    const listmonkPassword = Deno.env.get('LISTMONK_PASSWORD');
    if (listmonkUrl && listmonkUsername && listmonkPassword) {
      try {
        const loginRes = await fetch(`${listmonkUrl}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `username=${encodeURIComponent(listmonkUsername)}&password=${encodeURIComponent(listmonkPassword)}`,
          redirect: 'manual',
        });
        const setCookie = loginRes.headers.get('set-cookie') ?? '';
        const sessionMatch = setCookie.match(/session=([^;]+)/);
        if (!sessionMatch) {
          console.error('Listmonk login failed — no session cookie');
        } else {
          const sessionCookie = `session=${sessionMatch[1]}`;
          const lmRes = await fetch(`${listmonkUrl}/api/subscribers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
            body: JSON.stringify({
              email,
              name: name || email.split('@')[0],
              status: 'enabled',
              lists: [3],
              attribs: {
                source: 'app_signup',
                auth_provider: authProvider,
                signup_date: new Date().toISOString().split('T')[0],
              },
              preconfirm_subscriptions: true,
            }),
          });
          if (lmRes.ok) {
            console.log('Added to Listmonk main list:', email);
          } else {
            const lmBody = await lmRes.text();
            if (lmBody.includes('already')) {
              console.log('Already in Listmonk:', email);
            } else {
              console.error('Listmonk subscribe failed:', lmRes.status, lmBody);
            }
          }
        }
      } catch (lmErr: any) {
        console.error('Listmonk error:', lmErr.message);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('welcome-new-user error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
