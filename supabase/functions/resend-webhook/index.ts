import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Events that warrant a Telegram alert
const ALERT_EVENTS = ['email.bounced', 'email.complained'];

async function verifySignature(req: Request, body: string): Promise<boolean> {
  const secret = Deno.env.get('RESEND_WEBHOOK_SECRET');
  if (!secret) return true; // no secret set — skip verification (shouldn't happen in prod)

  const svixId        = req.headers.get('svix-id') ?? '';
  const svixTimestamp = req.headers.get('svix-timestamp') ?? '';
  const svixSignature = req.headers.get('svix-signature') ?? '';

  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const signedContent = `${svixId}.${svixTimestamp}.${body}`;
  const secretBytes   = Uint8Array.from(atob(secret.replace('whsec_', '')), c => c.charCodeAt(0));
  const key           = await crypto.subtle.importKey('raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig           = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedContent));
  const computed      = 'v1,' + btoa(String.fromCharCode(...new Uint8Array(sig)));

  return svixSignature.split(' ').some(s => s === computed);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.text();

    // Verify the request came from Resend
    const valid = await verifySignature(req, body);
    if (!valid) {
      console.warn('resend-webhook: invalid signature — rejected');
      return new Response(JSON.stringify({ error: 'invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = JSON.parse(body);

    const eventType: string = payload?.type ?? 'unknown';
    const data = payload?.data ?? {};

    const emailId   = data.email_id   ?? null;
    const toEmail   = Array.isArray(data.to) ? data.to[0] : (data.to ?? null);
    const fromEmail = data.from       ?? null;
    const subject   = data.subject    ?? null;

    // Log to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error: dbError } = await supabase
      .from('resend_email_events')
      .insert({
        event_type: eventType,
        email_id:   emailId,
        to_email:   toEmail,
        from_email: fromEmail,
        subject,
        payload,
      });

    if (dbError) {
      console.error('DB insert failed:', dbError.message);
    }

    // Telegram alert for bounces and complaints
    if (ALERT_EVENTS.includes(eventType)) {
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      const chatId   = Deno.env.get('TELEGRAM_CHAT_ID');

      if (botToken && chatId) {
        const emoji   = eventType === 'email.bounced' ? '🔴' : '⚠️';
        const label   = eventType === 'email.bounced' ? 'Email bounced' : 'Spam complaint';
        const message = `${emoji} <b>${label}</b>\n\n<b>To:</b> ${toEmail ?? 'unknown'}\n<b>Subject:</b> ${subject ?? 'unknown'}\n<b>ID:</b> ${emailId ?? 'unknown'}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
        }).catch(() => {});
      }
    }

    return new Response(JSON.stringify({ received: true, event: eventType }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('resend-webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
