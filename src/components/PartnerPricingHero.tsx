import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const PartnerPricingHero: React.FC = () => {
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotsLeft = async () => {
      try {
        setLoading(true);
        const { count, error } = await supabase
          .from('partner_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        if (error) throw error;

        const total = 25;
        const remaining = Math.max(0, total - (count || 0));
        setSpotsLeft(remaining);
      } catch (err) {
        console.error('Error fetching spots:', err);
        setSpotsLeft(25);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotsLeft();
  }, []);

  const features = [
    'Lifetime visibility to 1,000+ verified remote workers',
    "Featured in Lisbon's #1 perk marketplace",
    'Direct contact from qualified leads',
    'No renewal fees or hidden costs',
    'Limited to first 25 businesses only',
    'List unlimited perks and offers'
  ];

  const handleListBusiness = () => {
    window.location.href = '/services';
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-400/30 mb-6">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-300">LIMITED EARLY ACCESS</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Join Lisbon's #1</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Perk Marketplace
            </span>
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get discovered by remote workers who are actively looking for services like yours
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="glass" className="relative overflow-hidden border-2 border-gradient-to-r from-orange-400/30 via-pink-400/30 to-purple-400/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 blur-3xl rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform -translate-x-32 translate-y-32"></div>

            <div className="relative p-8 md:p-12">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-5xl md:text-6xl font-bold text-white">€49</span>
                    <span className="text-xl text-gray-400">lifetime</span>
                  </div>
                </div>

                {!loading && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg shadow-orange-500/50">
                    <span className="text-sm font-bold text-white">{spotsLeft} SPOTS LEFT</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Join Lisbon's #1 Perk Marketplace. Get lifetime visibility to remote workers, expats, and
                digital nomads. This early access offer is limited to 25 local businesses only. No renewals,
                no hidden fees.
              </p>

              <ul className="space-y-4 mb-10">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/50">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200 font-medium">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="space-y-4">
                <Button
                  onClick={handleListBusiness}
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-400 hover:via-pink-400 hover:to-purple-400 text-white font-bold text-lg py-4 shadow-2xl shadow-pink-500/50 border-none"
                >
                  <span>List My Business Now</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-center text-sm text-gray-400">
                  No credit card required to start • Secure payment via Stripe
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400">
            This early access pricing is limited to the first 25 businesses.
            <br />
            <span className="text-gray-500">Regular price will be €149/year after launch.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
