import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './styles/globals.css';
import { CookieConsentProvider } from './contexts/CookieConsentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <CookieConsentProvider>
        <App />
      </CookieConsentProvider>
    </HelmetProvider>
  </StrictMode>
);