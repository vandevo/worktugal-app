import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  readOnly?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  readOnly,
  className,
  type,
  ...props
}, ref) => {
  const isDateTimeInput = type === 'datetime-local' || type === 'date' || type === 'time';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full px-4 py-3 bg-white/[0.03] backdrop-blur-xl rounded-xl text-white placeholder-gray-500',
          'border border-white/[0.12] shadow-lg shadow-black/20',
          'focus:outline-none focus:bg-white/[0.06] focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20',
          'hover:bg-white/[0.05] hover:border-white/[0.16]',
          'transition-all duration-200',
          isDateTimeInput && 'cursor-pointer',
          readOnly && 'bg-gray-700/50 cursor-not-allowed opacity-60 border-gray-600/30',
          error && 'bg-red-900/20 border-red-500/40 focus:bg-red-900/30 focus:border-red-500/60 focus:ring-red-500/20',
          className
        )}
        readOnly={readOnly}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';