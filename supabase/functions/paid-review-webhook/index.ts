import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface WebhookPayload {
  event: string;
  review_id: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string | null;
  status: string;
  previous_status?: string;
  form_data: Record<string, any>;
  escalation_flags: any[];
  ambiguity_score: number;
  admin_notes: string | null;
  review_delivered_at: string | null;
  created_at: string;
  updated_at: string;
  timestamp: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { review_id, new_status, previous_status, trigger } = await req.json();

    if (!review_id) {
      return new Response(
        JSON.stringify({ error: 'Missing review_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: review, error: fetchError } = await supabase
      .from('paid_compliance_reviews')
      .select('*')
      .eq('id', review_id)
      .maybeSingle();

    if (fetchError || !review) {
      console.error('Review fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Review not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const webhookUrl = Deno.env.get('MAKECOM_WEBHOOK_PAID_REVIEW_STATUS');

    if (!webhookUrl) {
      console.log('No MAKECOM_WEBHOOK_PAID_REVIEW_STATUS configured, skipping webhook');
      return new Response(
        JSON.stringify({ success: true, message: 'No webhook URL configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: WebhookPayload = {
      event: trigger || 'status_changed',
      review_id: review.id,
      user_id: review.user_id,
      customer_email: review.customer_email,
      customer_name: review.customer_name,
      status: new_status || review.status,
      previous_status: previous_status,
      form_data: review.form_data || {},
      escalation_flags: review.escalation_flags || [],
      ambiguity_score: review.ambiguity_score || 0,
      admin_notes: review.admin_notes,
      review_delivered_at: review.review_delivered_at,
      created_at: review.created_at,
      updated_at: review.updated_at,
      timestamp: new Date().toISOString(),
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      console.error('Webhook delivery failed:', webhookResponse.status, await webhookResponse.text());
      return new Response(
        JSON.stringify({ success: false, error: 'Webhook delivery failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Webhook sent successfully for review:', review.id, 'status:', new_status || review.status);

    return new Response(
      JSON.stringify({
        success: true,
        review_id: review.id,
        status: new_status || review.status,
        webhook_sent: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
