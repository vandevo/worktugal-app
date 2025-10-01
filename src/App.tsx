import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FormWizard } from './components/FormWizard';
import { ServicesPage } from './components/ServicesPage';
import { CheckoutSuccess } from './components/CheckoutSuccess';
import { Dashboard } from './components/Dashboard';
import { SuccessPage } from './components/SuccessPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProtectedSuccessRoute } from './components/ProtectedSuccessRoute';
import { Seo } from './components/Seo';
import { useFormData } from './hooks/useFormData';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { type ProductName } from './stripe-config';

function App() {
  const [selectedService, setSelectedService] = useState<ProductName | null>(null);

  const handleServiceSelect = (productName: ProductName) => {
    setSelectedService(productName);
  };

  return (
    <Router>
      <Seo />
      <Layout>
        <Routes>
          <Route path="/" element={<FormWizard />} />
          <Route
            path="/services"
            element={<ServicesPage onServiceSelect={handleServiceSelect} />}
          />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedSuccessRoute>
                <SuccessPage />
              </ProtectedSuccessRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
      </Layout>
      <CookieConsentBanner />
    </Router>
  );
}

export default App;