import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useUserSubscription = () => {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActivePlan = async () => {
      if (!user) {
        setActivePlan(null);
        setLoading(false);
        return;
      }

      try {
        // Check for active subscriptions
        const { data: subscriptions } = await supabase
          .from('stripe_subscriptions')
          .select('product_name, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1);

        if (subscriptions && subscriptions.length > 0) {
          setActivePlan(subscriptions[0].product_name);
        } else {
          setActivePlan(null);
        }
      } catch (error) {
        console.error('Error fetching user subscription:', error);
        setActivePlan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePlan();
  }, [user]);

  return { activePlan, loading };
};