import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Do you help me get a NIF?',
    answer: 'We provide guidance on the NIF process, but we focus on getting you tax ready, not just obtaining a number. Our consults help you understand activity codes, VAT requirements, and ongoing compliance.'
  },
  {
    question: 'What is the VAT threshold in Portugal?',
    answer: 'For services, the threshold is €13,500 per year. For goods, it is €10,000. Once you exceed these amounts, you must charge and remit VAT. Our Start Pack helps you understand which applies to you.'
  },
  {
    question: 'Can I transfer my fiscal representative?',
    answer: 'Yes, but you must complete the transfer within 15 days of terminating with your old representative. We can guide you through this process during a consult.'
  },
  {
    question: 'What changed with AIMA in April 2025?',
    answer: 'AIMA now requires complete documentation submission. Partial applications are no longer accepted. This affects residence permit applications and renewals.'
  },
  {
    question: 'What are NIF ranges and why do they matter?',
    answer: 'Portuguese NIF numbers start with different digits based on entity type. Individual NIF starts with 1, 2, or 3. Company NIF starts with 5. This affects how you are identified in the tax system.'
  },
  {
    question: 'Will I get a written outcome?',
    answer: 'Yes, every consult includes a written outcome note delivered within 48 hours. This includes your specific situation, recommendations, and a clear next steps checklist.'
  },
  {
    question: 'Are your accountants certified?',
    answer: 'Yes, all our accountants are certified by the Ordem dos Contabilistas Certificados (OCC) and fluent in English.'
  },
  {
    question: 'What if I need ongoing accounting help?',
    answer: 'Our consults are designed to get you started. If you need ongoing services like quarterly VAT filing or annual returns, we can connect you with the right accountant from our network.'
  }
];

export const ConsultFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our accounting desk
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-700">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-gray-900">Compliance Disclaimer:</strong> The information provided during consults is for educational purposes only and does not constitute legal or financial advice. Tax laws change frequently. Always verify current requirements with official Portuguese tax authorities (Autoridade Tributária e Aduaneira) or seek formal legal counsel for your specific situation.
          </p>
        </div>
      </div>
    </section>
  );
};
