import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MailOpen, PiggyBank, TrendingUp, Info } from 'lucide-react';

export const ModernFeatures: React.FC = () => {
  return (
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-serif text-white sm:text-4xl mb-4"
          >
            Compliance Readiness
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-light text-lg"
          >
            Identify compliance gaps before they become expensive problems.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard 
            icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
            iconBg="bg-red-500/10 border-red-500/20"
            title="Stop unverified decisions"
            description="Don't let mistakes enter systems that punish you later. We verify your readiness before you engage with professionals."
            delay={0}
          />
          <FeatureCard 
            icon={<MailOpen className="w-5 h-5 text-orange-400" />}
            iconBg="bg-orange-500/10 border-orange-500/20"
            title="Clear the path"
            description="We exist upstream of accountants and lawyers to ensure you are ready to proceed without bureaucratic friction."
            delay={0.1}
          />
          <FeatureCard 
            icon={<PiggyBank className="w-5 h-5 text-green-400" />}
            iconBg="bg-green-500/10 border-green-500/20"
            title="First-year tax benefits"
            description="New freelancers under the Simplified Regime may qualify for a 50% coefficient reduction in year 1. Our checkup identifies if you qualify."
            delay={0.2}
          />
          <FeatureCard 
            icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
            iconBg="bg-purple-500/10 border-purple-500/20"
            title="Prepare for growth"
            description="When you cross the VAT threshold (€15,000 EUR annual income), you need to change your accounting regime. We'll tell you exactly when."
            delay={0.3}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 rounded-lg bg-blue-900/10 border border-blue-500/20 flex items-center justify-center gap-3 text-center"
        >
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-200 font-light">
            <span className="font-medium text-blue-100">The reality:</span> Portugal's tax system is complex. Our AI analyzes your situation against real data.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, iconBg, title, description, delay }: { icon: React.ReactNode, iconBg: string, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass-card p-8 rounded-xl group hover:-translate-y-1"
  >
    <div className="flex items-start gap-5">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed font-light">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);
