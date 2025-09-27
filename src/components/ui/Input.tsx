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
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 bg-gray-900/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/40 focus:bg-gray-900/60 hover:border-white/[0.12] hover:bg-gray-900/50 transition-all duration-300 shadow-lg shadow-black/20',
          readOnly && 'bg-gray-700 cursor-not-allowed',
          error && 'border-red-400/60 focus:ring-red-400/60 focus:border-red-400/40',
          className
        )}
        readOnly={readOnly}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';