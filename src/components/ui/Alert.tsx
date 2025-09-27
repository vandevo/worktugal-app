import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className,
  onClose,
}) => {
  const variants = {
    info: {
      container: 'bg-blue-400/10 backdrop-blur-xl border-blue-400/20 text-blue-300',
      icon: 'text-blue-400',
      IconComponent: Info,
    },
    success: {
      container: 'bg-green-400/10 backdrop-blur-xl border-green-400/20 text-green-300',
      icon: 'text-green-400',
      IconComponent: CheckCircle,
    },
    warning: {
      container: 'bg-yellow-400/10 backdrop-blur-xl border-yellow-400/20 text-yellow-300',
      icon: 'text-yellow-400',
      IconComponent: AlertCircle,
    },
    error: {
      container: 'bg-red-400/10 backdrop-blur-xl border-red-400/20 text-red-300',
      icon: 'text-red-400',
      IconComponent: AlertCircle,
    },
  };

  const { container, icon, IconComponent } = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'border rounded-2xl p-5 shadow-lg',
        container,
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <IconComponent className={cn('h-5 w-5 mt-0.5 flex-shrink-0', icon)} />
        <div className="flex-1">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};