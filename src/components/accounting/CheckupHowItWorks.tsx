import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, BarChart3, CheckCircle2 } from 'lucide-react';

export const CheckupHowItWorks: React.FC = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Answer 8 questions',
      description: 'Tell us about your work, income, and residency status in Portugal. Smart helper text guides you based on your answers',
      time: '3 minutes'
    },
    {
      icon: BarChart3,
      title: 'Get your compliance score',
      description: 'Instant analysis with severity levels (critical/high/medium/low) and comparison to real user data',
      time: 'Instant'
    },
    {
      icon: CheckCircle2,
      title: 'See exactly what to fix',
      description: 'Actionable guidance with specific penalty amounts (€375, €500+), deadlines, and priority ranking',
      time: 'Actionable'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-obsidian to-obsidian-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Updated for 2025 with severity-based guidance and real user data
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-blue-400/30 transition-all duration-300 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Step {index + 1}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {step.time}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
