import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2, Download, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
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

function getColors(exposureIndex: number) {
  if (exposureIndex >= 40) return {
    border: 'border-red-500/20', bg: 'bg-red-500/[0.04]', text: 'text-red-400',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    // solid for export
    exportBorder: '#7f1d1d',
    exportBg: '#0f0a0a',
    exportAccent: '#f87171',
    exportBadgeBg: '#7f1d1d55',
  };
  if (exposureIndex >= 15) return {
    border: 'border-yellow-500/20', bg: 'bg-yellow-500/[0.04]', text: 'text-yellow-400',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    exportBorder: '#78350f',
    exportBg: '#0f0e0a',
    exportAccent: '#fbbf24',
    exportBadgeBg: '#78350f55',
  };
  return {
    border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.04]', text: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    exportBorder: '#064e3b',
    exportBg: '#0a0f0d',
    exportAccent: '#34d399',
    exportBadgeBg: '#064e3b55',
  };
}

function getScoreColor(score: number, type: 'setup' | 'exposure') {
  if (type === 'setup') {
    if (score >= 70) return '#34d399';
    if (score >= 40) return '#fbbf24';
    return '#f87171';
  }
  if (score <= 15) return '#34d399';
  if (score <= 40) return '#fbbf24';
  return '#f87171';
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
  const colors = getColors(exposureIndex);

  const shareText = [
    `Just ran my Portugal compliance check on Worktugal.`,
    ``,
    `Setup Score: ${setupScore}/100`,
    `Exposure Index: ${exposureIndex} risk pts`,
    `Risk level: ${riskLabel}`,
    totalTraps > 0
      ? `Traps detected: ${highCount > 0 ? `${highCount} high` : ''}${mediumCount > 0 ? `${highCount > 0 ? ', ' : ''}${mediumCount} medium` : ''}${lowCount > 0 ? `, ${lowCount} low` : ''}`
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
      className="bg-white/[0.01] rounded-3xl border border-white/5 p-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center">
          <Share2 className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <h2 className="text-base font-medium text-white">Share your results</h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">
            Download the card or copy text for Reddit, LinkedIn, Telegram
          </p>
        </div>
      </div>

      {/* Visible preview card */}
      <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 mb-6`}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Worktugal</p>
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-medium">Portugal Compliance Diagnostic</p>
          </div>
          <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${colors.badge}`}>
            {riskLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold mb-1">Setup Score</p>
            <p className={`text-4xl font-serif ${setupScore >= 70 ? 'text-emerald-400' : setupScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {setupScore}<span className="text-lg text-gray-600 font-light">/100</span>
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold mb-1">Exposure Index</p>
            <p className={`text-4xl font-serif ${exposureIndex <= 15 ? 'text-emerald-400' : exposureIndex <= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {exposureIndex}<span className="text-lg text-gray-600 font-light"> pts</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {highCount > 0 && <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">{highCount} High</span>}
          {mediumCount > 0 && <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{mediumCount} Medium</span>}
          {lowCount > 0 && <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">{lowCount} Low</span>}
          {totalTraps === 0 && <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">No traps detected</span>}
        </div>

        <p className="text-[9px] text-gray-600 font-medium mt-5 uppercase tracking-[0.15em]">app.worktugal.com/diagnostic</p>
      </div>

      {/* Hidden export card — solid colors for html2canvas */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={exportRef}
          style={{
            width: 600,
            padding: 48,
            borderRadius: 24,
            backgroundColor: colors.exportBg,
            border: `1.5px solid ${colors.exportBorder}`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 10, color: '#6b7280', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Worktugal</p>
              <p style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>Portugal Compliance Diagnostic</p>
            </div>
            <span style={{
              fontSize: 10, color: colors.exportAccent, letterSpacing: '0.15em',
              textTransform: 'uppercase', fontWeight: 700,
              padding: '6px 14px', borderRadius: 99,
              backgroundColor: colors.exportBadgeBg,
              border: `1px solid ${colors.exportBorder}`,
            }}>
              {riskLabel}
            </span>
          </div>

          {/* Scores */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Setup Score</p>
              <p style={{ fontSize: 56, color: getScoreColor(setupScore, 'setup'), fontWeight: 300, lineHeight: 1 }}>
                {setupScore}<span style={{ fontSize: 24, color: '#374151' }}>/100</span>
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Exposure Index</p>
              <p style={{ fontSize: 56, color: getScoreColor(exposureIndex, 'exposure'), fontWeight: 300, lineHeight: 1 }}>
                {exposureIndex}<span style={{ fontSize: 24, color: '#374151' }}> pts</span>
              </p>
            </div>
          </div>

          {/* Trap badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            {highCount > 0 && (
              <span style={{ fontSize: 10, color: '#f87171', backgroundColor: '#7f1d1d44', border: '1px solid #7f1d1d', padding: '5px 12px', borderRadius: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {highCount} High Risk
              </span>
            )}
            {mediumCount > 0 && (
              <span style={{ fontSize: 10, color: '#fbbf24', backgroundColor: '#78350f44', border: '1px solid #78350f', padding: '5px 12px', borderRadius: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {mediumCount} Medium Risk
              </span>
            )}
            {lowCount > 0 && (
              <span style={{ fontSize: 10, color: '#60a5fa', backgroundColor: '#1e3a5f44', border: '1px solid #1e3a5f', padding: '5px 12px', borderRadius: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {lowCount} Low Risk
              </span>
            )}
            {totalTraps === 0 && (
              <span style={{ fontSize: 10, color: '#34d399', backgroundColor: '#064e3b44', border: '1px solid #064e3b', padding: '5px 12px', borderRadius: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                No traps detected
              </span>
            )}
          </div>

          {/* Divider + URL */}
          <div style={{ borderTop: '1px solid #1f2937', paddingTop: 20 }}>
            <p style={{ fontSize: 10, color: '#374151', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              app.worktugal.com/diagnostic — Free Portugal compliance check
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 text-[10px] uppercase tracking-widest font-bold"
        >
          {downloading ? (
            <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Generating...</>
          ) : (
            <><Download className="w-3 h-3 mr-2" />Download card</>
          )}
        </Button>

        <Button
          onClick={handleCopy}
          variant="secondary"
          className="flex-1 text-[10px] uppercase tracking-widest font-bold"
        >
          {copied ? (
            <><Check className="w-3 h-3 mr-2 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
          ) : (
            <><Copy className="w-3 h-3 mr-2" />Copy text</>
          )}
        </Button>
      </div>

      {copied && (
        <p className="text-[10px] text-gray-600 text-center mt-3 font-light">
          Paste it on Reddit, LinkedIn, or Telegram
        </p>
      )}
    </motion.div>
  );
};
