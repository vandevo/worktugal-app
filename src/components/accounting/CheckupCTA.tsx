import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface CheckupCTAProps {
  onStartCheckup: () => void;
}

export const CheckupCTA: React.FC<CheckupCTAProps> = ({ onStartCheckup }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to check your compliance?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Takes 3 minutes. No credit card. No spam. Just clarity on your tax situation.
          </p>
          <Button
            onClick={onStartCheckup}
            size="lg"
            className="px-12 py-4 text-lg"
          >
            Start your free checkup
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
