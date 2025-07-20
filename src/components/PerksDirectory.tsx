import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, ExternalLink, QrCode, MessageCircle, Tag, Shield, Globe, Instagram } from 'lucide-react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BUSINESS_CATEGORIES } from '../utils/constants';

// Mock data for demonstration
const mockPerks = [
  {
    id: '1',
    title: 'Exclusive rates on climbing packs & workshops',
    description: 'Climb Lisbon\'s most iconic bridge wall. Bouldering, belay, and guided climbs under the 25 de Abril Bridge.',
    business_name: 'Escala25',
    category: 'Gyms & Wellness',
    redemption_method: 'other',
    redemption_details: 'Message Patrick on WhatsApp and mention "Worktugal Pass" for exclusive rates on climbing packs or workshops.',
    is_portuguese_owned: true,
    logo: 'https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/escala-25-trust-monitor.jpg',
    city: 'Lisbon',
    neighborhood: 'Alcântara',
    business_website: 'https://escala25.com',
    business_instagram: 'https://www.instagram.com/escala25_lisboa',
    whatsapp_number: '+351964129244' // Hidden from UI, used for WhatsApp link
  },
  {
    id: '2',
    title: 'Free class trial + 15% off membership',
    description: 'Try any of our fitness classes for free and get 15% off your first month membership.',
    business_name: 'FitLisboa',
    category: 'Fitness & Wellness',
    redemption_method: 'qr',
    redemption_details: 'Show QR code at reception',
    is_portuguese_owned: false,
    logo: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=400',
    city: 'Lisbon',
    neighborhood: 'Avenidas Novas',
    business_website: 'https://fitlisboa.pt',
    business_instagram: 'https://instagram.com/fitlisboa'
  },
  {
    id: '3',
    title: '10% off all services',
    description: 'Get 10% off all beauty treatments including haircuts, coloring, and nail services.',
    business_name: 'Beleza Studio',
    category: 'Beauty & Personal Care',
    redemption_method: 'promo_code',
    redemption_details: 'Use code: WORKTUGAL10',
    is_portuguese_owned: true,
    logo: 'https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&cs=tinysrgb&w=400',
    city: 'Lisbon',
    neighborhood: 'Chiado',
    business_website: 'https://belezastudio.pt',
    business_instagram: 'https://instagram.com/belezastudio'
  },
  {
    id: '4',
    title: '20% off Feng Shui + 10% off Self-Knowledge consultations',
    description: 'We study, harmonize and make the most of the energy in the spaces where people live and work. I guide and inspire people to be the best version of themselves.',
    business_name: 'Suzana Mendes — Feng Shui, Saúde, Bem-Estar',
    category: 'Experts & Services',
    redemption_method: 'promo_code',
    redemption_details: 'Use code: WORKTUGAL20',
    is_portuguese_owned: true,
    logo: 'https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/perk-images/suzana-mendes-feng-shui-upper-body-photo.jpg',
    city: 'Lisbon',
    neighborhood: 'Cascais',
    business_website: 'https://www.suzanamendes.com/',
    business_instagram: 'https://www.instagram.com/fengshui_suzanamendes/',
    whatsapp_number: '+351918789177'
  }
];

export const PerksDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPortugueseOnly, setShowPortugueseOnly] = useState(false);

  const filteredPerks = useMemo(() => {
    return mockPerks.filter(perk => {
      const matchesSearch = perk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           perk.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           perk.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || perk.category === selectedCategory;
      
      const matchesPortuguese = !showPortugueseOnly || perk.is_portuguese_owned;
      
      return matchesSearch && matchesCategory && matchesPortuguese;
    });
  }, [searchTerm, selectedCategory, showPortugueseOnly]);

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

  const extractWhatsAppNumber = (text: string) => {
    // For Escala25, use the hidden whatsapp_number field instead of extracting from text
    return null;
  };

  const handlePerkAction = (perk: any) => {
    // Handle Escala25 WhatsApp redemption with hidden number
    if (perk.id === '1' && perk.whatsapp_number) {
      const message = encodeURIComponent(`Hi Patrick, I'm a Worktugal Pass user interested in your climbing offers`);
      const whatsappUrl = `https://wa.me/${perk.whatsapp_number.replace('+', '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      return;
    }
    
    if (perk.redemption_method === 'other' && perk.redemption_details.includes('WhatsApp')) {
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
    if (perk.id === '1' && perk.whatsapp_number) {
      return 'Message on WhatsApp';
    }
    if (perk.redemption_method === 'other' && perk.redemption_details.includes('WhatsApp')) {
      return 'Message on WhatsApp';
    }
    return 'Use This Now';
  };

  return (
    <section id="directory" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Verified Perks from Local Partners</h2>
          <p className="text-xl text-gray-300 mb-2">
            Exclusive offers curated for remote professionals in Lisbon
          </p>
          <p className="text-lg text-gray-400">
            Loved by our community of freelancers, expats, and digital nomads
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
                options={[
                  { value: '', label: 'All Categories' },
                  ...categoryOptions
                ]}
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
                    showPortugueseOnly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <label className="text-sm text-gray-300">
                Show only Portuguese-owned businesses
              </label>
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
                  <img
                    src={perk.logo}
                    alt={perk.business_name}
                    width="56"
                    height="56"
                    className="w-14 h-14 rounded-xl object-cover shadow-sm"
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
                          <div className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0">
                            Portuguese
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
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-blue-400 text-lg mb-3 leading-tight">{perk.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{perk.description}</p>
                  
                  <div className="flex items-center space-x-3 text-sm bg-gray-700/30 rounded-xl p-4 mb-6 border border-gray-600/20">
                    <div className="flex-shrink-0 text-gray-400">
                      {getRedemptionIcon(perk.redemption_method)}
                    </div>
                    <span className="font-medium text-gray-200 leading-relaxed">
                      {perk.redemption_details}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl border-0 shadow-sm"
                    onClick={() => handlePerkAction(perk)}
                  >
                    {getActionButtonText(perk)}
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
              <p className="text-lg">No perks found matching your criteria</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};