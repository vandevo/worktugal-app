import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SEGMENT_MESSAGES: Record<string, string> = {
  low_setup_low_exposure: 'You still need to complete several legal steps but currently face limited regulatory risk.',
  low_setup_high_exposure: 'You have both missing setup steps and potential regulatory risks that require immediate attention.',
  high_setup_high_exposure: 'Your setup appears complete but hidden compliance risks were detected that could cost you.',
  high_setup_low_exposure: 'Your compliance setup appears strong and your exposure risk is low.',
};

interface TriggeredTrap {
  id: string;
  severity: 'high' | 'medium' | 'low';
  fix: string;
  legal_basis: string;
  source_url: string;
  penalty_range: string | null;
  exposureScore: number;
  last_verified: string;
}

interface DiagnosticEmailPayload {
  id: string;
  email: string;
  name?: string;
  setup_score: number;
  exposure_index: number;
  segment: string;
  traps: TriggeredTrap[];
  recommendations: string[];
  country_target: string;
  marketing_consent?: boolean;
  is_authenticated?: boolean;
}

const SEVERITY_COLOR = {
  high: { border: '#ef4444', bg: '#fef2f2', badge: '#ef4444', label: 'High Risk' },
  medium: { border: '#f59e0b', bg: '#fffbeb', badge: '#f59e0b', label: 'Medium Risk' },
  low: { border: '#10b981', bg: '#f0fdf4', badge: '#10b981', label: 'Low Risk' },
};

function trapHtml(trap: TriggeredTrap): string {
  const c = SEVERITY_COLOR[trap.severity];
  const verified = trap.last_verified
    ? new Date(trap.last_verified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  return `
    <div style="border-left:4px solid ${c.border};background:${c.bg};border-radius:8px;padding:16px 20px;margin-bottom:12px;">
      <span style="display:inline-block;background:${c.badge};color:#fff;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:2px 10px;border-radius:20px;margin-bottom:10px;">${c.label}</span>
      <p style="margin:0 0 12px;font-size:14px;color:#374151;line-height:1.6;">${trap.fix}</p>
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;"><strong style="color:#374151;">Legal basis:</strong> ${trap.legal_basis}</p>
      ${trap.penalty_range ? `<p style="margin:0 0 4px;font-size:12px;color:#6b7280;"><strong style="color:#374151;">Penalty:</strong> ${trap.penalty_range}</p>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <a href="${trap.source_url}" style="font-size:12px;color:#0F3D2E;font-weight:600;text-decoration:none;">View official source →</a>
        ${verified ? `<span style="font-size:11px;color:#9ca3af;">Verified ${verified}</span>` : ''}
      </div>
    </div>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: DiagnosticEmailPayload = await req.json();
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not set — skipping diagnostic email');
      return new Response(JSON.stringify({ success: false, message: 'RESEND_API_KEY not configured' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const displayName = payload.name || payload.email.split('@')[0];
    const highTraps = payload.traps.filter(t => t.severity === 'high');
    const mediumTraps = payload.traps.filter(t => t.severity === 'medium');
    const lowTraps = payload.traps.filter(t => t.severity === 'low');

    const setupColor = payload.setup_score >= 70 ? '#10b981' : payload.setup_score >= 40 ? '#f59e0b' : '#ef4444';
    const exposureColor = payload.exposure_index <= 15 ? '#10b981' : payload.exposure_index <= 40 ? '#f59e0b' : '#ef4444';
    const segmentMessage = SEGMENT_MESSAGES[payload.segment] ?? '';
    const resultsUrl = `https://app.worktugal.com/diagnostic/results?id=${payload.id}`;
    const hasNissGap = payload.traps.some(t => t.id.toLowerCase().includes('niss'));

    const subject = highTraps.length >= 2
      ? `You have ${highTraps.length} high-risk compliance gaps`
      : payload.setup_score < 40
      ? `Your Portugal compliance score: ${payload.setup_score}/100 — action needed`
      : `Your Portugal setup score: ${payload.setup_score}/100`;

    const html = `<div style="max-width:560px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;">

<p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Hi ${displayName},</p>

<p style="font-size:15px;line-height:1.7;margin-bottom:24px;">Your Portugal compliance check just came back. Here's the summary.</p>

<div style="background:#f7f7f7;border-left:3px solid #1a1a1a;padding:16px 20px;margin-bottom:12px;font-size:14px;line-height:1.9;">
Setup Score: <strong style="color:${setupColor};">${payload.setup_score}/100</strong><br>
Exposure Index: <strong style="color:${exposureColor};">${payload.exposure_index} risk pts</strong><br>
Risks detected: <strong>${payload.traps.length}</strong>
</div>

${segmentMessage ? `<p style="font-size:13px;line-height:1.6;color:#555;margin-bottom:28px;padding:0 4px;">${segmentMessage}</p>` : '<div style="margin-bottom:28px;"></div>'}

<p style="margin-bottom:32px;">
<a href="${resultsUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:600;border-radius:8px;font-size:14px;">View my full results →</a>
</p>

<p style="font-size:14px;line-height:1.7;color:#444;margin-bottom:32px;">Your results page breaks down every risk in plain English: the rule, the penalty range, and the official government source you can verify yourself. No paywall. Everything is free to read.</p>

${hasNissGap ? `<div style="background:#f0fdf4;border-left:4px solid #10b981;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
<p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0F3D2E;">Your NISS gap — read this first</p>
<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#374151;">NISS registration is one of the most missed steps for remote workers in Portugal. This guide covers the full process, the 12-month A1 exemption window, contribution rates, and what the December 2025 employer deadline change means for foreign-employed workers.</p>
<a href="https://blog.worktugal.com/niss-portugal-registration/" style="font-size:14px;color:#0F3D2E;font-weight:700;text-decoration:underline;">Read the NISS guide →</a>
</div>` : ''}

<div style="margin:32px 0;"></div>

<p style="font-size:14px;font-weight:700;margin-bottom:8px;">Know someone who should check theirs?</p>
<p style="font-size:14px;line-height:1.7;color:#444;margin-bottom:16px;">Most people in Portugal are operating blind. Same traps, every year, because nobody explains this clearly. If this was useful, share the diagnostic. It takes 2 minutes and it's completely free.</p>
<p style="margin-bottom:32px;">
<a href="https://app.worktugal.com/diagnostic" style="font-size:14px;color:#1a1a1a;font-weight:700;text-decoration:underline;">Share the free diagnostic →</a>
</p>

<div style="margin:32px 0;"></div>

<p style="font-size:14px;font-weight:700;margin-bottom:8px;">Stay ahead on Portugal compliance.</p>
<p style="font-size:14px;line-height:1.7;color:#444;margin-bottom:16px;">I post regulatory changes, tax rule updates, and compliance alerts as they happen. No group chat noise, just the signal that matters.</p>
<p style="margin-bottom:32px;">
<a href="https://t.me/worktugal" style="display:inline-block;background:#f7f7f7;color:#1a1a1a;padding:12px 24px;text-decoration:none;font-weight:600;border-radius:8px;font-size:14px;border:1px solid #e0e0e0;">Follow Worktugal on Telegram →</a>
</p>

<div style="margin:32px 0;"></div>

<p style="font-size:15px;line-height:1.7;">Van<br>Founder, Worktugal</p>
<p style="font-size:13px;color:#888;margin-top:6px;">P.S. Reply to this email anytime. I read every message.</p>

<p style="font-size:11px;color:#bbb;margin-top:40px;border-top:1px solid #f0f0f0;padding-top:16px;line-height:1.6;">Worktugal provides compliance risk information for educational purposes only. Not legal or tax advice. All data verified against official Portuguese government sources. You received this because you completed a free compliance diagnostic at app.worktugal.com.</p>

</div>`;

    // Send to user
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Van from Worktugal <hello@worktugal.com>',
        reply_to: 'hello@worktugal.com',
        to: [payload.email],
        subject,
        html,
      }),
    });

    if (!userRes.ok) {
      console.error('Failed to send diagnostic email to user:', userRes.status, await userRes.text());
    } else {
      console.log('Diagnostic email sent to:', payload.email);
    }

    // Notify Van
    const vanRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Worktugal <noreply@worktugal.com>',
        to: ['hello@worktugal.com'],
        subject: `New diagnostic: ${displayName} — Setup ${payload.setup_score}, Exposure ${payload.exposure_index} (${highTraps.length} high risk)`,
        html: `<p>New compliance diagnostic submitted.</p>
<ul>
  <li><strong>Name:</strong> ${displayName}</li>
  <li><strong>Email:</strong> ${payload.email}</li>
  <li><strong>Country:</strong> ${payload.country_target}</li>
  <li><strong>Setup Score:</strong> ${payload.setup_score}/100</li>
  <li><strong>Exposure Index:</strong> ${payload.exposure_index} pts</li>
  <li><strong>Segment:</strong> ${payload.segment}</li>
  <li><strong>High risks:</strong> ${highTraps.length} | <strong>Medium:</strong> ${mediumTraps.length} | <strong>Low:</strong> ${lowTraps.length}</li>
</ul>
<a href="${resultsUrl}">View results →</a>`,
      }),
    });

    if (!vanRes.ok) {
      console.error('Failed to send diagnostic notification to Van:', vanRes.status, await vanRes.text());
    }

    // Telegram notification
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (botToken && chatId) {
      const trapSummary = payload.traps.map(t => `• [${t.severity.toUpperCase()}] ${t.id}`).join('\n') || 'None';
      const tgText = `<b>New diagnostic</b>\n\n<b>Name:</b> ${displayName}\n<b>Email:</b> ${payload.email}\n<b>Country:</b> ${payload.country_target}\n\n<b>Scores</b>\nSetup: <b>${payload.setup_score}/100</b>\nExposure: <b>${payload.exposure_index} pts</b>\nSegment: ${payload.segment}\n\n<b>Risks</b> — High: ${highTraps.length} | Med: ${mediumTraps.length} | Low: ${lowTraps.length}\n${trapSummary}\n\n<a href="${resultsUrl}">View results →</a>`;
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: tgText, parse_mode: 'HTML', disable_web_page_preview: true }),
      });
      if (tgRes.ok) {
        console.log('Telegram notification sent');
      } else {
        console.error('Telegram notification failed:', tgRes.status, await tgRes.text());
      }
    }

    // Listmonk — subscribe if user consented or is authenticated (account = implicit consent)
    const shouldSubscribe = payload.marketing_consent === true || payload.is_authenticated === true;
    const listmonkUrl = shouldSubscribe ? Deno.env.get('LISTMONK_URL') : null;
    const listmonkUsername = Deno.env.get('LISTMONK_USERNAME');
    const listmonkPassword = Deno.env.get('LISTMONK_PASSWORD');
    const listmonkListId = Deno.env.get('LISTMONK_DIAGNOSTIC_LIST_ID');
    if (listmonkUrl && listmonkUsername && listmonkPassword && listmonkListId) {
      try {
        // Step 1: login to get session cookie
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
          // Step 2: add subscriber
          const lmRes = await fetch(`${listmonkUrl}/api/subscribers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
            body: JSON.stringify({
              email: payload.email,
              name: displayName,
              status: 'enabled',
              lists: [parseInt(listmonkListId)],
              attribs: {
                setup_score: payload.setup_score,
                exposure_index: payload.exposure_index,
                segment: payload.segment,
                country: payload.country_target,
                high_risks: highTraps.length,
                source: 'diagnostic',
              },
              preconfirm_subscriptions: true,
            }),
          });
          if (lmRes.ok) {
            console.log('Subscribed to Listmonk diagnostic list:', payload.email);
          } else {
            const lmBody = await lmRes.text();
            if (lmBody.includes('already')) {
              console.log('Already in Listmonk list:', payload.email);
            } else {
              console.error('Listmonk subscription failed:', lmRes.status, lmBody);
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
  } catch (error: any) {
    console.error('Unexpected error in send-diagnostic-email:', error);
    const errBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const errChatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (errBotToken && errChatId) {
      await fetch(`https://api.telegram.org/bot${errBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: errChatId,
          text: `<b>Edge function error</b>\n\n<b>Function:</b> send-diagnostic-email\n<b>Error:</b> ${error.message}`,
          parse_mode: 'HTML',
        }),
      }).catch(() => {});
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
