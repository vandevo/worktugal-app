import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, ExternalLink, QrCode, MessageCircle, Tag } from 'lucide-react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BUSINESS_CATEGORIES } from '../utils/constants';

// Mock data for demonstration
const mockPerks = [
  {
    id: '1',
    title: '20% off all meals',
    description: 'Enjoy a 20% discount on all food items. Perfect for lunch breaks and dinner with colleagues.',
    business_name: 'Café Central',
    category: 'Restaurant & Food',
    redemption_method: 'verbal',
    redemption_details: 'Just mention "Worktugal Pass"',
    is_portuguese_owned: true,
    logo: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400',
    city: 'Lisbon',
    neighborhood: 'Príncipe Real'
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
    neighborhood: 'Avenidas Novas'
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
    neighborhood: 'Chiado'
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
      case 'qr': return <QrCode className="h-4 w-4" />;
      case 'verbal': return <MessageCircle className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
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
            
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="md:w-64"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPortugueseOnly(!showPortugueseOnly)}
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
                {/* Verified Partner Badge */}
                <div className="mb-4">
                  <div className="inline-flex items-center bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    Verified Partner
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={perk.logo}
                    alt={perk.business_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{perk.business_name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>{perk.neighborhood}</span>
                    </div>
                  </div>
                  {perk.is_portuguese_owned && (
                    <div className="bg-green-600/20 text-green-400 px-2 py-1 rounded-lg text-xs">
                      Portuguese
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-blue-400 mb-2">{perk.title}</h4>
                  <p className="text-sm text-gray-300 mb-3">{perk.description}</p>
                  
                  <div className="flex items-center space-x-3 text-sm bg-gray-700/50 rounded-lg p-3 mb-4">
                    <span className="text-lg">🏷️</span>
                    <span className="font-medium text-gray-300">
                      {perk.redemption_details}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Handle perk redemption
                      console.log('Redeeming perk:', perk.id);
                    }}
                  >
                    Use This Now
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