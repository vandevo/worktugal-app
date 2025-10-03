import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Eye, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SuccessScreenProps {
  onViewDirectory: () => void;
  onStartOver: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onViewDirectory, onStartOver }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
      </motion.div>
      
      <div>
        <h2 className="text-3xl font-bold mb-4">You're in!</h2>
        <p className="text-xl text-gray-300 mb-6">
          Welcome to the Worktugal Pass partner network
        </p>
      </div>

      <Card className="p-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span className="text-sm">Your listing will go live within 24-48 hours</span>
          </div>
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5 text-green-400" />
            <span className="text-sm">You'll receive a confirmation email shortly</span>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Button
          size="lg"
          onClick={onViewDirectory}
          className="w-full max-w-md"
        >
          Browse Partner Directory
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onStartOver}
          className="w-full max-w-md"
        >
          Submit Another Business
        </Button>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-xl max-w-md mx-auto">
        <p className="text-sm text-gray-400">
          Questions? Contact us at{' '}
          <a href="mailto:partners@worktugal.com" className="text-blue-400 hover:underline">
            partners@worktugal.com
          </a>
        </p>
      </div>
    </motion.div>
  );
};