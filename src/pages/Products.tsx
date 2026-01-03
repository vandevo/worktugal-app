import React from 'react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { ProductCard } from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Products() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Compliance Services
        </h1>
        <p className="text-lg text-gray-600">
          Professional compliance review services to help you identify and mitigate risks.
        </p>
      </div>

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            Please <Link to="/auth" className="underline font-medium">sign in</Link> to purchase services.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {STRIPE_PRODUCTS.map((product) => (
          <ProductCard key={product.priceId} product={product} />
        ))}
      </div>
    </div>
  );
}