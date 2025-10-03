import { FC } from 'react';

export const AccountingServices: FC = () => {
  const { createCheckoutSession, isLoading } = useStripeCheckout();

  const accountingProducts = STRIPE_PRODUCTS.filter(product => 
    product.name.includes('Freelancer') || product.name.includes('Tax Triage')
  );

  const handlePurchase = async (priceId: string, productName: string) => {
    await createCheckoutSession(priceId, productName);
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Calculator className="w-4 h-4" />
            Accounting Desk
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Professional Tax Consulting
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-3xl mx-auto"
          >
            Get expert guidance from OCC-certified accountants specialized in Portuguese tax law. 
            Perfect for freelancers, remote workers, and anyone navigating Portugal's tax system.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {accountingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
            >
              <ProductCard
                product={product}
                onPurchase={handlePurchase}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-xl border border-slate-200 p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What to Expect
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  Video consultation with certified Portuguese accountant
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  Written outcome document delivered within 48 hours
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  Personalized advice for your specific situation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  Follow-up email support included
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};