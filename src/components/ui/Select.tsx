import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

type SelectOption = { value: string; label: string };
type SelectGroup = { label: string; options: SelectOption[] };

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: SelectOption[] | SelectGroup[];
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options,
  children,
  className,
  ...props
}, ref) => {
  // Check if options are grouped
  const isGrouped = options && options.length > 0 && 'options' in options[0];

  // Process children to add inline dark styles to option elements
  const processedChildren = children ? React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === 'option') {
      return React.cloneElement(child as React.ReactElement<any>, {
        style: {
          backgroundColor: '#121212',
          color: '#ffffff',
          ...(child.props.style || {})
        }
      });
    }
    return child;
  }) : null;

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
            'w-full px-4 py-3 bg-white/[0.02] backdrop-blur-xl rounded-xl text-white appearance-none cursor-pointer',
            'border border-white/5 shadow-lg shadow-black/20',
            'focus:outline-none focus:bg-white/[0.06] focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20',
            'hover:bg-white/[0.05] hover:border-white/10',
            'transition-all duration-200',
            error && 'bg-red-900/20 border-red-500/40 focus:bg-red-900/30 focus:border-red-500/60 focus:ring-red-500/20',
            className
          )}
          {...props}
          style={{
            colorScheme: 'dark'
          }}
        >
          {processedChildren || (
            <>
              <option value="" style={{ backgroundColor: '#121212', color: '#ffffff' }}>
                {!label ? 'All Categories' : 'Select an option'}
              </option>
              {isGrouped
                ? (options as SelectGroup[]).map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((option) => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: '#121212', color: '#ffffff' }}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                  ))
                : (options as SelectOption[]).map((option) => (
                    <option key={option.value} value={option.value} style={{ backgroundColor: '#121212', color: '#ffffff' }}>
                      {option.label}
                    </option>
                  ))
              }
            </>
          )}
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