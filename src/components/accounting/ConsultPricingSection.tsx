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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Clear Services. Clear Prices.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 hover:border-blue-500 transition-all ${
                service.id === 'start_pack' ? 'border-blue-500 relative' : 'border-gray-200'
              }`}
            >
              {service.id === 'start_pack' && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">€{service.price}</span>
                </div>
                <p className="text-gray-600 mb-2 font-medium">{service.duration}</p>
                <p className="text-gray-700 mb-6">{service.description}</p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectService(service.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    service.id === 'start_pack'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            All prices include VAT. Consults delivered by OCC-certified accountants in English.
          </p>
        </div>
      </div>
    </section>
  );
};
