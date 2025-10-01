import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Calendar, Receipt, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { stripeProducts } from '../stripe-config';
import { supabase } from '../lib/supabase';

interface PurchaseDetails {
  customerEmail: string;
  productName: string;
  amount: number;
  currency: string;
  purchaseDate: string;
}

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Query stripe_orders to get purchase details
        const { data: order, error } = await supabase
          .from('stripe_orders')
          .select(`
            *,
            stripe_customers!inner(
              user_id,
              customer_id
            )
          `)
          .eq('checkout_session_id', sessionId)
          .single();

        if (error) throw error;

        if (order) {
          // Get user details
          const { data: user } = await supabase.auth.getUser();
          
          // Try to determine product from amount
          const productKey = Object.keys(stripeProducts).find(key => {
            const product = stripeProducts[key as keyof typeof stripeProducts];
            return Math.abs(product.price * 100 - order.amount_total) < 1; // Compare in cents
          });

          const productName = productKey 
            ? stripeProducts[productKey as keyof typeof stripeProducts].name
            : 'Purchase';

          setPurchaseDetails({
            customerEmail: user.user?.email || '',
            productName,
            amount: order.amount_total / 100, // Convert from cents
            currency: order.currency.toUpperCase(),
            purchaseDate: new Date(order.created_at).toLocaleDateString()
          });
        }
      } catch (error) {
        console.error('Error fetching purchase details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your purchase details...</p>
        </div>
      </div>
    );
  }

  if (!sessionId || !purchaseDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Session</h1>
          <p className="text-slate-600 mb-6">
            We couldn't find your purchase details. Please check your email for confirmation.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-8 mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-lg text-slate-600 mb-8">
              Thank you for your purchase. Your payment has been processed successfully.
            </p>

            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-slate-900 mb-4">Purchase Details</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-600">Product:</span>
                  <span className="font-medium text-slate-900">{purchaseDetails.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-medium text-slate-900">
                    €{purchaseDetails.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium text-slate-900">{purchaseDetails.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium text-slate-900">{purchaseDetails.purchaseDate}</span>
                </div>
              </div>
            </div>

            {purchaseDetails.productName.includes('Tax Triage') && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h4 className="font-semibold text-teal-900">Next Steps</h4>
                </div>
                <p className="text-teal-800 text-sm">
                  You'll receive an email within 2 hours with booking instructions to schedule your 
                  30-minute consultation. Your written outcome note will be delivered within 48 hours 
                  of your consultation.
                </p>
              </div>
            )}

            {purchaseDetails.productName.includes('Partner Listing') && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <ArrowRight className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-900">Welcome to the Marketplace!</h4>
                </div>
                <p className="text-orange-800 text-sm">
                  Your business now has lifetime access to our perk marketplace. You'll receive 
                  setup instructions within 24 hours to complete your listing.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex-1"
              >
                Return Home
              </Button>
              <Button 
                onClick={() => window.location.href = '/perks'}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Browse Perks
              </Button>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Questions about your purchase?{' '}
              <a href="mailto:hello@worktugal.com" className="text-teal-600 hover:text-teal-700">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}