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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/0 to-transparent" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/5 to-emerald-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-xl text-emerald-400 px-5 py-2.5 rounded-full mb-8 border border-emerald-500/20 shadow-lg">
              <Ticket className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">Trusted by 1,000+ remote professionals</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white">Connect with remote professionals who{' '}</span>
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                value quality
              </span>{' '}
              <span className="text-white">local services</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-4xl mx-auto leading-relaxed">
              Remote workers seek trusted services: coworking, wellness, professional help, and authentic experiences. Become a partner and offer exclusive benefits to our community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="text-lg px-10 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-2xl shadow-blue-600/30 font-semibold"
              >
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-6 rounded-xl border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 font-semibold"
                onClick={() => document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Partner Benefits
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
            <Card variant="glass" className="p-6 text-center hover:scale-105 transition-all duration-300 bg-slate-900/50 border-slate-800/50 backdrop-blur-xl">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-400 to-blue-500 bg-clip-text text-transparent">
                  {activePerksLoading ? '...' : (activePerksCount !== null ? activePerksCount : 'N/A')}
                </span>
              </div>
              <p className="text-slate-300 font-semibold">Active Perks</p>
            </Card>
            <Card variant="glass" className="p-6 text-center hover:scale-105 transition-all duration-300 bg-slate-900/50 border-slate-800/50 backdrop-blur-xl">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-emerald-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-emerald-400 to-emerald-500 bg-clip-text text-transparent">€49</span>
              </div>
              <p className="text-slate-300 font-semibold">Early access pricing</p>
            </Card>
            <Card variant="glass" className="p-6 text-center hover:scale-105 transition-all duration-300 bg-slate-900/50 border-slate-800/50 backdrop-blur-xl">
              <div className="flex items-center justify-center mb-3">
                <MapPin className="h-6 w-6 text-violet-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-violet-400 to-violet-500 bg-clip-text text-transparent">
                  {spotsLoading ? '...' : (spotsLeft !== null ? spotsLeft : 'N/A')}
                </span>
              </div>
              <p className="text-slate-300 font-semibold">Spots left</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};