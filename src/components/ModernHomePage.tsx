import React, { useState, useEffect } from 'react';
import { ModernHero } from './accounting/ModernHero'; // The new hero
import { CheckupHowItWorks } from './accounting/CheckupHowItWorks';
import { CheckupWhyItMatters } from './accounting/CheckupWhyItMatters';
import { CheckupSocialProof } from './accounting/CheckupSocialProof';
import { CheckupCTA } from './accounting/CheckupCTA';
import { CheckupFAQ } from './accounting/CheckupFAQ';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Shield, MapPin, Globe, Instagram, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Seo } from './Seo';
import { ComplianceDisclaimer } from './ComplianceDisclaimer';

interface FeaturedPartner {
  id: string;
  business_name: string;
  perk_title: string;
  perk_description: string;
  business_category: string;
  business_neighborhood: string;
  perk_logo: string | null;
  business_website: string | null;
  business_instagram: string | null;
  perk_is_portuguese_owned: boolean;
}

export const ModernHomePage: React.FC = () => {
  const [featuredPartners, setFeaturedPartners] = useState<FeaturedPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedPartners = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('partner_submissions')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setFeaturedPartners(data || []);
      } catch (err) {
        console.error('Error fetching featured partners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPartners();
  }, []);

  const handleStartCheckup = () => {
    navigate('/checkup');
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Seo
        title="Worktugal - The Operating System for Portugal Expats"
        description="Verify your compliance status and find expert help. The AI-powered compliance engine for remote professionals in Portugal."
        ogTitle="Worktugal - Compliance Readiness & Expert Match"
        ogDescription="Check your NHR status, tax residency, and compliance score in 3 minutes. Free tools for Portugal expats."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/"
      />

      {/* Primary: Modern AI Search Hero */}
      <ModernHero />

      {/* How It Works - kept as is, it matches the dark theme */}
      <CheckupHowItWorks />

      {/* Why This Matters */}
      <CheckupWhyItMatters />

      {/* Mid-page CTA */}
      <CheckupCTA onStartCheckup={handleStartCheckup} />

      {/* Social Proof */}
      <CheckupSocialProof />

      {/* FAQ Section */}
      <CheckupFAQ />

      {/* Secondary: Featured Partners Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-900 via-gray-850 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-500/20">
              <Shield className="h-4 w-4" />
              <span>Founding Partners</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Lisbon's best
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We work alongside established accountants, coworking spaces, and service providers who support remote professionals in Portugal.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading partners...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="glass" className="p-5 h-full hover:border-blue-400/30 transition-all duration-300 bg-gray-800/30">
                      {/* Trusted Partner Badge */}
                      <div className="mb-3">
                        <div className="inline-flex items-center space-x-1.5 bg-blue-400/10 text-blue-300 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-blue-400/20">
                          <Shield className="h-3 w-3" />
                          <span>Trusted Partner</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 mb-4">
                        <img
                          src={partner.perk_logo || 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={partner.business_name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-base text-white leading-tight flex-1">{partner.business_name}</h3>
                            {partner.perk_is_portuguese_owned && (
                              <div className="bg-green-400/10 text-green-300 px-2 py-0.5 rounded-full text-xs font-medium border border-green-400/20">
                                Local
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{partner.business_neighborhood}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                          {partner.business_category}
                        </span>
                      </div>

                      <h4 className="font-semibold text-base mb-2 text-blue-300">{partner.perk_title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        {truncateDescription(partner.perk_description)}
                      </p>

                      {/* Business Links */}
                      <div className="flex items-center space-x-3 text-xs">
                        {partner.business_website && (
                          <a
                            href={partner.business_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Globe className="h-3 w-3" />
                            <span>Website</span>
                          </a>
                        )}
                        {partner.business_instagram && (
                          <a
                            href={partner.business_instagram.startsWith('@')
                              ? `https://www.instagram.com/${partner.business_instagram.slice(1)}`
                              : partner.business_instagram.startsWith('http')
                                ? partner.business_instagram
                                : `https://www.instagram.com/${partner.business_instagram}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-pink-400 hover:text-pink-300 transition-colors"
                          >
                            <Instagram className="h-3 w-3" />
                            <span>Instagram</span>
                          </a>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/partners')}
                  className="text-gray-400 hover:text-white"
                >
                  See all partners
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer Disclaimer */}
      <ComplianceDisclaimer variant="footer" />
    </>
  );
};
