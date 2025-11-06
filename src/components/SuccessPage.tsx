import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, User, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Seo } from './Seo';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch order data from Stripe orders table
        const { data: orders, error: orderError } = await supabase
          .from('stripe_orders')
          .select('*')
          .eq('checkout_session_id', sessionId)
          .single();

        if (orderError) {
          throw orderError;
        }

        setOrderData(orders);
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Failed to load order information');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [sessionId]);

  useEffect(() => {
    // Track successful conversion
    if (orderData && typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: orderData.payment_intent_id,
        value: orderData.amount_total / 100, // Convert from cents
        currency: orderData.currency.toUpperCase()
      });
    }
  }, [orderData]);

  if (!sessionId) {
    return <Navigate to="/" replace />;
  }

  if (loading || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your order details...</p>
            </>
          ) : (
            <p className="text-red-600">{error}</p>
          )}
        </div>
      </div>
    );
  }

  const product = orderData ? getProductByPriceId(orderData.price_id) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Seo
        title="Order Successful - Payment Confirmation"
        description="Thank you for your purchase. Your order has been confirmed."
        noindex={true}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Info Card */}
          {orderData && (
            <Card className="p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product?.name || 'Service Purchase'}
                  </h3>
                  <p className="text-gray-600">{product?.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    €{(orderData.amount_total / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">One-time payment</p>
                </div>
              </div>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-gray-600">Check your email for order confirmation and next steps.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Service Delivery</p>
                  <p className="text-gray-600">Our team will contact you within 24 hours to schedule your consultation.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Get Support</p>
                  <p className="text-gray-600">Access ongoing support and resources for your Portugal journey.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center"
            >
              Return Home
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/services'}
              className="flex items-center justify-center"
            >
              View All Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}