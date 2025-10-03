import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { UserPurchase } from '../types';

/**
 * Hook to fetch and manage user's subscription and purchase history
 * Used primarily in SubscriptionStatus component to display payment history
 */

export function useSubscription() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get customer data first
        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('customer_id')
          .eq('user_id', user.id)
          .single();

        if (!customerData) {
          setLoading(false);
          return;
        }

        // Get all orders for this customer
        const { data: orders } = await supabase
          .from('stripe_orders')
          .select('*')
          .eq('customer_id', customerData.customer_id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (orders) {
          const formattedPurchases: UserPurchase[] = orders.map(order => ({
            id: order.id.toString(),
            productName: determineProductName(order.amount_total),
            amount: order.amount_total / 100, // Convert from cents
            currency: order.currency.toUpperCase(),
            status: order.payment_status,
            purchaseDate: new Date(order.created_at).toLocaleDateString()
          }));

          setPurchases(formattedPurchases);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  return { purchases, loading };
}

// Helper function to determine product name from amount
function determineProductName(amountInCents: number): string {
  // Match amount to known products
  if (Math.abs(amountInCents - 5900) < 10) { // €59.00 (allow small variance)
    return 'Tax Triage Consultation';
  }
  if (Math.abs(amountInCents - 4900) < 10) { // €49.00
    return 'Partner Listing (Lifetime)';
  }
  return 'Purchase';
}