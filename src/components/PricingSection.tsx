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
      <section id="pricing" className="py-20 bg-gradient-to-b from-gray-900/50 to-gray-800/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(147,51,234,0.06),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
            Reach Verified Remote Clients Without Ads or Agencies
          </h2>
          <p className="text-xl sm:text-2xl bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-bold mb-6">
            €{LISTING_PRICE} one time payment
          </p>
          <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Cold outreach doesn't work for professional services. Agencies are expensive and generic.<br />
            This is where remote workers discover trusted coworking, wellness, business services, and authentic local experiences.<br />
            List your expert service where quality clients actually look.<br />
            You provide value. We connect you with remote professionals who invest in quality.
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
            className="relative max-w-2xl mx-auto"
          >
            {/* FOMO Badge */}
            <div className="text-center mb-10 sm:mb-12">
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
                className={`inline-flex items-center space-x-2 px-6 py-4 sm:px-7 sm:py-5 rounded-full border font-bold shadow-2xl backdrop-blur-xl ${
                  spotsLeft !== null && spotsLeft <= 5
                    ? 'bg-red-500/10 text-red-300 border-red-400/30 shadow-red-500/25'
                    : spotsLeft !== null && spotsLeft <= 10
                    ? 'bg-orange-500/10 text-orange-300 border-orange-400/30 shadow-orange-500/25'
                    : 'bg-blue-500/10 text-blue-300 border-blue-400/30 shadow-blue-500/25'
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
              <div className="mt-6 sm:mt-8 space-y-4 max-w-lg mx-auto">
                <p className="text-sm sm:text-base font-medium text-orange-400">
                  Lock your spot. Get visibility. Be first
                </p>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed px-4 sm:px-0">
                  Only 25 listings available at this early access price. Once filled, the next tier will open at a higher rate.
                </p>
              </div>
            </div>

            <Card variant="glass" className="p-8 sm:p-10 lg:p-12 text-center relative overflow-hidden" hover>
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl" />
              
              <div className="relative mb-10 sm:mb-12">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  🎯 Early Access Lifetime Listing
                </h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">€{LISTING_PRICE}</span>
                  <span className="text-gray-300 ml-4 text-lg sm:text-xl font-medium">one time</span>
                </div>
                <p className="text-base sm:text-lg text-gray-300 mb-10 font-medium">No renewals • No surprises</p>
                
                <div className="text-center mb-8">
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-lg mx-auto">
                    Join the marketplace where quality remote professionals discover trusted local businesses. No spam, no cold calls - just genuine connections.
                  </p>
                </div>
              </div>

              <div className="relative space-y-5 sm:space-y-6 mb-12 text-left max-w-2xl mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-xl border border-green-400/20">
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-base sm:text-lg leading-relaxed text-gray-200">Listed on our public perk directory</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-xl border border-green-400/20">
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-base sm:text-lg leading-relaxed text-gray-200">"Trusted Partner" badge on your listing</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-xl border border-green-400/20">
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-sm sm:text-base leading-relaxed">
                    Verified profile access with a partner dashboard <span className="text-xs text-gray-500 font-normal">— coming soon</span>
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-xl border border-green-400/20">
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-base sm:text-lg leading-relaxed text-gray-200">Featured in our monthly newsletter</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-xl border border-green-400/20">
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-base sm:text-lg leading-relaxed text-gray-200">Shoutouts at select in-person events</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-xl border border-green-400/20">
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-base sm:text-lg leading-relaxed text-gray-200">Ongoing support to update or refresh your perks</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 backdrop-blur-xl border border-green-400/20">
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-base sm:text-lg leading-relaxed text-gray-200">Invite-only access to our Partner Insider Network as we grow</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-16 sm:h-18 text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl rounded-2xl transition-all duration-300"
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
            className="bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 sm:p-10 max-w-4xl mx-auto border border-white/[0.06] shadow-2xl relative overflow-hidden"
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl" />
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-6 sm:mb-8">
              How it works:
            </h3>
            
            {/* Mobile-first step cards */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                  <div className="bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 text-center transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12] hover:shadow-xl hover:shadow-blue-500/10 group-hover:scale-105">
                    {/* Step number with iOS-style badge */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-sm font-bold mx-auto mb-4 shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-all duration-300 border border-blue-400/20">
                      {step.number}
                    </div>
                    
                    {/* Emoji icon */}
                    <div className="text-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    {/* Step title */}
                    <p className="text-sm font-semibold text-gray-200 leading-tight">
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
                  <div className="w-2.5 h-2.5 bg-blue-400/60 rounded-full animate-pulse backdrop-blur-sm" style={{ animationDelay: `${index * 0.3}s` }}></div>
                  {index < 2 && <div className="w-1.5 h-1.5 bg-gray-500/60 rounded-full"></div>}
                </div>
              ))}
            <p className="text-base sm:text-lg text-white mb-10 font-medium">No renewals • No surprises</p>
            
            <div className="relative mt-8 pt-8 border-t border-white/[0.06]">
              <p className="text-base sm:text-lg text-white leading-relaxed max-w-lg mx-auto">
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