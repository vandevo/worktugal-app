import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useStripeCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async (priceId: string, productName: string) => {
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to make a purchase');
      }

      // Call the stripe-checkout edge function
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          priceId,
          productName,
          userId: user.id,
          userEmail: user.email
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    isLoading
  };
};