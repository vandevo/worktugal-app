import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, ExternalLink, QrCode, MessageCircle, Tag, Shield, Globe, Instagram, Linkedin, Lock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { AuthModal } from './auth/AuthModal';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BUSINESS_CATEGORIES } from '../utils/constants';
import { PartnerSubmission } from '../types';

// Character limit for description truncation
const MAX_DESCRIPTION_LENGTH = 180;

interface DisplayPerk {
  id: string;
  title: string;
  description: string;
  business_name: string;
  category: string;
  redemption_method: string;
  redemption_details: string;
  is_portuguese_owned: boolean;
  logo: string;
  city: string;
  neighborhood: string;
  business_website?: string;
  business_instagram?: string;
  business_linkedin?: string;
  contact_email?: string;
  contact_phone?: string;
}

export const PerksDirectory: React.FC = () => {
  const { user } = useAuth();
  const [perks, setPerks] = useState<DisplayPerk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPortugueseOnly, setShowPortugueseOnly] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedPerks, setExpandedPerks] = useState<Set<string>>(new Set());

  const togglePerkExpansion = (perkId: string) => {
    setExpandedPerks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(perkId)) {
        newSet.delete(perkId);
      } else {
        newSet.add(perkId);
      }
      return newSet;
    });
  };
  // Fetch approved partner submissions from Supabase
  React.useEffect(() => {
    const fetchApprovedPerks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('partner_submissions')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // Map database fields to display format
        const mappedPerks: DisplayPerk[] = (data || []).map((submission: PartnerSubmission) => ({
          id: submission.id.toString(),
          title: submission.perk_title,
          description: submission.perk_description,
          business_name: submission.business_name,
          category: submission.business_category,
          redemption_method: submission.perk_redemption_method,
          redemption_details: submission.perk_redemption_details,
          is_portuguese_owned: submission.perk_is_portuguese_owned,
          logo: submission.perk_logo || '',
          city: 'Lisbon',
          neighborhood: submission.business_neighborhood,
          business_website: submission.business_website || undefined,
          business_instagram: submission.business_instagram || undefined,
          contact_email: submission.contact_email,
          contact_phone: submission.contact_phone,
        }));

        setPerks(mappedPerks);
      } catch (err: any) {
        console.error('Error fetching approved perks:', err);
        setError('Failed to load perks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPerks();
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
      case 'direct_link': return <ExternalLink className="h-4 w-4" />;
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

  const extractWhatsAppNumber = (text: string): string | null => {
    // Try to extract phone number from redemption details
    const phoneMatch = text.match(/(\+?3519\d{8}|\+?351\s?9\d{2}\s?\d{3}\s?\d{3})/);
    return phoneMatch ? phoneMatch[1].replace(/\s/g, '') : null;
  };

  const handlePerkAction = (perk: any) => {
    // Extract URL from redemption details (highest priority)
    const extractedUrl = perk.redemption_details?.match(/(https?:\/\/[^\s]+)/);
    if (extractedUrl) {
      window.open(extractedUrl[0], '_blank');
      return;
    }
    
    // Handle email-based redemption (broader detection)
    if (perk.contact_email && (
      perk.redemption_details.toLowerCase().includes('email') ||
      perk.redemption_details.toLowerCase().includes('request') ||
      perk.business_name.toLowerCase().includes('second home')
    )) {
      const subject = encodeURIComponent('Worktugal Pass – Free Trial Request');
      const body = encodeURIComponent(`Hi,\n\nI'm a Worktugal Pass member interested in: ${perk.title}\n\n${perk.redemption_details}\n\nCould you please help me redeem this perk?\n\nThank you!\n\nBest regards`);
      const mailtoUrl = `mailto:${perk.contact_email}?subject=${subject}&body=${body}`;
      window.open(mailtoUrl, '_blank');
      return;
    }
    
    // Handle WhatsApp-based redemption
    if (perk.contact_phone || (perk.redemption_method === 'other' && perk.redemption_details.toLowerCase().includes('whatsapp'))) {
      const phoneNumber = perk.contact_phone || extractWhatsAppNumber(perk.redemption_details);
      if (phoneNumber) {
        const message = encodeURIComponent(`Hi! I'm a Worktugal Pass member interested in: ${perk.title}`);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        return;
      }
    }
    
    // Handle website-based redemption
    if (perk.business_website && perk.redemption_details.toLowerCase().includes('website')) {
      window.open(perk.business_website, '_blank');
      return;
    }
    
    // Generic WhatsApp fallback
    if (perk.redemption_method === 'other' && perk.redemption_details.toLowerCase().includes('whatsapp')) {
      const phoneNumber = extractWhatsAppNumber(perk.redemption_details);
      if (phoneNumber) {
        const message = encodeURIComponent(`Hi! I have Worktugal Pass and I'm interested in: ${perk.title}`);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        return;
      }
    }
    
    // Default behavior for other redemption methods
    console.log('Redeeming perk:', perk.id);
  };

  const getActionButtonText = (perk: any) => {
    // If user is not authenticated, show unlock text
    if (!user) {
      return 'Unlock perk access';
    }
    
    if (perk.redemption_method === 'direct_link') {
      return 'Claim this perk';
    }
    
    // Check if redemption details contain a URL (even if method isn't 'direct_link')
    const urlMatch = perk.redemption_details.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      return 'View offer';
    }
    
    // Check for email-based redemption (broader detection)
    if (perk.contact_email && (
      perk.redemption_details.toLowerCase().includes('email') ||
      perk.redemption_details.toLowerCase().includes('request') ||
      perk.business_name.toLowerCase().includes('second home')
    )) {
      // Determine appropriate email button text based on context
      const details = perk.redemption_details.toLowerCase();
      
      if (details.includes('trial') || details.includes('free day') || perk.business_name.toLowerCase().includes('second home')) {
        return 'Get free trial';
      } else if (details.includes('rate') || details.includes('condition') || details.includes('discount') || details.includes('exclusive')) {
        return 'Get exclusive rates';
      } else if (details.includes('consultation') || details.includes('quote')) {
        return 'Book consultation';
      } else if (details.includes('booking') || details.includes('appointment')) {
        return 'Make booking';
      } else {
        return 'Get in touch';
      }
    }
    
    if (perk.business_website && perk.redemption_details.toLowerCase().includes('website')) {
      return 'Visit website';
    }
    
    if (perk.contact_phone || (perk.redemption_method === 'other' && perk.redemption_details.toLowerCase().includes('whatsapp'))) {
      return 'Message on WhatsApp';
    }
    
    return 'Get this offer';
  };

  const renderDescription = (perk: DisplayPerk) => {
    const isExpanded = expandedPerks.has(perk.id);
    const needsTruncation = perk.description.length > MAX_DESCRIPTION_LENGTH;
    
    if (!needsTruncation) {
      return (
        <p className="text-sm text-gray-400 leading-relaxed mb-4">
          {perk.description}
        </p>
      );
    }

    const truncatedText = perk.description.substring(0, MAX_DESCRIPTION_LENGTH);
    const displayText = isExpanded ? perk.description : `${truncatedText}...`;

    return (
      <div className="mb-4">
        <motion.p
          className="text-sm text-gray-400 leading-relaxed"
          initial={false}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {displayText}
        </motion.p>
        <motion.button
          type="button"
          onClick={() => togglePerkExpansion(perk.id)}
          className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 mt-2 font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{isExpanded ? 'Show less' : 'Read more'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </motion.button>
      </div>
    );
  };
  return (
    <section id="directory" className="py-20 bg-gradient-to-b from-gray-800/30 to-gray-900/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Verified Perks Used by Remote Workers Who Stay and Spend
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-6 max-w-4xl mx-auto leading-relaxed">
            These are not coupon deals. They are trusted offers from real Lisbon professionals - coworking spaces, wellness experts, business services, and authentic experiences used by freelancers, founders, and remote workers who call Lisbon home.
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
                  className="w-full pl-10 pr-4 py-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/40 hover:bg-white/[0.03] transition-all duration-300 shadow-lg"
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
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg backdrop-blur-xl border ${
                  showPortugueseOnly 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400/20' 
                    : 'bg-white/[0.04] border-white/[0.08]'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                    showPortugueseOnly ? 'translate-x-6' : 'translate-x-1'
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
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading verified perks...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-blue-400 hover:text-blue-300 mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPerks.map((perk, index) => (
            <motion.div
              key={perk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-6 h-full group" hover>
                {/* Verified Partner Badge - now blue */}
                <div className="mb-4">
                  <div className="inline-flex items-center space-x-1.5 bg-blue-400/10 backdrop-blur-xl text-blue-300 px-3 py-2 rounded-full text-xs font-semibold tracking-wide border border-blue-400/20 shadow-lg">
                    <Shield className="h-3 w-3" />
                    <span>Trusted Partner</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={perk.logo}
                    alt={perk.business_name}
                    width="56"
                    height="56"
                    className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/[0.08] group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to a default image or hide if image fails to load
                      e.currentTarget.src = 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-white leading-tight flex-1">{perk.business_name}</h3>
                        {perk.is_portuguese_owned && (
                          <div className="bg-green-400/10 backdrop-blur-xl text-green-300 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 border border-green-400/20 shadow-sm">
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
                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-105"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span className="text-xs">Website</span>
                          </a>
                        )}
                        {perk.business_instagram && (
                          <a
                            href={perk.business_instagram.startsWith('@') 
                              ? `https://www.instagram.com/${perk.business_instagram.slice(1)}`
                              : perk.business_instagram.startsWith('http') 
                                ? perk.business_instagram
                                : `https://www.instagram.com/${perk.business_instagram}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-pink-400 hover:text-pink-300 transition-all duration-300 hover:scale-105"
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
                            className="flex items-center space-x-1 text-blue-500 hover:text-blue-400 transition-all duration-300 hover:scale-105"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                            <span className="text-xs">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category tagline above perk details */}
                <div className="mb-3">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {perk.category}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 leading-tight bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">{perk.title}</h4>
                  {renderDescription(perk)}
                  
                  {user ? (
                    <div className="flex items-center space-x-3 text-sm bg-white/[0.02] backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/[0.06] shadow-lg">
                      <div className="w-full">
                        <div className="flex items-center space-x-3 font-medium text-green-400 text-xs uppercase tracking-wide mb-2">
                          {getRedemptionIcon(perk.redemption_method)}
                         <span className="text-green-400">How to redeem</span>
                        </div>
                        <span className="text-gray-300 leading-relaxed block">
                          {(() => {
                            // Extract URL and show only user-friendly text
                            const urlMatch = perk.redemption_details.match(/(.*?)\s*(https?:\/\/[^\s]+)/);
                            if (urlMatch && urlMatch[1]) {
                              return urlMatch[1].trim();
                            }
                            return perk.redemption_details;
                          })()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-sm bg-blue-400/5 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-blue-400/15 shadow-lg">
                      <div className="w-full">
                        <div className="flex items-center space-x-3 font-medium text-blue-400 text-xs uppercase tracking-wide mb-2">
                          <Lock className="h-4 w-4" />
                         <span className="text-blue-400">Redemption Details</span>
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
                    className="w-full font-semibold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    onClick={() => user ? handlePerkAction(perk) : handleUnlockAccess()}
                  >
                    {user ? (
                      getActionButtonText(perk)
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Unlock perk access
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        )}

        {!loading && !error && filteredPerks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg text-gray-400">No perks found matching your criteria</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
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