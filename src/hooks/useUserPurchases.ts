import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { UserPurchase } from '../types';

/**
 * Hook to fetch user's purchase history with detailed error handling
 * Includes refetch capability for updating after new purchases
 * Used in PurchaseHistory component
 */

export const useUserPurchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPurchases = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user's orders
        const { data: orders, error: ordersError } = await supabase
          .from('stripe_orders')
          .select(`
            id,
            amount_total,
            currency,
            payment_status,
            status,
            created_at,
            stripe_customers!inner(user_id)
          `)
          .eq('stripe_customers.user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          throw ordersError;
        }

        // Transform the data
        const purchaseData: UserPurchase[] = orders?.map(order => ({
          id: order.id.toString(),
          productName: 'Purchase', // Will be enhanced with actual product names
          amount: order.amount_total / 100, // Convert cents to euros
          currency: order.currency,
          status: order.status,
          purchaseDate: new Date(order.created_at).toLocaleDateString()
        })) || [];

        setPurchases(purchaseData);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError(err instanceof Error ? err.message : 'Failed to load purchases');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  return {
    purchases,
    loading,
    error,
    refetch: () => {
      if (user) {
        fetchPurchases();
      }
    }
  };
};