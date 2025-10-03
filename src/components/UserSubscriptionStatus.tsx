import React from 'react';
import { useStripeOrders } from '../hooks/useStripeOrders';
import { getProductByPriceId } from '../stripe-config';
import { Badge } from './ui/Badge';

interface UserSubscriptionStatusProps {
  className?: string;
}

export function UserSubscriptionStatus({ className = '' }: UserSubscriptionStatusProps) {
  const { orders, loading } = useStripeOrders();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  const activeOrders = orders.filter(order => order.status === 'completed');
  
  if (activeOrders.length === 0) {
    return (
      <Badge variant="outline" className={className}>
        No Active Services
      </Badge>
    );
  }

  // Show the most recent active order
  const latestOrder = activeOrders[0];
  const product = getProductByPriceId(latestOrder.price_id);

  return (
    <Badge variant="success" className={className}>
      {product?.name || 'Active Service'}
    </Badge>
  );
}