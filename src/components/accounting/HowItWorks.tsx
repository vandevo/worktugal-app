import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, FileText, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Calendar,
      title: '1. Book Your Slot',
      description: 'Choose your service and preferred time. Pay upfront with clear pricing.',
    },
    {
      icon: Video,
      title: '2. Talk to Your Accountant',
      description: 'Video or phone call with an OCC-certified accountant who speaks English.',
    },
    {
      icon: FileText,
      title: '3. Get Written Outcomes',
      description: 'Receive a detailed outcome note within 48 hours with clear next steps.',
    },
    {
      icon: CheckCircle,
      title: '4. Stay Tax Ready',
      description: 'Follow your checklist and reach out anytime with questions.',
    },
  ];

  return (
    <section className="py-20 bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Simple, transparent process from booking to delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/[0.04] backdrop-blur-xl rounded-full p-6 mb-4 border border-white/[0.10] shadow-xl shadow-black/20">
                  <step.icon className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-white/[0.10] -ml-4"
                     style={{ width: 'calc(100% - 6rem)' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
