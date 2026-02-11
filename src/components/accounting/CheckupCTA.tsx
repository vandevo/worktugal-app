import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface CheckupCTAProps {
  onStartCheckup: () => void;
}

export const CheckupCTA: React.FC<CheckupCTAProps> = ({ onStartCheckup }) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-obsidian">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to check your compliance readiness?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Start free in 3 minutes, or go straight to a detailed review with escalation flags and source citations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onStartCheckup}
              size="lg"
              className="px-10 py-4 text-lg"
            >
              Free Checkup (3 min)
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate('/compliance-review')}
              size="lg"
              variant="secondary"
              className="px-10 py-4 text-lg bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <FileText className="w-5 h-5 mr-2" />
              Detailed Review (49 EUR)
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
