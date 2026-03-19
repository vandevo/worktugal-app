import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, Loader2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  setupScore: number;
  exposureIndex: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  diagnosticId: string;
}

function getRiskLabel(exposureIndex: number): string {
  if (exposureIndex >= 40) return 'High Risk';
  if (exposureIndex >= 15) return 'Medium Risk';
  return 'Low Risk';
}

function getScoreColor(score: number, type: 'setup' | 'exposure') {
  if (type === 'setup') {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  }
  if (score <= 15) return '#10B981';
  if (score <= 40) return '#F59E0B';
  return '#EF4444';
}

function getRiskBadgeClasses(exposureIndex: number) {
  if (exposureIndex >= 40) return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
  if (exposureIndex >= 15) return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
  return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-[#10B981]/10 dark:text-[#10B981] dark:border-[#10B981]/20';
}

function getScoreClass(score: number, type: 'setup' | 'exposure') {
  if (type === 'setup') {
    if (score >= 70) return 'text-[#10B981]';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  }
  if (score <= 15) return 'text-[#10B981]';
  if (score <= 40) return 'text-amber-500';
  return 'text-red-500';
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
  const [downloading, setDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const totalTraps = highCount + mediumCount + lowCount;
  const riskLabel = getRiskLabel(exposureIndex);

  const shareText = [
    `Just ran my Portugal compliance check on Worktugal.`,
    ``,
    `Setup Score: ${setupScore}/100`,
    `Exposure Index: ${exposureIndex} risk pts`,
    `Risk level: ${riskLabel}`,
    totalTraps > 0
      ? `Traps detected: ${[
          highCount > 0 ? `${highCount} high` : '',
          mediumCount > 0 ? `${mediumCount} medium` : '',
          lowCount > 0 ? `${lowCount} low` : '',
        ].filter(Boolean).join(', ')}`
      : `No compliance traps detected.`,
    ``,
    `Free diagnostic (2 min): app.worktugal.com/diagnostic`,
  ].join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      const el = document.createElement('textarea');
      el.value = shareText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `worktugal-score-${setupScore}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0F3D2E]/8 dark:bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
          <Share2 className="w-4 h-4 text-[#0F3D2E] dark:text-[#10B981]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Share your results</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Download the card or copy text for Reddit, LinkedIn, Telegram
          </p>
        </div>
      </div>

      {/* Preview card */}
      <div className="bg-[#F5F4F2] dark:bg-white/[0.04] rounded-xl border border-[#0F3D2E]/8 dark:border-white/8 p-6 mb-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-0.5">Worktugal</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Portugal Compliance Diagnostic</p>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${getRiskBadgeClasses(exposureIndex)}`}>
            {riskLabel}
          </span>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-1.5">Setup Score</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-black ${getScoreClass(setupScore, 'setup')}`}>{setupScore}</span>
              <span className="text-base font-bold text-slate-400">/100</span>
            </div>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-1.5">Exposure Index</p>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-4xl font-black ${getScoreClass(exposureIndex, 'exposure')}`}>{exposureIndex}</span>
              <span className="text-sm font-bold text-slate-400">pts</span>
            </div>
          </div>
        </div>

        {/* Trap badges */}
        <div className="flex gap-2 flex-wrap mb-4">
          {highCount > 0 && (
            <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
              {highCount} High
            </span>
          )}
          {mediumCount > 0 && (
            <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
              {mediumCount} Medium
            </span>
          )}
          {lowCount > 0 && (
            <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg bg-[#0F3D2E]/8 text-[#0F3D2E] border border-[#0F3D2E]/15 dark:bg-[#10B981]/10 dark:text-[#10B981] dark:border-[#10B981]/20">
              {lowCount} Low
            </span>
          )}
          {totalTraps === 0 && (
            <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg bg-[#0F3D2E]/8 text-[#0F3D2E] border border-[#0F3D2E]/15 dark:bg-[#10B981]/10 dark:text-[#10B981] dark:border-[#10B981]/20">
              No traps detected
            </span>
          )}
        </div>

        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          app.worktugal.com/diagnostic
        </p>
      </div>

      {/* Hidden export card — solid colors for html2canvas */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={exportRef}
          style={{
            width: 600,
            padding: 48,
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E5E7EB',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Worktugal</p>
              <p style={{ fontSize: 10, color: '#9CA3AF', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Portugal Compliance Diagnostic</p>
            </div>
            <span style={{
              fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
              padding: '6px 14px', borderRadius: 99,
              color: exposureIndex >= 40 ? '#DC2626' : exposureIndex >= 15 ? '#D97706' : '#059669',
              backgroundColor: exposureIndex >= 40 ? '#FEF2F2' : exposureIndex >= 15 ? '#FFFBEB' : '#ECFDF5',
              border: `1px solid ${exposureIndex >= 40 ? '#FECACA' : exposureIndex >= 15 ? '#FDE68A' : '#A7F3D0'}`,
            }}>
              {riskLabel}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 48, marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Setup Score</p>
              <p style={{ fontSize: 52, color: getScoreColor(setupScore, 'setup'), fontWeight: 900, lineHeight: 1 }}>
                {setupScore}<span style={{ fontSize: 22, color: '#9CA3AF', fontWeight: 700 }}>/100</span>
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Exposure Index</p>
              <p style={{ fontSize: 52, color: getScoreColor(exposureIndex, 'exposure'), fontWeight: 900, lineHeight: 1 }}>
                {exposureIndex}<span style={{ fontSize: 22, color: '#9CA3AF', fontWeight: 700 }}> pts</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {highCount > 0 && (
              <span style={{ fontSize: 10, color: '#DC2626', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '5px 12px', borderRadius: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {highCount} High Risk
              </span>
            )}
            {mediumCount > 0 && (
              <span style={{ fontSize: 10, color: '#D97706', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '5px 12px', borderRadius: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {mediumCount} Medium Risk
              </span>
            )}
            {lowCount > 0 && (
              <span style={{ fontSize: 10, color: '#059669', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '5px 12px', borderRadius: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {lowCount} Low Risk
              </span>
            )}
            {totalTraps === 0 && (
              <span style={{ fontSize: 10, color: '#059669', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '5px 12px', borderRadius: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                No traps detected
              </span>
            )}
          </div>

          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 20 }}>
            <p style={{ fontSize: 10, color: '#9CA3AF', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
              app.worktugal.com/diagnostic — Free Portugal compliance check
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0F3D2E] text-white text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#1A5C44] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {downloading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</>
          ) : (
            <><Download className="w-3.5 h-3.5" />Download card</>
          )}
        </button>

        <button
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98] ${
            copied
              ? 'border-[#10B981] bg-[#10B981]/8 text-[#10B981] dark:border-[#10B981] dark:bg-[#10B981]/10'
              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-[#0F3D2E]/40 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" />Copied!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" />Copy text</>
          )}
        </button>
      </div>

      {copied && (
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mt-3">
          Paste on Reddit, LinkedIn, or Telegram
        </p>
      )}
    </motion.div>
  );
};
