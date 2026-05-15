import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const stripeMode = Deno.env.get('STRIPE_MODE') || 'test';
const stripeSecretKey = stripeMode === 'live'
  ? Deno.env.get('STRIPE_SECRET_KEY_LIVE')!
  : Deno.env.get('STRIPE_SECRET_KEY_TEST')!;

const JOB_PRICE_ID = 'price_1SuK9uBm1NepJXMzjLj8Locw';
const SUCCESS_URL = 'https://app.worktugal.com/jobs/post/success';
const CANCEL_URL = 'https://app.worktugal.com/jobs/post';

const stripe = new Stripe(stripeSecretKey, {
  appInfo: { name: 'Worktugal', version: '1.0.0' },
});

Deno.serve(async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const { title, company_name, location, apply_url, remote_type, employment_type, salary_min, salary_max, salary_currency } = await req.json();
    if (!title || !company_name || !location || !apply_url || !remote_type || !employment_type) {
      return new Response(JSON.stringify({ error: 'title, company_name, location, apply_url, remote_type, and employment_type are required' }), {
        status: 400, headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    let customerId: string;

    const { data: existing } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (existing?.customer_id) {
      customerId = existing.customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      await supabase.from('stripe_customers').insert({
        user_id: user.id, customer_id: customer.id,
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: JOB_PRICE_ID, quantity: 1 }],
      mode: 'payment',
      success_url: `${SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: CANCEL_URL,
      metadata: {
        type: 'job_posting',
        user_id: user.id,
        company_name,
        title,
        location,
        apply_url,
        remote_type,
        employment_type,
        salary_min,
        salary_max,
        salary_currency,
      },
    });

    console.log(`Created job posting checkout ${session.id} for user ${user.id}`);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Job posting checkout error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
