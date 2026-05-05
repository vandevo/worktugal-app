import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY_LIVE')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET_LIVE')!;
const GHOST_URL = 'https://blog.worktugal.com/ghost/api/admin';

const stripe = new Stripe(stripeSecretKey, {
  appInfo: {
    name: 'Worktugal Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const body = await req.text();

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    console.log(`Received webhook event: ${event.type} (mode: LIVE)`);

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function sendPaymentNotification(event: Stripe.Event) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    console.log('No RESEND_API_KEY configured, skipping payment notification');
    return;
  }

  const obj = event.data.object as Record<string, unknown>;
  const customerEmail = (obj.customer_email || obj.receipt_email || '—') as string;
  const amountTotal = typeof obj.amount_total === 'number' ? `€${(obj.amount_total / 100).toFixed(2)}` : '—';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Worktugal <noreply@worktugal.com>',
        to: ['hello@worktugal.com'],
        subject: `Payment confirmed: ${event.type}`,
        html: `<p>Stripe payment event received.</p>
<ul>
  <li><strong>Event:</strong> ${event.type}</li>
  <li><strong>Event ID:</strong> ${event.id}</li>
  <li><strong>Customer email:</strong> ${customerEmail}</li>
  <li><strong>Amount:</strong> ${amountTotal}</li>
  <li><strong>Live mode:</strong> ${event.livemode}</li>
  <li><strong>Time:</strong> ${new Date(event.created * 1000).toISOString()}</li>
</ul>`,
      }),
    });

    if (!response.ok) {
      console.error(`Resend payment notification failed: ${response.status} ${await response.text()}`);
    } else {
      console.log(`Successfully sent payment notification for ${event.type}`);
    }
  } catch (error: any) {
    console.error(`Error sending payment notification: ${error.message}`);
  }
}

async function handleEvent(event: Stripe.Event) {
  await sendPaymentNotification(event);

  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;

    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;

      isSubscription = mode === 'subscription';

      console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (event.type === 'customer.subscription.deleted') {
      console.info(`Subscription cancelled for customer: ${customerId} — downgrading Ghost membership`);
      await syncGhostMembership(customerId, 'deactivate');
      return;
    }

    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
      await syncGhostMembership(customerId, 'activate');
      if (event.type === 'checkout.session.completed') {
        EdgeRuntime.waitUntil(sendWelcomeEmail(customerId));
      }
    } else if (mode === 'payment' && payment_status === 'paid') {
      try {
        const {
          id: checkout_session_id,
          payment_intent,
          amount_subtotal,
          amount_total,
          currency,
          metadata,
        } = stripeData as Stripe.Checkout.Session;

        const { data: orderData, error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed',
        }).select('id').single();

        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }

        const paymentType = metadata?.payment_type || 'perk';

        if (metadata?.submission_id && orderData?.id) {
          const submissionId = parseInt(metadata.submission_id);

          if (!isNaN(submissionId)) {
            if (paymentType === 'consult') {
              const { data: booking, error: consultError } = await supabase
                .from('consult_bookings')
                .update({
                  status: 'completed_payment',
                  stripe_session_id: checkout_session_id,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', submissionId)
                .select('*')
                .single();

              if (consultError) {
                console.error('Error updating consult booking status:', consultError);
              } else {
                console.info(`Successfully updated consult booking ${submissionId} to completed_payment`);

                if (booking) {
                  const durationMap: Record<string, number> = {
                    'triage': 30,
                    'start_pack': 90,
                    'annual_return': 60,
                    'add_on': 30,
                  };

                  const duration = durationMap[booking.service_type] || 30;

                  const priceMap: Record<string, number> = {
                    'triage': 59.00,
                    'start_pack': 349.00,
                    'annual_return': 149.00,
                    'add_on': 49.00,
                  };

                  const totalAmount = priceMap[booking.service_type] || 0;
                  const platformFee = totalAmount * 0.30;
                  const accountantPayout = totalAmount * 0.70;

                  const { data: appointment, error: appointmentError } = await supabase
                    .from('appointments')
                    .insert({
                      client_id: booking.user_id,
                      service_type: booking.service_type,
                      status: 'pending_assignment',
                      duration_minutes: duration,
                      payment_amount: totalAmount,
                      platform_fee_amount: platformFee,
                      accountant_payout_amount: accountantPayout,
                      stripe_payment_intent_id: payment_intent as string,
                      consult_booking_id: booking.id,
                      client_notes: booking.notes,
                      preferred_date: booking.preferred_date,
                    })
                    .select()
                    .single();

                  if (appointmentError) {
                    console.error('Error creating appointment:', appointmentError);
                  } else {
                    console.info(`Successfully created appointment ${appointment.id} for booking ${submissionId}`);
                  }
                }
              }
            } else {
              const { error: submissionError } = await supabase
                .from('partner_submissions')
                .update({
                  status: 'completed_payment',
                  stripe_order_id: orderData.id,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', submissionId);

              if (submissionError) {
                console.error('Error updating partner submission status:', submissionError);
              } else {
                console.info(`Successfully updated partner submission ${submissionId} to completed_payment`);

                try {
                  const { data: customerData, error: customerError } = await supabase
                    .from('stripe_customers')
                    .select('user_id')
                    .eq('customer_id', customerId)
                    .single();

                  if (customerError) {
                    console.error('Error fetching user_id from stripe_customers:', customerError);
                  } else if (customerData?.user_id) {
                    const { error: roleUpdateError } = await supabase
                      .from('user_profiles')
                      .update({ role: 'partner' })
                      .eq('id', customerData.user_id);

                    if (roleUpdateError) {
                      console.error('Error updating user role to partner:', roleUpdateError);
                    } else {
                      console.info(`Successfully updated user ${customerData.user_id} role to 'partner'`);
                    }
                  }
                } catch (roleError) {
                  console.error('Error in user role update process:', roleError);
                }
              }
            }
          }
        }

        console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }
}

// ── Ghost Admin API helpers ───────────────────────────────────────────────────

async function generateGhostJWT(adminKey: string): Promise<string> {
  const [id, secret] = adminKey.split(':');
  const secretBytes = new Uint8Array(
    (secret.match(/.{2}/g) as string[]).map((b: string) => parseInt(b, 16))
  );
  const key = await crypto.subtle.importKey(
    'raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const now = Math.floor(Date.now() / 1000);
  const encode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const header = encode({ alg: 'HS256', typ: 'JWT', kid: id });
  const payload = encode({ iat: now, exp: now + 300, aud: '/admin/' });
  const data = new TextEncoder().encode(`${header}.${payload}`);
  const sigBuf = await crypto.subtle.sign('HMAC', key, data);
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${header}.${payload}.${sig}`;
}

async function syncGhostMembership(customerId: string, action: 'activate' | 'deactivate'): Promise<void> {
  const ghostAdminKey = Deno.env.get('GHOST_ADMIN_API_KEY');
  if (!ghostAdminKey) {
    console.log('GHOST_ADMIN_API_KEY not set — skipping Ghost membership sync');
    return;
  }
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if ('deleted' in customer && customer.deleted) {
      console.log(`Stripe customer ${customerId} deleted, skipping Ghost sync`);
      return;
    }
    const email = (customer as Stripe.Customer).email;
    if (!email) {
      console.log(`No email for Stripe customer ${customerId}, skipping Ghost sync`);
      return;
    }
    const name = (customer as Stripe.Customer).name || '';
    const jwt = await generateGhostJWT(ghostAdminKey);
    const headers: Record<string, string> = {
      'Authorization': `Ghost ${jwt}`,
      'Content-Type': 'application/json',
    };

    // Get paid tier ID
    const tiersRes = await fetch(`${GHOST_URL}/tiers/`, { headers });
    if (!tiersRes.ok) throw new Error(`Ghost tiers fetch failed: ${tiersRes.status}`);
    const tiersData = await tiersRes.json();
    const paidTier = tiersData.tiers?.find((t: Record<string, unknown>) => t.type === 'paid');
    if (!paidTier) throw new Error('Ghost paid tier not found');

    // Find existing Ghost member by email
    const searchRes = await fetch(
      `${GHOST_URL}/members/?search=${encodeURIComponent(email)}&limit=1`,
      { headers }
    );
    const searchData = await searchRes.json();
    const existing = searchData.members?.[0];

    if (action === 'activate') {
      if (existing) {
        const res = await fetch(`${GHOST_URL}/members/${existing.id}/`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ members: [{ ...existing, tiers: [{ id: paidTier.id }] }] }),
        });
        if (!res.ok) throw new Error(`Ghost member upgrade failed: ${res.status} ${await res.text()}`);
        console.log(`Ghost: upgraded existing member ${email} to paid tier`);
      } else {
        const res = await fetch(`${GHOST_URL}/members/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            members: [{
              email,
              name,
              tiers: [{ id: paidTier.id }],
              labels: [{ name: 'stripe-subscriber' }],
              send_email: true,
              email_type: 'subscribe',
            }],
          }),
        });
        if (!res.ok) throw new Error(`Ghost member create failed: ${res.status} ${await res.text()}`);
        console.log(`Ghost: created new paid member ${email}`);
      }
    } else {
      // Deactivate: drop to free member (keep member, remove paid tier)
      if (existing) {
        const res = await fetch(`${GHOST_URL}/members/${existing.id}/`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ members: [{ ...existing, tiers: [] }] }),
        });
        if (!res.ok) throw new Error(`Ghost member downgrade failed: ${res.status} ${await res.text()}`);
        console.log(`Ghost: downgraded ${email} to free tier on cancellation`);
      } else {
        console.log(`Ghost: no member found for ${email} on deactivate, nothing to do`);
      }
    }
  } catch (err: unknown) {
    // Ghost sync failure must never block payment processing
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Ghost membership sync error for customer ${customerId}: ${message}`);
  }
}

// ── Stripe subscription sync ──────────────────────────────────────────────────

async function syncCustomerFromStripe(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }

    const subscription = subscriptions.data[0];

    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}

async function sendWelcomeEmail(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if ('deleted' in customer && customer.deleted) return;
    const email = (customer as Stripe.Customer).email;
    if (!email) return;
    const name = (customer as Stripe.Customer).name || 'there';

    await fetch('https://n8n.worktugal.com/webhook/welcome-pro-subscriber', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    console.log(`Welcome email triggered for ${email}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Welcome email trigger failed for customer ${customerId}: ${message}`);
  }
}