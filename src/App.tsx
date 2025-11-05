import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { CheckoutSuccess } from './components/CheckoutSuccess';
import { Dashboard } from './components/Dashboard';
import { SuccessPage } from './components/SuccessPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProtectedSuccessRoute } from './components/ProtectedSuccessRoute';
import { AdminRoute } from './components/AdminRoute';
import { Seo } from './components/Seo';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AccountingDeskLanding } from './components/accounting/AccountingDeskLanding';
import { PartnersPage } from './components/PartnersPage';
import { PartnerJoinPage } from './components/PartnerJoinPage';
import { ConsultSuccess } from './components/accounting/ConsultSuccess';
import { ConsultSuccessDemo } from './components/accounting/ConsultSuccessDemo';
import { ConsultCheckout } from './components/accounting/ConsultCheckout';
import { AppointmentManagement } from './components/admin/AppointmentManagement';
import { AccountantApplicationReview } from './components/admin/AccountantApplicationReview';
import { ContactRequestsManager } from './components/admin/ContactRequestsManager';
import { TaxCheckupLeads } from './components/admin/TaxCheckupLeads';
import { AdminTestHub } from './components/admin/AdminTestHub';
import { ComprehensiveIntakeForm } from './components/accounting/ComprehensiveIntakeForm';
import { IntakeSuccess } from './components/accounting/IntakeSuccess';
import { TaxCheckupForm } from './components/accounting/TaxCheckupForm';
import { CheckupResults } from './components/accounting/CheckupResults';
import { CheckupResultsDemo } from './components/accounting/CheckupResultsDemo';
import { ContactPage } from './components/ContactPage';
import { ContactSuccess } from './components/ContactSuccess';
import { ContactSuccessDemo } from './components/ContactSuccessDemo';
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
          {/* Redirects for old routes */}
          <Route path="/accounting-early" element={<Navigate to="/checkup" replace />} />
          <Route path="/accounting" element={<Navigate to="/" replace />} />
          <Route path="/perks" element={<Navigate to="/partners" replace />} />

          {/* Partner Hub routes */}
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/partners/join" element={<PartnerJoinPage />} />

          {/* Accounting Desk routes */}
          <Route path="/accounting/intake" element={<ComprehensiveIntakeForm />} />
          <Route path="/accounting/intake/success" element={<IntakeSuccess />} />
          <Route path="/accounting/checkout" element={<ConsultCheckout />} />
          <Route path="/accounting/consult-success" element={<ConsultSuccess />} />
          <Route path="/accounting/success-demo" element={<ConsultSuccessDemo />} />

          {/* Tax Checkup routes */}
          <Route path="/checkup" element={<TaxCheckupForm />} />
          <Route path="/checkup/results" element={<CheckupResults />} />
          <Route path="/checkup/results/demo" element={<CheckupResultsDemo />} />
          {/* TODO: Create AccountantApplicationPage component */}
          {/* <Route path="/join-accountants" element={<AccountantApplicationPage />} /> */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Navigate to="/dashboard" replace />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <AdminRoute>
                <AppointmentManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/accountant-applications"
            element={
              <AdminRoute>
                <AccountantApplicationReview />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <AdminRoute>
                <ContactRequestsManager />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/checkup-leads"
            element={
              <AdminRoute>
                <TaxCheckupLeads />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/test-hub"
            element={
              <AdminRoute>
                <AdminTestHub />
              </AdminRoute>
            }
          />

          {/* Contact routes */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact/success" element={<ContactSuccess />} />
          <Route path="/contact/success/demo" element={<ContactSuccessDemo />} />
        </Routes>
      </Layout>
      <CookieConsentBanner />
    </Router>
  );
}

export default App;