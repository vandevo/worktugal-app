import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, FileText } from 'lucide-react';

export function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Fetch order details from Supabase
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-order-details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      }).then(res => res.json());
      
      setOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. We'll begin processing your compliance review shortly.
        </p>

        {loading ? (
          <div className="text-gray-500">Loading order details...</div>
        ) : orderDetails ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            <div className="space-y-2">
              <p><strong>Service:</strong> {orderDetails.product_name}</p>
              <p><strong>Amount:</strong> €{orderDetails.amount}</p>
              <p><strong>Order ID:</strong> {orderDetails.id}</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You'll receive an email confirmation shortly with next steps for your compliance review.
          </p>
          
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Return to Services
          </Link>
        </div>
      </div>
    </div>
  );
}
