import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, ExternalLink, QrCode, MessageCircle, Tag, Shield, Globe, Instagram, Linkedin, Lock, ArrowRight, Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './auth/AuthModal';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BUSINESS_CATEGORIES } from '../utils/constants';
import { getApprovedPerks } from '../lib/submissions';
import { PartnerSubmission } from '../types';

interface TransformedPerk {
  id: string;
  title: string;
  description: string;
  business_name: string;
  category: string;
  redemption_method: string;
  redemption_details: string;
  is_portuguese_owned: boolean;
  logo?: string;
  city: string;
  neighborhood: string;
  business_website?: string;
  business_instagram?: string;
  business_linkedin?: string;
  contact_email?: string;
  whatsapp_number?: string;
}

export const PerksDirectory: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPortugueseOnly, setShowPortugueseOnly] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [perks, setPerks] = useState<TransformedPerk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch approved perks from database
  React.useEffect(() => {
    const fetchPerks = async () => {
      try {
        setLoading(true);
        const approvedSubmissions = await getApprovedPerks();
        
        // Transform the data to match the expected format
        const transformedPerks: TransformedPerk[] = approvedSubmissions.map((submission) => ({
          id: submission.id.toString(),
          title: submission.perk_title,
          description: submission.perk_description,
          business_name: submission.business_name,
          category: submission.business_category,
          redemption_method: submission.perk_redemption_method,
          redemption_details: submission.perk_redemption_details,
          is_portuguese_owned: submission.perk_is_portuguese_owned,
          logo: submission.perk_logo || undefined,
          city: 'Lisbon', // All perks are in Lisbon for now
          neighborhood: submission.business_neighborhood,
          business_website: submission.business_website || undefined,
          business_instagram: submission.business_instagram || undefined,
          contact_email: submission.contact_email || undefined,
          // Extract WhatsApp number from phone field if it exists
          whatsapp_number: submission.contact_phone || undefined,
        }));
        
        setPerks(transformedPerks);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching approved perks:', err);
        setError('Failed to load perks. Please try again later.');
        setPerks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerks();
  }, []);

  const filteredPerks = useMemo(() => {
    return perks.filter(perk => {
      const matchesSearch = perk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           perk.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           perk.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || perk.category === selectedCategory;
      
      const matchesPortuguese = !showPortugueseOnly || perk.is_portuguese_owned;
      
      return matchesSearch && matchesCategory && matchesPortuguese;
    });
  }, [perks, searchTerm, selectedCategory, showPortugueseOnly]);

  const categoryOptions = BUSINESS_CATEGORIES.map(category => ({
    value: category,
    label: category
  }));

  const getRedemptionIcon = (method: string) => {
    switch (method) {
      case 'qr_code': return <QrCode className="h-4 w-4" />;
      case 'verbal': return <MessageCircle className="h-4 w-4" />;
      case 'show_pass': return <MessageCircle className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  const handleUnlockAccess = () => {
    // Track perk unlock attempt in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'unlock_perk_access_click', {
        event_category: 'engagement',
        event_label: 'perks_directory',
        value: 1
      });
    }
    
    setShowAuthModal(true);
  };

  const extractWhatsAppNumber = (phone: string) => {
    // Clean the phone number and extract digits
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return phone.startsWith('+') ? phone : `+${cleaned}`;
    }
    return null;
  };

  const handlePerkAction = (perk: any) => {
    // Handle email contact
    if (perk.contact_email && (perk.redemption_details.toLowerCase().includes('email') || perk.redemption_method === 'email')) {
      const subject = encodeURIComponent(`Worktugal Pass – ${perk.title}`);
      const body = encodeURIComponent(`Hi,\n\nI'm a Worktugal Pass member interested in: ${perk.title}\n\nCould you please help me redeem this perk?\n\nRedemption details: ${perk.redemption_details}\n\nThank you!\n\nBest regards`);
      const mailtoUrl = `mailto:${perk.contact_email}?subject=${subject}&body=${body}`;
      window.open(mailtoUrl, '_blank');
      return;
    }
    
    // Handle WhatsApp contact
    if (perk.whatsapp_number && (perk.redemption_details.toLowerCase().includes('whatsapp') || perk.redemption_method === 'other')) {
      const phoneNumber = extractWhatsAppNumber(perk.whatsapp_number);
      if (phoneNumber) {
        const message = encodeURIComponent(`Hi! I'm a Worktugal Pass member interested in: ${perk.title}\n\nRedemption: ${perk.redemption_details}`);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        return;
      }
    }
    
    // Handle website redirect
    if (perk.business_website && (perk.redemption_method === 'website' || perk.redemption_details.toLowerCase().includes('website'))) {
      window.open(perk.business_website, '_blank');
      return;
    }
    
    // Default behavior for other redemption methods
    console.log('Redeeming perk:', perk.id);
  };

  const getActionButtonText = (perk: any) => {
    // If user is not authenticated, show unlock text
    if (!user) {
      return 'Unlock Perk Access';
    }
    
    if (perk.contact_email && (perk.redemption_details.toLowerCase().includes('email') || perk.redemption_method === 'email')) {
      return 'Email for Free Trial';
    }
    
    if (perk.whatsapp_number && (perk.redemption_details.toLowerCase().includes('whatsapp') || perk.redemption_method === 'other')) {
      return 'Message on WhatsApp';
    }
    
    if (perk.business_website && (perk.redemption_method === 'website' || perk.redemption_details.toLowerCase().includes('website'))) {
      return 'Visit Website';
    }
    
    return 'Use This Now';
  };

  // Show loading state
  if (loading) {
    return (
      <section id="directory" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Verified Perks Used by Remote Workers Who Stay and Spend</h2>
            <p className="text-xl text-gray-300 mb-4 max-w-4xl mx-auto">
              These are not coupon deals. They are trusted offers from real Lisbon partners, used by freelancers, expats, and remote professionals who live here.
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading verified perks...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="directory" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Tag className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg">Failed to load perks</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="directory" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Verified Perks Used by Remote Workers Who Stay and Spend</h2>
          <p className="text-xl text-gray-300 mb-4 max-w-4xl mx-auto">
            These are not coupon deals. They are trusted offers from real Lisbon partners, used by freelancers, expats, and remote professionals who live here.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search perks or businesses..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="md:w-64">
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPortugueseOnly(!showPortugueseOnly)}
                aria-label="Toggle show only Portuguese-owned businesses"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  showPortugueseOnly ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    showPortugueseOnly ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div>
                <label className="text-sm text-gray-300 font-medium">
                  Show only local Portuguese businesses
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Support authentic local businesses with deep community roots
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPerks.map((perk, index) => (
            <motion.div
              key={perk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full" hover>
                {/* Verified Partner Badge - now blue */}
                <div className="mb-4">
                  <div className="inline-flex items-center space-x-1.5 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                    <Shield className="h-3 w-3" />
                    <span>Trusted Partner</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 mb-6">
                  {perk.logo ? (
                    <img
                      src={perk.logo}
                      alt={perk.business_name}
                      width="56"
                      height="56"
                      className="w-14 h-14 rounded-xl object-cover shadow-sm"
                      onError={(e) => {
                        // Fallback to a default image if logo fails to load
                        e.currentTarget.src = 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shadow-sm">
                      <Building className="h-6 w-6 text-blue-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-white leading-tight flex-1">{perk.business_name}</h3>
                        {perk.is_portuguese_owned && (
                          <div className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0">
                            Local
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5 text-sm text-gray-400">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{perk.neighborhood}</span>
                      </div>
                      
                      {/* Business Links */}
                      <div className="flex items-center space-x-3 mt-2">
                        {perk.business_website && (
                          <a
                            href={perk.business_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span className="text-xs">Website</span>
                          </a>
                        )}
                        {perk.business_instagram && (
                          <a
                            href={perk.business_instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-pink-400 hover:text-pink-300 transition-colors"
                          >
                            <Instagram className="h-3.5 w-3.5" />
                            <span className="text-xs">Instagram</span>
                          </a>
                        )}
                        {perk.business_linkedin && (
                          <a
                            href={perk.business_linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-500 hover:text-blue-400 transition-colors"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                            <span className="text-xs">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-blue-400 text-lg mb-3 leading-tight">{perk.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{perk.description}</p>
                  
                  {user ? (
                    <div className="flex items-center space-x-3 text-sm bg-gray-700/30 rounded-xl p-4 mb-6 border border-gray-600/20">
                      <div className="w-full">
                        <div className="flex items-center space-x-3 font-medium text-green-400 text-xs uppercase tracking-wide mb-2">
                          {getRedemptionIcon(perk.redemption_method)}
                         <span>How to redeem</span>
                        </div>
                        <span className="text-gray-200 leading-relaxed block">
                          {perk.redemption_details}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-sm bg-blue-600/10 rounded-xl p-4 mb-6 border border-blue-600/20">
                      <div className="w-full">
                        <div className="flex items-center space-x-3 font-medium text-blue-400 text-xs uppercase tracking-wide mb-2">
                          <Lock className="h-4 w-4" />
                         <span>Redemption Details</span>
                        </div>
                        <span className="text-blue-200 leading-relaxed block">
                          Create your free account to see how to redeem this perk
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl border-0 shadow-sm"
                    onClick={() => user ? handlePerkAction(perk) : handleUnlockAccess()}
                  >
                    {user ? (
                      getActionButtonText(perk)
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Unlock Perk Access
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPerks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg">
                {perks.length === 0 ? 'No approved perks available yet' : 'No perks found matching your criteria'}
              </p>
              <p className="text-sm">
                {perks.length === 0 ? 'Check back soon for new partner listings!' : 'Try adjusting your search or filters'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
        source="perks_directory_gating"
      />
    </section>
  );
};