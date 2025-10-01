import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, TrendingUp, MapPin, Ticket } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface HeroProps {
  onGetStarted: () => void;
  spotsLeft: number | null;
  spotsLoading: boolean;
  activePerksCount: number | null;
  activePerksLoading: boolean;
}
export const Hero: React.FC<HeroProps> = ({ onGetStarted, spotsLeft, spotsLoading, activePerksCount, activePerksLoading }) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 via-cyan-500/10 to-gray-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/[0.04] backdrop-blur-xl text-blue-300 px-5 py-3 rounded-full mb-8 border border-white/[0.08] shadow-lg">
              <Ticket className="h-4 w-4" />
              <span className="text-sm font-medium tracking-wide">Trusted by 1,000+ remote professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white">Attract verified remote clients who{' '}</span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                stay longer
              </span>{' '}
              <span className="text-white">and spend more</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-4xl mx-auto leading-relaxed">
              Remote workers need real services: coworking, wellness, professional help, and authentic experiences. Skip the cold outreach. Get discovered by quality clients who value what you offer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="text-lg px-10 py-5 rounded-2xl"
              >
                List My Offer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-5 rounded-2xl"
                onClick={() => document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Verified Perks
              </Button>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          >
            <Card variant="glass" className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-300 to-blue-400 bg-clip-text text-transparent">
                  {activePerksLoading ? '...' : (activePerksCount !== null ? activePerksCount : 'N/A')}
                </span>
              </div>
              <p className="text-gray-300 font-medium">Active Perks</p>
            </Card>
            <Card variant="glass" className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-green-300 to-green-400 bg-clip-text text-transparent">€49</span>
              </div>
              <p className="text-gray-400 font-medium">Early access pricing</p>
            </Card>
            <Card variant="glass" className="p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <MapPin className="h-6 w-6 text-purple-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-300 to-purple-400 bg-clip-text text-transparent">
                  {spotsLoading ? '...' : (spotsLeft !== null ? spotsLeft : 'N/A')}
                </span>
              </div>
              <p className="text-gray-400 font-medium">Spots left</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};