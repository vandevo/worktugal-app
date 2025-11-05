import React, { useState, useEffect } from 'react';
import { CheckupHero } from './accounting/CheckupHero';
import { CheckupHowItWorks } from './accounting/CheckupHowItWorks';
import { CheckupWhyItMatters } from './accounting/CheckupWhyItMatters';
import { CheckupSocialProof } from './accounting/CheckupSocialProof';
import { CheckupCTA } from './accounting/CheckupCTA';
import { CheckupFAQ } from './accounting/CheckupFAQ';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Shield, MapPin, Globe, Instagram, ArrowRight, ExternalLink } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Seo } from './Seo';

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

export const HomePage: React.FC = () => {
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
        title="Tax compliance tools for freelancers in Portugal"
        description="Are you tax compliant in Portugal? Take our free 3-minute checkup. Get your compliance score, see what you're missing, and get a clear action plan."
        ogTitle="Worktugal - Compliance tools for freelancers in Portugal"
        ogDescription="Free tax compliance checkup for freelancers in Portugal. Find out if you're compliant in 3 minutes."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Worktugal",
          "description": "Tax compliance tools for freelancers and remote professionals in Portugal",
          "url": "https://app.worktugal.com/",
          "image": "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png",
          "priceRange": "€59-€299",
          "areaServed": {
            "@type": "Country",
            "name": "Portugal"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lisbon",
            "addressCountry": "PT"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "38.7223",
            "longitude": "-9.1393"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
          },
          "offers": {
            "@type": "Offer",
            "name": "Tax Compliance Checkup",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": "https://app.worktugal.com/checkup"
          }
        }}
      />

      {/* Primary: Tax Checkup Hero */}
      <CheckupHero onStartCheckup={handleStartCheckup} />

      {/* How It Works */}
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built with Lisbon's trusted professionals
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Our partner network includes accountants, lawyers, coworking spaces, and service providers who help remote professionals thrive in Portugal.
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
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/partners')}
                  className="mb-4"
                >
                  View All Partners
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-sm text-gray-500">
                  These are trusted service providers in our network. As a Worktugal member, you may receive special offers or priority access from our partners.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Partner CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join our partner hub
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              List your business as a trusted service provider. Help freelancers and remote workers in Portugal while growing your client base.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Featured alongside our services</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <ExternalLink className="h-5 w-5 text-blue-400" />
                <span className="text-sm">€49 lifetime access</span>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/partners/join')}
              className="px-8"
            >
              Become a Partner
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Limited to maintain quality and trust
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};
