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

    const { review_id, user_id, form_data, escalation_flags, ambiguity_score } = await req.json();

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
      return new Response(
        JSON.stringify({ error: 'Review not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (user_id && review.user_id !== user_id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      .eq('id', review_id);

    if (updateError) {
      console.error('Error updating review:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update review' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formWebhookUrl = Deno.env.get('MAKECOM_WEBHOOK_PAID_REVIEW_FORM_SUBMITTED');
    if (formWebhookUrl) {
      try {
        const webhookPayload = {
          event: 'form_submitted',
          review_id: review.id,
          user_id: review.user_id,
          customer_email: review.customer_email,
          customer_name: review.customer_name,
          form_data: form_data || review.form_data,
          escalation_flags: escalation_flags || [],
          ambiguity_score: ambiguity_score || 0,
          submitted_at: new Date().toISOString(),
        };

        await fetch(formWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });
        console.log('Form submission webhook sent to Make.com for review:', review.id);
      } catch (webhookError) {
        console.error('Form webhook error (non-blocking):', webhookError);
      }
    }

    // Trigger AI research via Parallel.ai (managed non-blocking)
    // We use EdgeRuntime.waitUntil to ensure the fetch completes even after the response is sent.
    const researchUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/research-compliance`;
    const triggerResearch = async () => {
      try {
        const res = await fetch(researchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({ review_id }),
        });
        if (!res.ok) {
          const text = await res.text();
          console.error(`AI research trigger failed with status ${res.status}: ${text}`);
        } else {
          console.log('AI research trigger successful for review:', review_id);
        }
      } catch (err) {
        console.error('AI research trigger connection error:', err);
      }
    };

    // @ts-ignore: EdgeRuntime is available in Supabase environment
    if (typeof EdgeRuntime !== 'undefined') {
      // @ts-ignore
      EdgeRuntime.waitUntil(triggerResearch());
    } else {
      // Fallback for local development or if global is missing
      triggerResearch().catch(err => console.error('AI research trigger error (fallback):', err));
    }
    console.log('AI research trigger queued for review:', review_id);

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