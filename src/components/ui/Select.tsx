import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

type SelectOption = { value: string; label: string };
type SelectGroup = { label: string; options: SelectOption[] };

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[] | SelectGroup[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options,
  className,
  ...props
}, ref) => {
  // Check if options are grouped
  const isGrouped = options.length > 0 && 'options' in options[0];

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-white/[0.05] backdrop-blur-xl border-0 rounded-2xl text-white focus:outline-none focus:bg-white/[0.08] transition-all duration-200 appearance-none cursor-pointer hover:bg-white/[0.07] active:scale-[0.99]',
            error && 'bg-red-500/10 focus:bg-red-500/15 text-white',
            className
          )}
          {...props}
        >
          <option value="" className="bg-gray-800 text-white">{!label ? 'All Categories' : 'Select an option'}</option>
          {isGrouped 
            ? (options as SelectGroup[]).map((group) => (
                <optgroup key={group.label} label={group.label} className="bg-gray-800 text-white font-medium">
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white py-2">
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : (options as SelectOption[]).map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800 text-white py-2">
                  {option.label}
                </option>
              ))
          }
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none transition-transform duration-200" />
      </div>
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';