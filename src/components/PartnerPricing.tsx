import { FC } from 'react';

interface PartnerPricingProps {
  onGetStarted: () => void;
}

export const PartnerPricing: FC<PartnerPricingProps> = ({ onGetStarted }) => {
  const partnerProduct = STRIPE_PRODUCTS.find(p => p.name === 'Partner Listing Early Access (Lifetime)');

  if (!partnerProduct) {
    return null;
  }

  const features = [
    'Lifetime visibility to 1,000+ verified remote workers',
    'Featured in our trusted partner network',
    'Direct contact from qualified leads',
    'No renewal fees or hidden costs',
    'Limited to first 25 businesses only',
    'List unlimited perks and offers'
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 backdrop-blur-xl text-orange-300 px-5 py-2.5 rounded-full mb-6 border border-orange-500/20 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold tracking-wide">LIMITED EARLY ACCESS</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Become a</span>
            <br />
            <span className="bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Trusted Partner
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connect with remote workers seeking quality services like yours
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-2 border-orange-500/30 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"></div>

            <div className="absolute top-6 right-6">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                25 SPOTS LEFT
              </span>
            </div>

            <div className="p-8 md:p-12">
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-5xl md:text-6xl font-bold text-white">€{partnerProduct.price}</span>
                  <span className="text-2xl text-gray-400">lifetime</span>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {partnerProduct.description}
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200 text-lg leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-semibold py-6 rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 text-lg border border-orange-400/20 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.98] hover:scale-[1.01] active:shadow-lg"
              >
                <span>List My Business Now</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <p className="text-center text-sm text-gray-400 mt-6">
                No credit card required to start • Secure payment via Stripe
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-sm">
            This early access pricing is limited to the first 25 businesses.
            <br />
            Regular price will be €149/year after launch.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
