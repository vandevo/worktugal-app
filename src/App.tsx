import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { ServicesPage } from './components/ServicesPage';
import { CheckoutSuccess } from './components/CheckoutSuccess';
import { Dashboard } from './components/Dashboard';
import { SuccessPage } from './components/SuccessPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProtectedSuccessRoute } from './components/ProtectedSuccessRoute';
import { Seo } from './components/Seo';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AccountingDeskLanding } from './components/accounting/AccountingDeskLanding';
import { ConsultSuccess } from './components/accounting/ConsultSuccess';
import { ConsultCheckout } from './components/accounting/ConsultCheckout';
import { AccountantApplicationPage } from './components/accountant/AccountantApplicationPage';
import { AppointmentManagement } from './components/admin/AppointmentManagement';
import { AccountantApplicationReview } from './components/admin/AccountantApplicationReview';
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
          <Route path="/" element={<HomePage />} />
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
          <Route path="/accounting" element={<AccountingDeskLanding />} />
          <Route path="/accounting/checkout" element={<ConsultCheckout />} />
          <Route path="/accounting/consult-success" element={<ConsultSuccess />} />
          <Route path="/join-accountants" element={<AccountantApplicationPage />} />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute>
                <AppointmentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <AccountantApplicationReview />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
      <CookieConsentBanner />
    </Router>
  );
}

export default App;