import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
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

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  appInfo: { name: 'Worktugal Paid Review', version: '1.0.0' },
});

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

    const { session_id } = await req.json();

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing session_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: existingReview } = await supabase
      .from('paid_compliance_reviews')
      .select('*')
      .eq('stripe_session_id', session_id)
      .maybeSingle();

    if (existingReview) {
      return new Response(
        JSON.stringify({
          success: true,
          review: existingReview,
          access_token: existingReview.access_token,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ error: 'Payment not completed', payment_status: session.payment_status }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: newReview, error: insertError } = await supabase
      .from('paid_compliance_reviews')
      .insert({
        stripe_session_id: session_id,
        stripe_payment_intent_id: session.payment_intent as string,
        customer_email: session.customer_details?.email || '',
        customer_name: session.customer_details?.name || null,
        status: 'form_pending',
        form_data: {},
        form_progress: { sections_completed: [] },
        escalation_flags: [],
        ambiguity_score: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating review record:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create review record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created paid review record ${newReview.id} for session ${session_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        review: newReview,
        access_token: newReview.access_token,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error(`Verification error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});