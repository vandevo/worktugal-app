import React from 'react';
import { Calendar } from 'lucide-react';
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
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150',
            isDateTimeInput && 'cursor-pointer pr-12',
            readOnly && 'bg-gray-700 cursor-not-allowed opacity-60',
            error && 'bg-red-900/30 focus:bg-red-900/40 ring-1 ring-red-500/50',
            className
          )}
          style={isDateTimeInput ? {
            colorScheme: 'dark',
          } : undefined}
          readOnly={readOnly}
          {...props}
        />
        {isDateTimeInput && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
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