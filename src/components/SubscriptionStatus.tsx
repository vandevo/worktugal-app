import React, { useEffect, useState } from 'react';
import { Badge } from './ui/Badge';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface SubscriptionData {
  productName: string;
  status: string;
  amount: number;
  currency: string;
  purchaseDate: string;
}

export function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user's Stripe customer ID
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
          .eq('deleted_at', null)
          .single();

        if (!customerData) {
          setLoading(false);
          return;
        }

        // Get user's orders (one-time payments)
        const { data: orders } = await supabase
          .from('stripe_orders')
          .select('*')
          .eq('customer_id', customerData.customer_id)
          .eq('deleted_at', null)
          .order('created_at', { ascending: false });

        if (orders) {
          const formattedOrders = orders.map(order => ({
            productName: getProductNameFromMetadata(order) || 'Service Purchase',
            status: order.payment_status,
            amount: order.amount_total,
            currency: order.currency,
            purchaseDate: order.created_at
          }));

          setSubscriptions(formattedOrders);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  const getProductNameFromMetadata = (order: any): string | null => {
    // This would typically come from Stripe metadata
    // For now, we'll use the amount to determine the product
    const amount = order.amount_total / 100; // Convert from cents
    
    if (amount === 59) return 'Tax Triage Consult';
    if (amount === 149) return 'Annual Return Consult';
    if (amount === 349) return 'Freelancer Start Pack';
    if (amount === 49) return 'Partner Listing Early Access (Lifetime)';
    
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-surface-dark';
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Your Services
        </h3>
        <p className="text-gray-600 text-sm">
          No services purchased yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-white">
          Your Services
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {subscriptions.map((subscription, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-white">
                  {subscription.productName}
                </h4>
                <p className="text-sm text-gray-600">
                  Purchased on {formatDate(subscription.purchaseDate)}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white">
                  {formatPrice(subscription.amount, subscription.currency)}
                </div>
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
