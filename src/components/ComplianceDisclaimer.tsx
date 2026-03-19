import React from 'react';
import { Scale } from 'lucide-react';

interface ComplianceDisclaimerProps {
  variant?: 'footer' | 'inline' | 'banner';
  className?: string;
}

const TEXT = 'Worktugal provides compliance readiness assessments for informational and educational purposes only. This is not legal, tax, or immigration advice. Always consult a licensed professional (OCC-certified accountant or qualified lawyer) before making decisions.';

export const ComplianceDisclaimer: React.FC<ComplianceDisclaimerProps> = ({
  variant = 'inline',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`flex items-start gap-3 bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 ${className}`}>
        <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">{TEXT}</p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`border-t border-slate-100 dark:border-white/6 pt-6 ${className}`}>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed max-w-2xl mx-auto">{TEXT}</p>
      </div>
    );
  }

  // inline (default) — used on results page
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <Scale className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">{TEXT}</p>
    </div>
  );
};
