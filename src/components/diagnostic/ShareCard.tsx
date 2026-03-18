import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShareCardProps {
  setupScore: number;
  exposureIndex: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  diagnosticId: string;
}

function getRiskLabel(setupScore: number, exposureIndex: number): string {
  if (exposureIndex >= 40) return 'High Risk';
  if (exposureIndex >= 15) return 'Medium Risk';
  return 'Low Risk';
}

function getRiskColor(setupScore: number, exposureIndex: number) {
  if (exposureIndex >= 40) return { text: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/[0.04]' };
  if (exposureIndex >= 15) return { text: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/[0.04]' };
  return { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.04]' };
}

export const ShareCard: React.FC<ShareCardProps> = ({
  setupScore,
  exposureIndex,
  highCount,
  mediumCount,
  lowCount,
  diagnosticId,
}) => {
  const [copied, setCopied] = useState(false);

  const totalTraps = highCount + mediumCount + lowCount;
  const riskLabel = getRiskLabel(setupScore, exposureIndex);
  const colors = getRiskColor(setupScore, exposureIndex);
  const resultsUrl = `https://app.worktugal.com/diagnostic/results?id=${diagnosticId}`;

  const shareText = [
    `Just ran my Portugal compliance check on Worktugal.`,
    ``,
    `Setup Score: ${setupScore}/100`,
    `Exposure Index: ${exposureIndex} risk pts`,
    `Risk level: ${riskLabel}`,
    totalTraps > 0
      ? `Traps detected: ${highCount} high${mediumCount > 0 ? `, ${mediumCount} medium` : ''}${lowCount > 0 ? `, ${lowCount} low` : ''}`
      : `No compliance traps detected.`,
    ``,
    `Free diagnostic (2 min): app.worktugal.com/diagnostic`,
  ].join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = shareText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/[0.01] rounded-3xl border border-white/5 p-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center">
          <Share2 className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <h2 className="text-base font-medium text-white">Share your results</h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">
            Post to Reddit, LinkedIn, or Telegram
          </p>
        </div>
      </div>

      {/* The shareable card — styled to look good as a screenshot */}
      <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 mb-6`}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">
              Worktugal
            </p>
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-medium">
              Portugal Compliance Diagnostic
            </p>
          </div>
          <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${colors.border} ${colors.text}`}>
            {riskLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold mb-1">
              Setup Score
            </p>
            <p className={`text-4xl font-serif ${setupScore >= 70 ? 'text-emerald-400' : setupScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {setupScore}
              <span className="text-lg text-gray-600 font-light">/100</span>
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold mb-1">
              Exposure Index
            </p>
            <p className={`text-4xl font-serif ${exposureIndex <= 15 ? 'text-emerald-400' : exposureIndex <= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {exposureIndex}
              <span className="text-lg text-gray-600 font-light"> pts</span>
            </p>
          </div>
        </div>

        {totalTraps > 0 ? (
          <div className="flex gap-3">
            {highCount > 0 && (
              <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                {highCount} High
              </span>
            )}
            {mediumCount > 0 && (
              <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                {mediumCount} Medium
              </span>
            )}
            {lowCount > 0 && (
              <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {lowCount} Low
              </span>
            )}
          </div>
        ) : (
          <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            No traps detected
          </span>
        )}

        <p className="text-[9px] text-gray-600 font-medium mt-5 uppercase tracking-[0.15em]">
          app.worktugal.com/diagnostic
        </p>
      </div>

      {/* Copy share text */}
      <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 mb-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-3">
          Copy-ready text for Reddit, LinkedIn, Telegram
        </p>
        <pre className="text-xs text-gray-400 font-light leading-relaxed whitespace-pre-wrap font-sans">
          {shareText}
        </pre>
      </div>

      <Button
        onClick={handleCopy}
        variant="secondary"
        className="w-full text-[10px] uppercase tracking-widest font-bold"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 mr-2 text-emerald-400" />
            <span className="text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3 mr-2" />
            Copy share text
          </>
        )}
      </Button>
    </motion.div>
  );
};
