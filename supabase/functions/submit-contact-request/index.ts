import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ContactRequest {
  purpose: 'accounting' | 'partnership' | 'job' | 'info' | 'other';
  full_name: string;
  email: string;
  company_name?: string;
  website_url?: string;
  message?: string;
  budget_range?: '200-499' | '500-999' | '1000+' | 'not_yet' | 'exploring';
  timeline?: 'this_month' | '3_months' | 'later' | 'flexible';
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
    // Parse the contact request
    const submission: ContactRequest = await req.json();

    console.log('Received contact request:', submission.email, 'purpose:', submission.purpose);

    // Validate required fields
    if (!submission.full_name || !submission.email || !submission.purpose) {
      console.error('Validation failed:', { 
        full_name: submission.full_name, 
        email: submission.email, 
        purpose: submission.purpose 
      });
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: full_name, email, and purpose are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate priority
    let priority: 'high' | 'normal' | 'low' = 'normal';
    
    if (submission.purpose === 'accounting') {
      priority = 'high';
    } else if (
      submission.purpose === 'partnership' &&
      (submission.budget_range === '1000+' || submission.budget_range === '500-999')
    ) {
      priority = 'high';
    } else if (
      submission.purpose === 'partnership' &&
      submission.budget_range === '200-499' &&
      submission.timeline === 'this_month'
    ) {
      priority = 'normal';
    } else if (
      submission.purpose === 'partnership' &&
      (submission.budget_range === 'not_yet' || submission.budget_range === 'exploring')
    ) {
      priority = 'low';
    }

    console.log('Calculated priority:', priority);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert contact request into database
    console.log('Inserting contact request into database...');
    const { data: contactRequest, error: dbError } = await supabase
      .from('contact_requests')
      .insert({
        purpose: submission.purpose,
        full_name: submission.full_name,
        email: submission.email,
        company_name: submission.company_name || null,
        website_url: submission.website_url || null,
        message: submission.message || null,
        budget_range: submission.budget_range || null,
        timeline: submission.timeline || null,
        status: 'new',
        priority: priority,
        webhook_sent: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return new Response(
        JSON.stringify({
          error: 'Failed to save contact request',
          details: dbError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Contact request saved to database:', contactRequest.id);

    // Send to Make.com webhook
    const makeWebhookUrl = 'https://hook.eu2.make.com/fkdvvlsh9bc2k7fbi5ikfzysdizckt3e';

    try {
      console.log('Sending to Make.com webhook...');
      const makeResponse = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contactRequest.id,
          purpose: contactRequest.purpose,
          full_name: contactRequest.full_name,
          email: contactRequest.email,
          company_name: contactRequest.company_name || '',
          website_url: contactRequest.website_url || '',
          message: contactRequest.message || '',
          budget_range: contactRequest.budget_range || '',
          timeline: contactRequest.timeline || '',
          priority: contactRequest.priority,
          status: contactRequest.status,
          created_at: contactRequest.created_at,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!makeResponse.ok) {
        console.error('Make.com webhook failed:', makeResponse.status);
        // Update webhook_sent to false since it failed
      } else {
        console.log('Successfully sent to Make.com');
        // Update webhook_sent to true
        await supabase
          .from('contact_requests')
          .update({
            webhook_sent: true,
            webhook_sent_at: new Date().toISOString(),
          })
          .eq('id', contactRequest.id);
      }
    } catch (webhookError) {
      console.error('Failed to call Make.com webhook:', webhookError);
      // Don't fail the request - data is already saved
    }

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        data: contactRequest,
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