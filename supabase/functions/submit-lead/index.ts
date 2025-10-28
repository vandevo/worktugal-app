import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LeadSubmission {
  name: string;
  email: string;
  country?: string;
  main_need?: string;
  urgency?: string;
  additional_details?: string;
  consent: boolean;
  source?: string;
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
    // Parse the form submission
    const submission: LeadSubmission = await req.json();

    console.log('Received lead submission:', submission.email);

    // Validate required fields
    if (!submission.name || !submission.email || !submission.consent) {
      console.error('Validation failed:', { name: submission.name, email: submission.email, consent: submission.consent });
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: name, email, and consent are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    console.log('Inserting lead into database...');
    const { data: lead, error: dbError } = await supabase
      .from('leads_accounting')
      .insert({
        name: submission.name,
        email: submission.email,
        country: submission.country || null,
        main_need: submission.main_need || null,
        urgency: submission.urgency || null,
        additional_details: submission.additional_details || null,
        consent: submission.consent,
        source: submission.source || 'accounting_early_access',
        status: 'new',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return new Response(
        JSON.stringify({
          error: 'Failed to save lead',
          details: dbError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Lead saved to database:', lead.id);

    // Send to Make.com webhook
    const makeWebhookUrl = 'https://hook.eu2.make.com/lgaoguuofatr0ox3fvrjwyg7cr0mu5qn';

    try {
      console.log('Sending to Make.com webhook...');
      const makeResponse = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      if (!makeResponse.ok) {
        console.error('Make.com webhook failed:', makeResponse.status);
      } else {
        console.log('Successfully sent to Make.com');
      }
    } catch (webhookError) {
      console.error('Failed to call Make.com webhook:', webhookError);
    }

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        data: lead,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
