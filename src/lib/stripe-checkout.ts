import { supabase } from '../lib/supabase';

interface CreateCheckoutParams {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  submissionId?: number;
  paymentType?: string;
}

export async function createCheckoutSession({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  submissionId,
  paymentType
}: CreateCheckoutParams): Promise<{ sessionId: string; url: string }> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `/login?redirect=${redirectUrl}`;
    throw new Error('Authentication required');
  }

  const { data: { supabaseProjectUrl } } = await supabase.functions.getFunctionConfig?.() ?? { data: {} };
  const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;

  const response = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({
      price_id: priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode,
      submission_id: submissionId ?? 0,
      payment_type: paymentType ?? 'compliance'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return response.json();
}
