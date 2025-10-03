import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, CreditCard } from 'lucide-react';
import { Card } from './ui/Card';
import { useUserPurchases } from '../hooks/useUserPurchases';

export const PurchaseHistory: React.FC = () => {
  const { purchases, loading, error } = useUserPurchases();

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load purchase history</p>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-teal-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          Purchase History
        </h2>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No purchases yet
          </h3>
          <p className="text-slate-600">
            Your purchase history will appear here after you make your first order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase, index) => (
            <motion.div
              key={purchase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {purchase.productName}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {purchase.purchaseDate}
                      </span>
                      <span className="capitalize">
                        {purchase.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-slate-900">
                    €{purchase.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 uppercase">
                    {purchase.currency}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};