import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Is the diagnostic really free?',
    answer: 'Yes. No credit card, no hidden fees. The free result shows your Setup Score, Exposure Index, and your top compliance risks with severity labels. A paid upgrade (29 EUR) unlocks the full risk breakdown with corrective actions and legal citations.'
  },
  {
    question: 'How does the scoring work?',
    answer: 'The diagnostic uses a dual-scoring engine. Your Setup Score (0-100) measures how well your tax, visa, and registration setup is configured. Your Exposure Index (0-100) measures how many known compliance traps apply to you. Both scores are calculated against declarative rules verified against Portuguese law as of 2026.'
  },
  {
    question: 'What are compliance traps?',
    answer: 'Traps are specific regulatory risks that catch freelancers off guard. Examples: dual tax residency if you never deregistered abroad (CIRS Art. 16), VAT misclassification if you crossed the annual threshold (CIVA Art. 29), or unfiled IRS returns with penalties from 150 to 3,750 EUR. Each trap includes the legal basis and source URL so you can verify it yourself.'
  },
  {
    question: 'What happens to my data?',
    answer: 'Your answers are stored securely and never shared with third parties. We use the data only to generate your risk profile. You can request deletion at any time by emailing us.'
  },
  {
    question: 'Do I need a NIF to use this?',
    answer: 'No. The diagnostic helps you understand if and when you need to take action, including whether you need a NIF or tax registration. It works at any stage of your setup.'
  },
  {
    question: 'What if my situation is complicated?',
    answer: 'The diagnostic handles most freelancer scenarios. If your situation is complex (multiple income streams, company structure, cross-border work), the results page will flag the specific risks that apply to you and recommend next steps.'
  },
  {
    question: 'Will I be spammed with emails?',
    answer: 'No. We send your risk results and only contact you about Portuguese compliance changes that directly affect freelancers. You can unsubscribe anytime. We never sell your email.'
  },
  {
    question: 'Can I retake the diagnostic later?',
    answer: 'Yes. Your situation changes over time (income grows, you cross thresholds, regulations update). Come back anytime to recheck your risk profile. Takes 3 minutes.'
  },
  {
    question: 'What if I already work with an accountant?',
    answer: 'Use the diagnostic to verify you are covering everything, or to prepare better questions for your accountant. Many freelancers discover compliance gaps their current accountant missed.'
  },
  {
    question: 'What is the quarterly VAT return requirement?',
    answer: 'VAT-exempt freelancers (earning under 15,000 EUR) must file quarterly turnover declarations. Even if you are not charging VAT, you need to report quarterly income to Portuguese tax authorities. Deadlines: Oct 31, Jan 31, Apr 30, Jul 31. Our diagnostic identifies if this applies to you.'
  },
  {
    question: 'Do first-year freelancers really get 50% tax reduction?',
    answer: 'Yes, but with conditions. Under Portugal\'s Simplified Regime, the tax coefficient for most services is cut in half in the first year of a new freelance activity. If you qualify, only 37.5% of your income is taxed instead of 75% in year 1 (and 56.25% instead of 75% in year 2). This benefit applies only if you have no employment or pension income in the same year and are under the Simplified Regime (Category B). Our diagnostic detects if you may qualify.'
  }
];

export const CheckupFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-obsidian border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Common questions
            </h2>
            <p className="text-lg text-gray-500 font-light">
              Everything you need to know before running your diagnostic.
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.05] transition-colors"
              >
                <span className="text-base md:text-lg font-medium text-gray-200 pr-8">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
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
                    <div className="px-6 pb-6 text-gray-400 font-light leading-relaxed text-sm">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
