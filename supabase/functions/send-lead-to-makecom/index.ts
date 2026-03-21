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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured - lead notification skipped');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'RESEND_API_KEY not configured',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse the webhook payload from Supabase
    const payload = await req.json();

    // Supabase sends: { type: 'INSERT', table: 'leads_accounting', record: {...}, old_record: null }
    const lead: LeadPayload = payload.record || payload;

    console.log('Processing lead:', lead.id, lead.email);

    const emailBody = `<p>New lead submitted on Worktugal.</p>
<ul>
  <li><strong>Name:</strong> ${lead.name}</li>
  <li><strong>Email:</strong> ${lead.email}</li>
  <li><strong>Country:</strong> ${lead.country || '—'}</li>
  <li><strong>Main need:</strong> ${lead.main_need || '—'}</li>
  <li><strong>Urgency:</strong> ${lead.urgency || '—'}</li>
  <li><strong>Source:</strong> ${lead.source}</li>
  <li><strong>Status:</strong> ${lead.status}</li>
  <li><strong>Details:</strong> ${lead.additional_details || '—'}</li>
  <li><strong>Submitted:</strong> ${lead.created_at}</li>
</ul>`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Worktugal <noreply@worktugal.com>',
        to: ['hello@worktugal.com'],
        subject: `New lead: ${lead.name} from ${lead.country || 'unknown'}`,
        html: emailBody,
      }),
    });

    if (!resendResponse.ok) {
      console.error('Resend notification failed:', resendResponse.status, await resendResponse.text());
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to send lead notification via Resend',
          status: resendResponse.status,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Successfully sent lead notification via Resend:', lead.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead notification sent',
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