import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { getProductByPriceId } from '../stripe-config';

export interface SubscriptionData {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const useSubscription = () => {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
          setError(error.message);
        } else {
          setSubscription(data);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to fetch subscription data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchSubscription();
    }
  }, [user, authLoading]);

  const getActiveProductName = () => {
    if (!subscription?.price_id) {
      // Check if user has made any orders (one-time payments)
      return 'Partner Listing';
    }
    
    const product = getProductByPriceId(subscription.price_id);
    return product?.name || null;
  };

  return {
    subscription,
    loading: loading || authLoading,
    error,
    activeProductName: getActiveProductName(),
  };
};