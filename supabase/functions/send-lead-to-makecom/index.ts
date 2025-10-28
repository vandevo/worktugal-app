import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LeadPayload {
  id: number;
  created_at: string;
  name: string;
  email: string;
  country?: string;
  main_need?: string;
  urgency?: string;
  additional_details?: string;
  consent: boolean;
  source: string;
  status: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get the Make.com webhook URL from environment variables
    const makeWebhookUrl = Deno.env.get('MAKE_WEBHOOK_LEADS_URL') || 'https://hook.eu2.make.com/lgaoguuofatr0ox3fvrjwyg7cr0mu5qn';

    if (!makeWebhookUrl) {
      console.warn('MAKE_WEBHOOK_LEADS_URL not configured - lead will not be sent to Make.com');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Make.com webhook URL not configured',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse the webhook payload from Supabase
    const payload = await req.json();

    // Extract the lead data from the database webhook
    // Supabase sends: { type: 'INSERT', table: 'leads_accounting', record: {...}, old_record: null }
    const lead: LeadPayload = payload.record || payload;

    console.log('Processing lead:', lead.id, lead.email);

    // Prepare payload for Make.com
    const makePayload = {
      lead_id: lead.id,
      name: lead.name,
      email: lead.email,
      country: lead.country || '',
      main_need: lead.main_need || '',
      urgency: lead.urgency || '',
      additional_details: lead.additional_details || '',
      consent: lead.consent,
      source: lead.source,
      status: lead.status,
      created_at: lead.created_at,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending to Make.com:', makeWebhookUrl);

    // Send to Make.com
    const makeResponse = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(makePayload),
    });

    if (!makeResponse.ok) {
      console.error('Make.com webhook failed:', makeResponse.status, await makeResponse.text());
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to send to Make.com',
          status: makeResponse.status,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Successfully sent lead to Make.com:', lead.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead sent to Make.com',
        lead_id: lead.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error processing lead webhook:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});