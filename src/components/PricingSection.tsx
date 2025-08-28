import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Loader2, Target } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Alert } from './ui/Alert';
import { LISTING_PRICE } from '../utils/constants';
import { getApprovedSubmissionsCount } from '../lib/submissions';

const TOTAL_EARLY_ACCESS_SPOTS = 25;

interface PricingSectionProps {
  onGetStarted: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onGetStarted }) => {
  const [error, setError] = useState<string | null>(null);
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [spotsLoading, setSpotsLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setSpotsLoading(true);
        const approvedCount = await getApprovedSubmissionsCount();
        setSpotsLeft(TOTAL_EARLY_ACCESS_SPOTS - approvedCount);
      } catch (err) {
        console.error('Failed to fetch spots left:', err);
        setSpotsLeft(null);
      } finally {
        setSpotsLoading(false);
      }
    };
    fetchSpots();
  }, []);

  const handleStartListing = () => {
    // Track button click for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pricing_section_list_offer_click', {
        event_category: 'engagement',
        event_label: 'pricing_section',
        value: 1
      });
    }
    
    onGetStarted();
  };

  if (spotsLoading) {
    return (
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading pricing information...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="pricing" className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
            Reach Verified Remote Clients Without Ads or Agencies
          </h2>
          <p className="text-lg sm:text-xl text-blue-300 font-medium mb-4">
            €{LISTING_PRICE} one time payment
          </p>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Cold outreach is noisy. Agencies are expensive.<br />
            This is the fastest way to get discovered by remote professionals in Lisbon.<br />
            List your offer where remote professionals actually look.<br />
            You provide a perk. We give you visibility. They come to you.
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-8 max-w-2xl mx-auto" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* FOMO Badge */}
            <div className="text-center mb-8 sm:mb-10">
              <motion.div
                animate={spotsLeft !== null && spotsLeft <= 10 ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(239, 68, 68, 0)",
                    "0 0 0 8px rgba(239, 68, 68, 0.1)",
                    "0 0 0 0 rgba(239, 68, 68, 0)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`inline-flex items-center space-x-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full border font-semibold shadow-lg ${
                  spotsLeft !== null && spotsLeft <= 5
                    ? 'bg-red-600/20 text-red-300 border-red-600/40 shadow-red-500/20'
                    : spotsLeft !== null && spotsLeft <= 10
                    ? 'bg-orange-600/20 text-orange-300 border-orange-600/40 shadow-orange-500/20'
                    : 'bg-blue-600/20 text-blue-300 border-blue-600/40'
                }`}
              >
                <span className="text-sm sm:text-base font-bold tracking-wide">
                  {spotsLeft !== null 
                    ? spotsLeft <= 5
                      ? `🔥 FINAL ${spotsLeft} SPOTS`
                      : spotsLeft <= 10
                      ? `⚡ Only ${spotsLeft} left`
                      : `${spotsLeft} spots remaining`
                    : 'Loading spots...'
                  }
                </span>
              </motion.div>
              <div className="mt-4 sm:mt-6 space-y-3 max-w-md mx-auto">
                <p className="text-sm sm:text-base font-medium text-orange-400">
                  Lock your spot. Get visibility. Be first
                </p>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-4 sm:px-0">
                  Only 25 listings available at this early access price. Once filled, the next tier will open at a higher rate.
                </p>
              </div>
            </div>

            <Card className="p-6 sm:p-8 lg:p-10 text-center" hover>
              
              <div className="mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 leading-tight">
                  🎯 Early Access Lifetime Listing
                </h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-400">€{LISTING_PRICE}</span>
                  <span className="text-gray-400 ml-3 text-base sm:text-lg">one time</span>
                </div>
                <p className="text-sm sm:text-base text-gray-400 mb-8">No renewals • No surprises</p>
                
                <div className="text-center mb-8">
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md mx-auto">
                    Join the marketplace where quality remote professionals discover trusted local businesses. No spam, no cold calls - just genuine connections.
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 mb-10 text-left max-w-lg mx-auto">
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base leading-relaxed">Listed on our public perk directory</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base leading-relaxed">"Trusted Partner" badge on your listing</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base leading-relaxed">
                    Verified profile access with a partner dashboard <span className="text-xs text-gray-500 font-normal">— coming soon</span>
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base leading-relaxed">Featured in our monthly newsletter</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base leading-relaxed">Shoutouts at select in-person events</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base leading-relaxed">Ongoing support to update or refresh your perks</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base leading-relaxed">Invite-only access to our Partner Insider Network as we grow</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl"
                onClick={handleStartListing}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                List My Offer • €{LISTING_PRICE}
              </Button>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-gray-800/60 via-gray-800/50 to-gray-800/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto border border-gray-700/30 shadow-xl"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-6 sm:mb-8">
              How it works:
            </h3>
            
            {/* Mobile-first step cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { number: "1", title: "Fill business details", icon: "📝" },
                { number: "2", title: "Setup your perk", icon: "🎁" },
                { number: "3", title: "Secure payment", icon: "💳" },
                { number: "4", title: "Go live", icon: "🚀" }
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-gray-700/40 hover:bg-gray-700/60 rounded-xl p-4 text-center transition-all duration-300 border border-gray-600/20 hover:border-gray-500/40 hover:shadow-lg hover:shadow-blue-500/5">
                    {/* Step number with iOS-style badge */}
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-3 shadow-lg group-hover:scale-105 transition-transform duration-200">
                      {step.number}
                    </div>
                    
                    {/* Emoji icon */}
                    <div className="text-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                      {step.icon}
                    </div>
                    
                    {/* Step title */}
                    <p className="text-sm font-medium text-gray-300 leading-tight">
                      {step.title}
                    </p>
                  </div>
                  
                  {/* Connection arrow for desktop only */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Mobile connection indicators */}
            <div className="lg:hidden flex justify-center items-center space-x-2 mt-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.3}s` }}></div>
                  {index < 2 && <div className="w-1 h-1 bg-gray-600 rounded-full"></div>}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700/30">
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Takes 3-5 minutes to complete • Review within 24 hours • Trusted by 1,000+ remote professionals
              </p>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

    </>
  );
};