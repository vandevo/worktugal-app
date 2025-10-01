import React, { useState } from 'react';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { stripeProducts } from '../stripe-config';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface PricingSectionProps {
  onProductSelect?: (productKey: string) => void;
}

export function PricingSection({ onProductSelect }: PricingSectionProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (productKey: string) => {
    if (!user) return;
    
    setLoading(productKey);
    
    try {
      const product = stripeProducts[productKey as keyof typeof stripeProducts];
      
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          priceId: product.priceId,
          email: user.email,
          productType: productKey
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const consultProduct = stripeProducts['tax-triage-consult'];
  const partnerProduct = stripeProducts['partner-listing-lifetime'];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Choose Your Service
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional tax consultation or partner marketplace access
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tax Consultation */}
          <Card className="relative overflow-hidden border-2 border-teal-200 bg-white">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Tax Consultation</h3>
                  <p className="text-sm text-slate-500">Professional guidance</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-slate-900">{consultProduct.currencySymbol}{consultProduct.price}</span>
                  <span className="text-slate-500">one-time</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {consultProduct.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700">30-minute video consultation</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700">OCC-certified accountant</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700">Written outcome note delivered</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700">48-hour delivery guarantee</span>
                </li>
              </ul>

              <Button
                onClick={() => handleCheckout('tax-triage-consult')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                disabled={loading === 'tax-triage-consult'}
              >
                {loading === 'tax-triage-consult' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Book Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </Card>

          {/* Partner Listing */}
          <Card className="relative overflow-hidden border-2 border-orange-200 bg-white">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="absolute top-4 right-4">
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                LIMITED
              </span>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Partner Access</h3>
                  <p className="text-sm text-slate-500">Lifetime membership</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-slate-900">{partnerProduct.currencySymbol}{partnerProduct.price}</span>
                  <span className="text-slate-500">lifetime</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {partnerProduct.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-slate-700">Lifetime marketplace visibility</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-slate-700">Access to premium audience</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-slate-700">No renewal fees ever</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-slate-700">Limited to 25 businesses</span>
                </li>
              </ul>

              <Button
                onClick={() => handleCheckout('partner-listing-lifetime')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={loading === 'partner-listing-lifetime'}
              >
                {loading === 'partner-listing-lifetime' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Join Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}