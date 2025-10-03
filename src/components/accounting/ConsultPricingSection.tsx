import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { CONSULT_SERVICES } from '../../types/accounting';
import type { ServiceType } from '../../types/accounting';

interface ConsultPricingSectionProps {
  onSelectService: (serviceType: ServiceType) => void;
}

export const ConsultPricingSection: React.FC<ConsultPricingSectionProps> = ({ onSelectService }) => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Clear Services. Clear Prices.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the service that matches your need. Every consult includes written documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CONSULT_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white/[0.03] backdrop-blur-3xl rounded-3xl border shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] overflow-hidden hover:border-blue-400/50 hover:ring-blue-400/30 hover:shadow-blue-500/20 transition-all ${
                service.id === 'start_pack' ? 'border-blue-400/50 ring-blue-400/30 relative' : 'border-white/[0.10]'
              }`}
            >
              {service.id === 'start_pack' && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-2 text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">€{service.price}</span>
                </div>
                <p className="text-gray-300 mb-2 font-medium">{service.duration}</p>
                <p className="text-gray-300 mb-6">{service.description}</p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectService(service.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    service.id === 'start_pack'
                      ? 'bg-gradient-to-br from-blue-500/90 to-blue-600/90 hover:from-blue-400/90 hover:to-blue-500/90 text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl border border-blue-400/30'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.12] hover:border-white/[0.20] shadow-lg'
                  }`}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            All prices include VAT. Consults delivered by OCC-certified accountants in English.
          </p>
        </div>
      </div>
    </section>
  );
};
