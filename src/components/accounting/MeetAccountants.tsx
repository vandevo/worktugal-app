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
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-white mb-4">
            Meet our accountants
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
            OCC-certified professionals who understand international taxation in Portugal
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
              className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 hover:border-white/10 transition-all"
            >
              <div className="flex items-start mb-6">
                <div className="bg-white/5 rounded-full w-20 h-20 flex items-center justify-center border border-white/10 mr-6">
                  <span className="text-xl font-serif text-gray-400">
                    {accountant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-white mb-1">
                    {accountant.name}
                  </h3>
                  <p className="text-blue-500/60 font-medium text-sm uppercase tracking-widest">{accountant.title}</p>
                  <div className="flex items-center mt-3">
                    <Shield className="w-3.5 h-3.5 text-emerald-500/50 mr-2" />
                    <span className="text-xs text-gray-500 font-light uppercase tracking-widest">{accountant.certNumber}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-600 mb-3 uppercase tracking-[0.2em]">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {accountant.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="bg-white/5 text-gray-400 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-white/10"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-[0.2em]">Languages</h4>
                  <div className="flex items-center">
                    <Globe className="w-3.5 h-3.5 text-gray-600 mr-2" />
                    <span className="text-xs text-gray-500 font-light uppercase tracking-widest">{accountant.languages.join(', ')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 text-xs max-w-3xl mx-auto font-light leading-relaxed uppercase tracking-widest">
            All consults are conducted by OCC-certified accountants from our network.
            You'll be matched with the right specialist based on your needs and availability.
          </p>
        </div>
      </div>
    </section>
  );
};
