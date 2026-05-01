import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://0ac16978fc184aefb8faefba49dbc4e9@errors.worktugal.com/1',
  integrations: [Sentry.browserTracingIntegration()],
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    if (window.location.hostname === 'localhost') return null;
    return event;
  },
});

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './styles/globals.css';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <CookieConsentProvider>
          <App />
        </CookieConsentProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
