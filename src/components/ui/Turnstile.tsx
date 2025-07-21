import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onStateChange?: (state: 'loading' | 'ready' | 'verified' | 'error') => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export const Turnstile: React.FC<TurnstileProps> = ({
  siteKey,
  onVerify,
  onStateChange,
  onError,
  onExpire,
  theme = 'dark',
  size = 'normal',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (token: string) => {
    setIsVerified(true);
    onStateChange?.(verified);
    onVerify(token);
  };

  const handleError = () => {
    setIsVerified(false);
    onStateChange?.('error');
    onError?.();
  };

  const handleExpire = () => {
    setIsVerified(false);
    onStateChange?.('ready');
    onExpire?.();
  };
  useEffect(() => {
    // Load Turnstile script if not already loaded
    if (!document.querySelector('script[src*="challenges.cloudflare.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    onStateChange?.('loading');
    if (scriptLoaded && ref.current && window.turnstile && !widgetId) {
      onStateChange?.('ready');
      const id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: handleVerify,
        'error-callback': handleError,
        'expired-callback': handleExpire,
        theme,
        size,
      });
      setWidgetId(id);
    }

    return () => {
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [scriptLoaded, siteKey, theme, size, widgetId]);

  return (
    <div className={className}>
      <div ref={ref} />
      {isVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 flex items-center justify-center space-x-2 text-green-400"
        >
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Verification successful</span>
        </motion.div>
      )}
    </div>
  );
};