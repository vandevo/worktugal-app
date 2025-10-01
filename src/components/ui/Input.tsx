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
          'w-full px-4 py-3 bg-white/[0.05] backdrop-blur-xl border-0 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/[0.08] hover:bg-white/[0.07] transition-all duration-200',
          isDateTimeInput && 'cursor-pointer',
          readOnly && 'bg-gray-700 cursor-not-allowed',
          error && 'bg-red-500/10 focus:bg-red-500/15 text-white',
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