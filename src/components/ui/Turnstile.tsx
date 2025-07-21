import React, { useEffect, useRef, useState } from 'react';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
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
  onError,
  onExpire,
  theme = 'dark',
  size = 'normal',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
    if (scriptLoaded && ref.current && window.turnstile && !widgetId) {
      const id = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': onError,
        'expired-callback': onExpire,
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
  }, [scriptLoaded, siteKey, onVerify, onError, onExpire, theme, size, widgetId]);

  return <div ref={ref} className={className} />;
};