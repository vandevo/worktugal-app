import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrderDetails {
  productName: string;
  amount: number;
  currency: string;
  customerEmail: string;
  status: string;
}

export function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: functionError } = await supabase.functions.invoke('verify-session', {
          body: { sessionId }
        });

        if (functionError) throw functionError;

        if (data) {
          setOrderDetails(data);
        } else {
          setError('Session not found or invalid');
        }
      } catch (err) {
        console.error('Session verification error:', err);
        setError('Failed to verify payment. Please contact support if you were charged.');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10B981] mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/8 rounded-2xl p-8 text-center max-w-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#1A5C44] transition-colors"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/8 rounded-2xl p-8 text-center max-w-sm shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="text-slate-600 dark:text-slate-400 mb-6">Payment details not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#1A5C44] transition-colors"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/8 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex justify-center mb-6">
            <div className="bg-[#0F3D2E]/10 rounded-full p-4">
              <CheckCircle className="w-10 h-10 text-[#0F3D2E]" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">
            Subscribed
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-center mb-8 text-sm">
            Your Worktugal Pro subscription is active. A confirmation email is on its way.
          </p>

          <div className="border border-[#0F3D2E]/10 dark:border-white/8 rounded-xl p-5 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Plan</span>
                <span className="font-semibold text-slate-900 dark:text-white">Worktugal Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Price</span>
                <span className="font-semibold text-slate-900 dark:text-white">€5/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Email</span>
                <span className="font-semibold text-slate-900 dark:text-white">{orderDetails.customerEmail}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0F3D2E] text-white px-6 py-4 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 transition-all"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
