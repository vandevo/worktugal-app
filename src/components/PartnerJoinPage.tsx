import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormWizard } from './FormWizard';
import { Button } from './ui/Button';

export const PartnerJoinPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-850 to-gray-900">
      {/* Hero Section with Back Button */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiMyMzY1YzQiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="group text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="mb-4 inline-block">
              <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Partner Application</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Join Our Partner Hub
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              Connect with remote professionals seeking trusted services in Lisbon. Get lifetime visibility for just €49.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm mb-1">Verified Listing</h3>
                <p className="text-gray-400 text-xs">Featured as trusted partner</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm mb-1">Direct Leads</h3>
                <p className="text-gray-400 text-xs">Connect with qualified clients</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm mb-1">Lifetime Access</h3>
                <p className="text-gray-400 text-xs">One-time €49 payment</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section with Proper Spacing */}
      <section className="py-12 md:py-16 lg:py-20">
        <FormWizard onComplete={() => navigate('/partners')} />
      </section>

      {/* Bottom CTA - Alternative Exit */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
            <p className="text-gray-400 text-sm mb-4">
              Need more information before applying?
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/partners')}
              className="group"
            >
              View Partner Directory
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
