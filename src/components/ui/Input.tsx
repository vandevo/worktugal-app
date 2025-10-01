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
          'w-full px-4 py-3 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.12] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white/[0.24] focus:bg-white/[0.06] focus:shadow-xl focus:shadow-blue-500/10 hover:border-white/[0.18] hover:bg-white/[0.05] transition-all duration-300 shadow-lg shadow-black/20',
          isDateTimeInput && 'cursor-pointer',
          readOnly && 'bg-gray-700 cursor-not-allowed',
          error && 'border-red-400/60 focus:border-red-400/80 focus:shadow-red-500/10 text-white',
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