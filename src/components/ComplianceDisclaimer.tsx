import React from 'react';

interface ComplianceDisclaimerProps {
  variant?: 'footer' | 'inline' | 'banner';
  className?: string;
}

const DISCLAIMER_TEXT =
  'Worktugal provides compliance readiness assessment and educational information only. This is not legal or tax advice. Information is sourced from official Portuguese authorities where available. Final decisions should be confirmed with a licensed professional (OCC-certified accountant or lawyer).';

export const ComplianceDisclaimer: React.FC<ComplianceDisclaimerProps> = ({
  variant = 'footer',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 ${className}`}>
        <p className="text-yellow-200/90 text-xs italic leading-relaxed text-center">
          {DISCLAIMER_TEXT}
        </p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <p className={`text-gray-500 text-xs leading-relaxed ${className}`}>
        {DISCLAIMER_TEXT}
      </p>
    );
  }

  // footer variant (default)
  return (
    <div className={`py-6 border-t border-white/[0.05] ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-600 text-xs text-center leading-relaxed">
          {DISCLAIMER_TEXT}
        </p>
      </div>
    </div>
  );
};
