import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Alert } from './ui/Alert';
import { Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { STRIPE_PRODUCTS, type ProductName } from '../stripe-config';
import { supabase } from '../lib/supabase';

interface ServicesPageProps {
  onServiceSelect: (productName: ProductName) => void;
}

export function ServicesPage({ onServiceSelect }: ServicesPageProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const handleServiceSelect = async (productName: ProductName) => {
    setLoading(productName);
    setError('');

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please sign in to purchase services.');
        setLoading(null);
        return;
      }

      // Create Stripe checkout session
      const { data, error: functionError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          priceId: STRIPE_PRODUCTS[productName].priceId,
          email: user.email,
          productName: productName,
          userId: user.id
        }
      });

      if (functionError) throw functionError;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  const accountingServices = [
    'Tax Triage Consult',
    'Annual Return Consult', 
    'Freelancer Start Pack'
  ] as const;

  const partnerServices = [
    'Partner Listing Early Access (Lifetime)'
  ] as const;

  const getServiceIcon = (productName: ProductName) => {
    switch (productName) {
      case 'Tax Triage Consult':
        return <Clock className="w-8 h-8 text-blue-600" />;
      case 'Annual Return Consult':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'Freelancer Start Pack':
        return <TrendingUp className="w-8 h-8 text-purple-600" />;
      case 'Partner Listing Early Access (Lifetime)':
        return <Users className="w-8 h-8 text-orange-600" />;
      default:
        return <CheckCircle className="w-8 h-8 text-gray-600" />;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price);
  };

  const renderServiceCard = (productName: ProductName) => {
    const product = STRIPE_PRODUCTS[productName];
    const isLoading = loading === productName;

    return (
      <Card key={productName} className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getServiceIcon(productName)}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {productName}
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price, product.currency)}
              </span>
              <Button
                onClick={() => handleServiceSelect(productName)}
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2"
              >
                {isLoading ? 'Processing...' : 'Book Now'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Professional Tax & Business Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get expert guidance from certified Portuguese accountants and join our exclusive partner network.
          </p>
        </div>

        {error && (
          <Alert type="error" className="mb-8">
            {error}
          </Alert>
        )}

        {/* Accounting Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Accounting & Tax Consultations
          </h2>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {accountingServices.map(renderServiceCard)}
          </div>
        </section>

        {/* Partner Services Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Partner with Us
          </h2>
          <div className="grid gap-6">
            {partnerServices.map(renderServiceCard)}
          </div>
        </section>
      </div>
    </div>
  );
}