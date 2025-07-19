import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, hover = false }) => {
  const cardProps = hover 
    ? {
        whileHover: { scale: 1.02, y: -4 },
        transition: { duration: 0.2 }
      }
    : {};

  return (
    <motion.div
      className={cn(
        'bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl',
        className
      )}
      {...cardProps}
    >
      {children}
    </motion.div>
  );
};