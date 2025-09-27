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
          'w-full px-4 py-3 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.12] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/80 focus:border-blue-400/60 focus:bg-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300 shadow-2xl shadow-black/40',
          readOnly && 'bg-gray-700 cursor-not-allowed',
          error && 'border-red-400/60 focus:ring-red-400/60 focus:border-red-400/40 text-white',
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