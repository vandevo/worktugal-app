import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, TrendingUp, MapPin, Ticket } from 'lucide-react';
import { Button } from './ui/Button';

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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-gray-900" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full mb-6">
              <Ticket className="h-4 w-4" />
              <span className="text-sm font-medium">Trusted by 1,000+ professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in front of Lisbon's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                most trusted
              </span>{' '}
              remote workers
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We hosted the community. Now we power the perks.<br />
              Worktugal Pass connects your business to the remote professionals who stay, spend, and share.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="text-lg px-8 py-4"
              >
                Join as a Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Perks
              </Button>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-3xl font-bold">
                  {activePerksLoading ? '...' : (activePerksCount !== null ? activePerksCount : 'N/A')}
                </span>
              </div>
              <p className="text-gray-400">Active Perks</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-3xl font-bold">€49</span>
              </div>
              <p className="text-gray-400">Early access pricing</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-purple-400 mr-2" />
                <span className="text-3xl font-bold">21</span>
                  {spotsLoading ? '...' : (spotsLeft !== null ? spotsLeft : 'N/A')}
              <p className="text-gray-400">Partner slots remaining</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
  )
}