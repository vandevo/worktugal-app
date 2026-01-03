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

    const { access_token, form_data, escalation_flags, ambiguity_score } = await req.json();

    if (!access_token) {
      return new Response(
        JSON.stringify({ error: 'Missing access_token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: review, error: fetchError } = await supabase
      .from('paid_compliance_reviews')
      .select('*')
      .eq('access_token', access_token)
      .maybeSingle();

    if (fetchError || !review) {
      return new Response(
        JSON.stringify({ error: 'Review not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error: updateError } = await supabase
      .from('paid_compliance_reviews')
      .update({
        status: 'submitted',
        form_data: form_data || review.form_data,
        form_progress: { sections_completed: ['residency', 'activity', 'registration', 'timing', 'crossborder', 'remote', 'context'] },
        escalation_flags: escalation_flags || [],
        ambiguity_score: ambiguity_score || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('access_token', access_token);

    if (updateError) {
      console.error('Error updating review:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update review' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const makecomWebhookUrl = Deno.env.get('MAKECOM_PAID_REVIEW_WEBHOOK_URL');
    if (makecomWebhookUrl) {
      try {
        const webhookPayload = {
          event: 'paid_review_submitted',
          review_id: review.id,
          customer_email: review.customer_email,
          customer_name: review.customer_name,
          access_token: review.access_token,
          form_data: form_data || review.form_data,
          escalation_flags: escalation_flags || [],
          ambiguity_score: ambiguity_score || 0,
          submitted_at: new Date().toISOString(),
        };

        await fetch(makecomWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
        console.log('Webhook sent to Make.com for review:', review.id);
      } catch (webhookError) {
        console.error('Webhook error (non-blocking):', webhookError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, review_id: review.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error(`Submit error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});