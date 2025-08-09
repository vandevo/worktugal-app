import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <CookieConsentProvider>
        <App />
      </CookieConsentProvider>
    </HelmetProvider>
  </StrictMode>
);
