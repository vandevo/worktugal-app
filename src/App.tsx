import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { Dashboard } from './components/Dashboard';
import { ContactPage } from './components/ContactPage';
import { ContactSuccess } from './components/ContactSuccess';
import { PartnersPage } from './components/PartnersPage';
import { PartnerJoinPage } from './components/PartnerJoinPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { PerksDirectory } from './components/PerksDirectory';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { RouteTracker } from './components/RouteTracker';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { TaxCheckupForm } from './components/accounting/TaxCheckupForm';
import { CheckupResults } from './components/accounting/CheckupResults';
import { CheckupResultsDemo } from './components/accounting/CheckupResultsDemo';
import { PaidReviewPage } from './components/accounting/PaidReviewPage';
import { AccountingDeskLanding } from './components/accounting/AccountingDeskLanding';
import { ComprehensiveIntakeForm } from './components/accounting/ComprehensiveIntakeForm';
import { IntakeSuccess } from './components/accounting/IntakeSuccess';
import { ConsultCheckout } from './components/accounting/ConsultCheckout';
import { ConsultSuccess } from './components/accounting/ConsultSuccess';
import { ConsultSuccessDemo } from './components/accounting/ConsultSuccessDemo';
import { AccountantApplicationForm } from './components/accounting/AccountantApplicationForm';
import { AccountantApplicationSuccess } from './components/accounting/AccountantApplicationSuccess';
import { ContactRequestsManager } from './components/admin/ContactRequestsManager';
import { TaxCheckupLeads } from './components/admin/TaxCheckupLeads';
import { AccountantApplicationReview } from './components/admin/AccountantApplicationReview';
import { AppointmentManagement } from './components/admin/AppointmentManagement';
import { PaidReviewsAdmin } from './components/admin/PaidReviewsAdmin';
import { ChangelogManager } from './components/admin/ChangelogManager';
import { AdminTestHub } from './components/admin/AdminTestHub';
import { CheckoutSuccess } from './components/CheckoutSuccess';

function App() {
  return (
    <AuthProvider>
      <Router>
        <RouteTracker />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/checkup" element={<TaxCheckupForm />} />
            <Route path="/checkup/results" element={<CheckupResults />} />
            <Route path="/checkup/demo" element={<CheckupResultsDemo />} />

            <Route path="/compliance-review" element={<PaidReviewPage />} />

            <Route path="/accounting" element={<AccountingDeskLanding />} />
            <Route path="/accounting/intake" element={<ComprehensiveIntakeForm />} />
            <Route path="/accounting/intake/success" element={<IntakeSuccess />} />
            <Route path="/accounting/checkout" element={<ConsultCheckout />} />
            <Route path="/accounting/success" element={<ConsultSuccess />} />
            <Route path="/accounting/demo/success" element={<ConsultSuccessDemo />} />

            <Route path="/accountants/apply" element={<AccountantApplicationForm />} />
            <Route path="/accountants/apply/success" element={<AccountantApplicationSuccess />} />

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact-success" element={<ContactSuccess />} />

            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/partners/join" element={<PartnerJoinPage />} />

            <Route path="/perks" element={<PerksDirectory />} />

            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />

            <Route path="/checkout/success" element={<CheckoutSuccess />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
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
              path="/admin/accountant-applications"
              element={
                <AdminRoute>
                  <AccountantApplicationReview />
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
              path="/admin/paid-reviews"
              element={
                <AdminRoute>
                  <PaidReviewsAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/changelog"
              element={
                <AdminRoute>
                  <ChangelogManager />
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
          </Routes>
        </Layout>
        <CookieConsentBanner />
      </Router>
    </AuthProvider>
  );
}

export default App;
