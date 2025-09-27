import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  variant?: 'default' | 'glass' | 'frosted';
}

export const Card: React.FC<CardProps> = ({ className, children, hover = false, variant = 'glass' }) => {
  const cardProps = hover 
    ? {
        whileHover: { scale: 1.02, y: -4 },
        transition: { duration: 0.3, ease: 'easeOut' }
      }
    : {};

  const variants = {
    default: 'bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl',
    glass: 'bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/20',
    frosted: 'bg-gray-900/60 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-xl shadow-black/30',
  };

  return (
    <motion.div
      className={cn(
        variants[variant],
        className
      )}
      {...cardProps}
    >
      {children}
    </motion.div>
  );
};