import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Mail, Calendar, Video, FileText, MessageCircle } from 'lucide-react';

export const WhatToExpect: React.FC = () => {
  const timeline = [
    {
      icon: CreditCard,
      title: 'Book & Pay',
      time: 'Today',
      description: 'Choose your service and pay upfront. Clear pricing, no hidden fees.',
    },
    {
      icon: Mail,
      title: 'Confirmation Email',
      time: 'Within minutes',
      description: 'Receive booking confirmation with next steps and preparation tips.',
    },
    {
      icon: Calendar,
      title: 'Schedule Your Time',
      time: 'Within 7 days',
      description: 'Use your Cal.com link to book a specific appointment slot that works for you.',
    },
    {
      icon: Video,
      title: 'Your Consult',
      time: 'Scheduled time',
      description: 'Video or phone call with your OCC-certified accountant. Bring your questions.',
    },
    {
      icon: FileText,
      title: 'Written Outcome',
      time: 'Within 48 hours',
      description: 'Detailed note with your situation, recommendations, and action checklist.',
    },
    {
      icon: MessageCircle,
      title: 'Follow-up Support',
      time: 'As needed',
      description: 'Reach out with quick questions. Need ongoing help? We\'ll connect you with the right accountant.',
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            What to Expect
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From booking to delivery, here's exactly what happens
          </p>
        </div>

        <div className="space-y-8">
          {timeline.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0">
                <div className="bg-white/[0.04] backdrop-blur-xl rounded-full p-4 border border-white/[0.10] shadow-xl shadow-black/20">
                  <step.icon className="w-7 h-7 text-blue-400" />
                </div>
              </div>

              <div className="flex-1 bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] shadow-xl shadow-black/20 p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <span className="text-sm font-semibold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/20">
                    {step.time}
                  </span>
                </div>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-blue-400/20 p-6">
          <h4 className="text-lg font-semibold text-white mb-3">Important Notes:</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You can reschedule your appointment up to 24 hours before the scheduled time via Cal.com</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Missed appointments without 24h notice cannot be refunded or rescheduled</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>The €149 credit for Annual Return Consult applies automatically if you book filing services through us</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Email support times vary by service tier (see pricing for details)</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
