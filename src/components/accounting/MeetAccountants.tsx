import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe } from 'lucide-react';

interface Accountant {
  name: string;
  title: string;
  certNumber: string;
  specialties: string[];
  languages: string[];
}

const accountants: Accountant[] = [
  {
    name: 'Ana Silva',
    title: 'Senior Tax Consultant',
    certNumber: 'OCC #12847',
    specialties: ['Freelancer taxation', 'VAT compliance', 'Activity opening'],
    languages: ['Portuguese', 'English'],
  },
  {
    name: 'Miguel Santos',
    title: 'Certified Public Accountant',
    certNumber: 'OCC #15293',
    specialties: ['Annual returns', 'NHR regime', 'Cross-border taxation'],
    languages: ['Portuguese', 'English', 'Spanish'],
  },
];

export const MeetAccountants: React.FC = () => {
  return (
    <section className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Meet Our Accountants
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            OCC-certified professionals who understand expat taxation in Portugal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {accountants.map((accountant, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 hover:border-blue-400/30 transition-all"
            >
              <div className="flex items-start mb-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full w-20 h-20 flex items-center justify-center border border-blue-400/30 mr-4">
                  <span className="text-2xl font-bold text-blue-300">
                    {accountant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {accountant.name}
                  </h3>
                  <p className="text-blue-300 font-medium">{accountant.title}</p>
                  <div className="flex items-center mt-2">
                    <Shield className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm text-gray-300">{accountant.certNumber}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">SPECIALTIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {accountant.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-400/20"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">LANGUAGES</h4>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-300">{accountant.languages.join(', ')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm max-w-3xl mx-auto">
            All consults are conducted by OCC-certified accountants from our network.
            You'll be matched with the right specialist based on your needs and availability.
          </p>
        </div>
      </div>
    </section>
  );
};
