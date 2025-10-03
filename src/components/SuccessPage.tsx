import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Calendar } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface PurchaseData {
  productName: string;
  amount: number;
  currency: string;
  orderDate: string;
}

export const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    const fetchPurchaseData = async () => {
      try {
        // Fetch the latest order for this user
        const { data: orders, error } = await supabase
          .from('stripe_orders')
          .select(`
            *,
            stripe_customers!inner(user_id)
          `)
          .eq('stripe_customers.user_id', user?.id)
          .eq('checkout_session_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching purchase data:', error);
          return;
        }

        if (orders && orders.length > 0) {
          const order = orders[0];
          setPurchaseData({
            productName: 'Your Purchase', // Will be updated with actual product name
            amount: order.amount_total / 100, // Convert cents to euros
            currency: order.currency,
            orderDate: new Date(order.created_at).toLocaleDateString()
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPurchaseData();
    }
  }, [sessionId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your purchase details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-slate-600">
            Thank you for your purchase. Your order has been confirmed and you'll receive 
            further instructions via email shortly.
          </p>
        </motion.div>

        {purchaseData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Product</span>
                  <span className="font-medium text-slate-900">{purchaseData.productName}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Amount</span>
                  <span className="font-medium text-slate-900">
                    €{purchaseData.amount.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Order Date</span>
                  <span className="font-medium text-slate-900">{purchaseData.orderDate}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600">Customer</span>
                  <span className="font-medium text-slate-900">{user?.email}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What Happens Next?
          </h3>
          
          <div className="space-y-3 text-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span>You'll receive a confirmation email with order details</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span>Our team will contact you within 24 hours to schedule your consultation</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span>Receive your consultation and written outcome document</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4"
        >
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            View My Account
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <p className="text-sm text-slate-500">
            Questions? Contact our support team at support@worktugal.com
          </p>
        </motion.div>
      </div>
    </div>
  );
};