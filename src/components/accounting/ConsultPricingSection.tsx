import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { CONSULT_SERVICES } from '../../types/accounting';
import type { ServiceType } from '../../types/accounting';

interface ConsultPricingSectionProps {
  onSelectService: (serviceType: ServiceType) => void;
}

export const ConsultPricingSection: React.FC<ConsultPricingSectionProps> = ({ onSelectService }) => {
  return (
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Clear services. Clear prices.
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto font-light">
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
              className={`bg-[#121212] backdrop-blur-3xl rounded-3xl border shadow-2xl shadow-black/30 overflow-hidden hover:border-white/10 transition-all ${
                service.id === 'start_pack' ? 'border-white/10 relative' : 'border-white/5'
              }`}
            >
              {service.id === 'start_pack' && (
                <div className="bg-white/5 text-gray-400 text-center py-2 text-[10px] uppercase tracking-widest font-bold border-b border-white/5">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-serif text-white mb-2">{service.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-serif text-white">€{service.price}</span>
                </div>
                <p className="text-blue-500/60 font-medium text-xs uppercase tracking-widest mb-2">{service.duration}</p>
                <p className="text-sm text-gray-500 mb-8 font-light leading-relaxed">{service.description}</p>

                <ul className="space-y-4 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-500/50 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-400 font-light leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectService(service.id)}
                  className={`w-full py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                    service.id === 'start_pack'
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
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
