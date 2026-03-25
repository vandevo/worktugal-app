import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PostPayload {
  message: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_preview?: boolean;
  pin?: boolean;
  source?: string;
  image_url?: string; // if set, sends photo with caption instead of text
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const BOT_TOKEN = Deno.env.get('WORKTUGAL_BOT_TOKEN');
    const CHANNEL_ID = Deno.env.get('WORKTUGAL_CHANNEL_ID') ?? '@worktugal';
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!BOT_TOKEN) {
      return new Response(JSON.stringify({ error: 'WORKTUGAL_BOT_TOKEN not set' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: PostPayload = await req.json();
    const { message, parse_mode = 'HTML', disable_preview = false, pin = false, source = 'manual', image_url } = body;

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Post to channel — photo with caption or plain text
    const endpoint = image_url ? 'sendPhoto' : 'sendMessage';
    const sendBody = image_url
      ? { chat_id: CHANNEL_ID, photo: image_url, caption: message, parse_mode }
      : { chat_id: CHANNEL_ID, text: message, parse_mode, disable_web_page_preview: disable_preview };

    const sendRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendBody),
    });

    const sendData = await sendRes.json();

    if (!sendData.ok) {
      throw new Error(`Telegram error: ${sendData.description}`);
    }

    const messageId = sendData.result.message_id;

    // Optionally pin the message
    if (pin) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/pinChatMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHANNEL_ID, message_id: messageId, disable_notification: true }),
      });
    }

    // Alert Van via personal Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `✓ Posted to @worktugal [source: ${source}]\n\n${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`,
          parse_mode: 'HTML',
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true, message_id: messageId, source }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    if (BOT_TOKEN && CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `post-to-channel error: ${err instanceof Error ? err.message : String(err)}`,
        }),
      });
    }
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
