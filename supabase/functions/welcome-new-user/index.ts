import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    // Supabase Auth hook payload: { type: 'INSERT', record: { id, email, ... } }
    const userId: string = payload?.record?.id || payload?.user_id || '';
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

    // Skip if already sent
    if (email) {
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('welcome_email_sent_at')
        .eq('id', userId)
        .maybeSingle();

      if (existing?.welcome_email_sent_at) {
        return new Response(JSON.stringify({ skip: true, reason: 'already sent' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not set');
      return new Response(JSON.stringify({ skip: true, reason: 'no resend key' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = `<div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b">

<p style="font-size:16px;line-height:1.7;margin-bottom:24px">Hi ${displayName},</p>

<p style="font-size:16px;line-height:1.7;margin-bottom:24px">Your Worktugal account is ready. Next step: run the compliance diagnostic. It takes 2 minutes and shows you exactly where you stand on tax, visa, and social security in Portugal.</p>

<p style="margin-bottom:32px">
<a href="https://app.worktugal.com/diagnostic" style="display:inline-block;background:#0F3D2E;color:white;padding:14px 28px;text-decoration:none;font-weight:600;border-radius:8px;font-size:15px">Run your free diagnostic</a>
</p>

<p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:24px">The diagnostic covers tax residency, social security, immigration status, and business structure. Your results are saved automatically. Re-run anytime your situation changes.</p>

<div style="border-top:1px solid #e2e8f0;margin:32px 0;padding-top:24px">

<p style="font-size:14px;font-weight:700;margin-bottom:8px;color:#1e293b">Stay ahead of compliance changes</p>
<p style="font-size:14px;line-height:1.7;color:#475569;margin-bottom:20px">Portuguese regulations change often. AIMA deadlines, SS contributions, IRS filing windows. We post updates as they happen, no noise.</p>
<p style="margin-bottom:24px">
<a href="https://t.me/worktugal" style="font-size:14px;color:#0F3D2E;font-weight:700;text-decoration:underline">Follow Worktugal on Telegram</a>
</p>

<p style="font-size:14px;line-height:1.7;color:#475569;margin-bottom:20px">Free compliance guides at <a href="https://blog.worktugal.com" style="color:#0F3D2E;font-weight:600">blog.worktugal.com</a>. NISS, tax residency, AIMA. No paywall.</p>

<p style="font-size:14px;color:#94a3b8;margin-top:24px">Van from Worktugal</p>

</div>

<p style="font-size:11px;color:#94a3b8;margin-top:40px;border-top:1px solid #f1f5f9;padding-top:16px;line-height:1.6">Worktugal provides compliance risk information for educational purposes only. Not legal or tax advice. You received this because you created a free account at app.worktugal.com.</p>

</div>`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Worktugal <hello@worktugal.com>',
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

      if (userId) {
        await supabase.from('user_profiles').upsert(
          { id: userId, welcome_email_sent_at: new Date().toISOString() },
          { onConflict: 'id' }
        );
      }
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
