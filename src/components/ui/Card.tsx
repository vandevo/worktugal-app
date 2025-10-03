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
    default: 'bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/25',
    glass: 'bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05]',
    frosted: 'bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/[0.12] shadow-xl shadow-black/40 ring-1 ring-white/[0.03]',
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