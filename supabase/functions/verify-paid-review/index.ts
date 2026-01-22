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

    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('has_paid_compliance_review, paid_compliance_review_id')
      .eq('id', user_id)
      .maybeSingle();

    if (existingProfile?.has_paid_compliance_review && existingProfile?.paid_compliance_review_id) {
      console.log(`User ${user_id} already has paid review ${existingProfile.paid_compliance_review_id}`);
      return new Response(
        JSON.stringify({ success: true, review_id: existingProfile.paid_compliance_review_id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripeMode = Deno.env.get('STRIPE_MODE') || 'test';
    const stripeSecretKey = stripeMode === 'live'
      ? Deno.env.get('STRIPE_SECRET_KEY_LIVE')
      : Deno.env.get('STRIPE_SECRET_KEY_TEST');

    if (!stripeSecretKey) {
      console.error(`Missing Stripe secret key for mode: ${stripeMode}`);
      return new Response(
        JSON.stringify({ error: `Stripe not configured for ${stripeMode} mode` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      appInfo: { name: 'Worktugal Paid Review', version: '1.0.0' },
    });

    const sessions = await stripe.checkout.sessions.list({
      limit: 10,
    });

    const paidSession = sessions.data.find(
      s => s.metadata?.user_id === user_id &&
           s.metadata?.payment_type === 'paid_compliance_review' &&
           s.payment_status === 'paid'
    );

    if (!paidSession) {
      console.log(`No paid session found for user ${user_id}`);
      return new Response(
        JSON.stringify({ success: false, error: 'No payment found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found paid session ${paidSession.id} for user ${user_id}`);

    const { data: user } = await supabase.auth.admin.getUserById(user_id);
    const customerEmail = paidSession.customer_details?.email || user?.user?.email || '';

    const { data: newReview, error: insertError } = await supabase
      .from('paid_compliance_reviews')
      .insert({
        user_id: user_id,
        stripe_session_id: paidSession.id,
        stripe_payment_intent_id: paidSession.payment_intent as string,
        customer_email: customerEmail,
        customer_name: paidSession.customer_details?.name || null,
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

    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        has_paid_compliance_review: true,
        paid_compliance_review_id: newReview.id,
      })
      .eq('id', user_id);

    if (profileError) {
      console.error('Error updating user profile:', profileError);
    }

    console.log(`Created paid review record ${newReview.id} for user ${user_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        review_id: newReview.id,
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