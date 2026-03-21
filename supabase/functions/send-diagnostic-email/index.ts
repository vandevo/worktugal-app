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

    const trapsSection = payload.traps.length > 0
      ? `<h2 style="font-size:18px;font-weight:800;color:#111827;margin:32px 0 16px;">${payload.traps.length} Compliance Risk${payload.traps.length === 1 ? '' : 's'} Detected</h2>
         ${payload.traps.map(trapHtml).join('')}`
      : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;text-align:center;margin:24px 0;">
           <p style="margin:0;font-size:15px;font-weight:700;color:#065f46;">No compliance traps detected</p>
           <p style="margin:8px 0 0;font-size:13px;color:#374151;">Based on your answers, your setup looks clean. Keep monitoring as regulations evolve.</p>
         </div>`;

    const recsSection = payload.recommendations.length > 0
      ? `<h2 style="font-size:18px;font-weight:800;color:#111827;margin:32px 0 12px;">Next Steps</h2>
         <ul style="padding-left:20px;margin:0;">
           ${payload.recommendations.map(r => `<li style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:6px;">${r}</li>`).join('')}
         </ul>`
      : '';

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

        <!-- Header -->
        <tr><td style="background:#0F3D2E;padding:28px 40px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.3px;">Worktugal</p>
          <p style="margin:4px 0 0;color:#10B981;font-size:11px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;">Compliance Risk Diagnostic</p>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:32px 40px 0;">
          <p style="margin:0 0 6px;font-size:15px;color:#111827;">Hi ${displayName},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">${segmentMessage}</p>
        </td></tr>

        <!-- Scores -->
        <tr><td style="padding:0 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:24px;text-align:center;border-right:1px solid #e5e7eb;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;">Setup Score</p>
                <p style="margin:0;font-size:42px;font-weight:900;color:${setupColor};line-height:1;">${payload.setup_score}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">/100</p>
              </td>
              <td style="padding:24px;text-align:center;border-right:1px solid #e5e7eb;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;">Exposure Index</p>
                <p style="margin:0;font-size:42px;font-weight:900;color:${exposureColor};line-height:1;">${payload.exposure_index}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">pts risk</p>
              </td>
              <td style="padding:24px;text-align:center;">
                <p style="margin:0 0 8px;font-size:10px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:#6b7280;">Risks Found</p>
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="text-align:center;padding:0 8px;"><span style="font-size:22px;font-weight:900;color:#ef4444;">${highTraps.length}</span><br><span style="font-size:10px;color:#ef4444;font-weight:700;">HIGH</span></td>
                    <td style="text-align:center;padding:0 8px;"><span style="font-size:22px;font-weight:900;color:#f59e0b;">${mediumTraps.length}</span><br><span style="font-size:10px;color:#f59e0b;font-weight:700;">MED</span></td>
                    <td style="text-align:center;padding:0 8px;"><span style="font-size:22px;font-weight:900;color:#10b981;">${lowTraps.length}</span><br><span style="font-size:10px;color:#10b981;font-weight:700;">LOW</span></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Traps & Recommendations -->
        <tr><td style="padding:0 40px;">
          ${trapsSection}
          ${recsSection}
        </td></tr>

        <!-- CTAs -->
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:16px;">
            <tr><td>
              <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#111827;">Need help fixing these?</p>
              <p style="margin:0 0 14px;font-size:13px;color:#374151;">Our vetted Portuguese accountants handle NIF, VAT, NISS, IRS and more.</p>
              <a href="https://worktugal.com/accountants" style="display:inline-block;background:#0F3D2E;color:#ffffff;padding:10px 22px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:700;">Find an Accountant</a>
            </td></tr>
          </table>
          <a href="${resultsUrl}" style="display:block;text-align:center;font-size:13px;color:#6b7280;text-decoration:none;">View your full results online →</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:11px;color:#9ca3af;">This report is for informational purposes only and does not constitute legal or tax advice. &copy; ${new Date().getFullYear()} Worktugal</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send to user
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Worktugal <noreply@worktugal.com>',
        to: [payload.email],
        subject: `Your Portugal Compliance Report — Setup ${payload.setup_score}/100, ${highTraps.length} High Risk`,
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Unexpected error in send-diagnostic-email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
