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
      container: 'bg-blue-500/5 border-blue-500/10 text-blue-300',
      icon: 'text-blue-500/50',
      IconComponent: Info,
    },
    success: {
      container: 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300',
      icon: 'text-emerald-500/50',
      IconComponent: CheckCircle,
    },
    warning: {
      container: 'bg-yellow-500/5 border-yellow-500/10 text-yellow-300',
      icon: 'text-yellow-500/50',
      IconComponent: AlertCircle,
    },
    error: {
      container: 'bg-red-500/5 border-red-500/10 text-red-300',
      icon: 'text-red-500/50',
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
        'border rounded-xl p-4 shadow-2xl shadow-black/20',
        container,
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <IconComponent className={cn('h-4 w-4 mt-0.5 flex-shrink-0', icon)} />
        <div className="flex-1">
          {title && (
            <h4 className="text-sm font-medium mb-1">{title}</h4>
          )}
          <div className="text-xs font-light leading-relaxed">{children}</div>
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