import React, { useState, useRef } from 'react';
import { Copy, Check, Download, Loader2 } from 'lucide-react';
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

export const ShareCard: React.FC<ShareCardProps> = ({
  setupScore,
  exposureIndex,
  highCount,
  mediumCount,
  lowCount,
  diagnosticId: _diagnosticId,
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
    <>
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
              app.worktugal.com/diagnostic · Free Portugal compliance check
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons — rendered inline, layout controlled by parent */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F3D2E] text-white text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#1A5C44] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {downloading ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</>
        ) : (
          <><Download className="w-3.5 h-3.5" />Download card</>
        )}
      </button>

      <button
        onClick={handleCopy}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98] ${
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
    </>
  );
};
