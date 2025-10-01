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

export interface OrderData {
  customer_id: string;
  order_id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  order_date: string;
}

export const useSubscription = () => {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!user) {
        setSubscription(null);
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch customer ID first
        const { data: customerData, error: customerError } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .maybeSingle();

        if (customerError) {
          console.error('Error fetching customer:', customerError);
          setError('Failed to fetch customer data');
          setLoading(false);
          return;
        }

        if (!customerData) {
          setSubscription(null);
          setOrders([]);
          setLoading(false);
          return;
        }

        const customerId = customerData.customer_id;

        // Fetch subscription data using secure table
        const { data: subData, error: subError } = await supabase
          .from('stripe_subscriptions')
          .select('customer_id, subscription_id, status, price_id, current_period_start, current_period_end, cancel_at_period_end, payment_method_brand, payment_method_last4')
          .eq('customer_id', customerId)
          .is('deleted_at', null)
          .maybeSingle();

        if (subError) {
          console.error('Error fetching subscription:', subError);
        } else if (subData) {
          setSubscription({
            customer_id: subData.customer_id,
            subscription_id: subData.subscription_id,
            subscription_status: subData.status,
            price_id: subData.price_id,
            current_period_start: subData.current_period_start,
            current_period_end: subData.current_period_end,
            cancel_at_period_end: subData.cancel_at_period_end,
            payment_method_brand: subData.payment_method_brand,
            payment_method_last4: subData.payment_method_last4,
          });
        }

        // Fetch order data using secure table
        const { data: orderData, error: orderError } = await supabase
          .from('stripe_orders')
          .select('id, customer_id, checkout_session_id, payment_intent_id, amount_subtotal, amount_total, currency, payment_status, status, created_at')
          .eq('customer_id', customerId)
          .eq('status', 'completed')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (orderError) {
          console.error('Error fetching orders:', orderError);
        } else if (orderData) {
          setOrders(orderData.map(order => ({
            customer_id: order.customer_id,
            order_id: order.id,
            checkout_session_id: order.checkout_session_id,
            payment_intent_id: order.payment_intent_id,
            amount_subtotal: order.amount_subtotal,
            amount_total: order.amount_total,
            currency: order.currency,
            payment_status: order.payment_status,
            order_status: order.status,
            order_date: order.created_at,
          })));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching payment data:', err);
        setError('Failed to fetch payment data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPaymentData();
    }
  }, [user, authLoading]);

  const getActiveProductName = () => {
    // Check for active subscription first
    if (subscription?.price_id) {
      const product = getProductByPriceId(subscription.price_id);
      return product?.name || null;
    }
    
    // Check for completed orders (one-time payments)
    if (orders.length > 0) {
      return 'Partner Listing Early Access (Lifetime)';
    }
    
    return null;
  };

  const hasActivePayment = () => {
    return (subscription?.subscription_status === 'active') || orders.length > 0;
  };

  return {
    subscription,
    orders,
    loading: loading || authLoading,
    error,
    activeProductName: getActiveProductName(),
    hasActivePayment: hasActivePayment(),
  };
};