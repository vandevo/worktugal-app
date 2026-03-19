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
