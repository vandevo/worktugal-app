import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { TaxCheckupForm } from './components/accounting/TaxCheckupForm';
import { CheckupResults } from './components/accounting/CheckupResults';
import { CheckupResultsDemo } from './components/accounting/CheckupResultsDemo';
import { PaidReviewPage } from './components/accounting/PaidReviewPage';
import { AccountingDeskLanding } from './components/accounting/AccountingDeskLanding';
import { ConsultBookingForm } from './components/accounting/ConsultBookingForm';
import { ConsultCheckout } from './components/accounting/ConsultCheckout';
import { ConsultSuccess } from './components/accounting/ConsultSuccess';
import { ConsultSuccessDemo } from './components/accounting/ConsultSuccessDemo';
import { ContactPage } from './components/ContactPage';
import { ContactSuccess } from './components/ContactSuccess';
import { ContactSuccessDemo } from './components/ContactSuccessDemo';
import { PartnersPage } from './components/PartnersPage';
import { PartnerJoinPage } from './components/PartnerJoinPage';
import { PerksDirectory } from './components/PerksDirectory';
import { Dashboard } from './components/Dashboard';
import { SuccessPage } from './components/SuccessPage';
import { IntakeSuccess } from './components/accounting/IntakeSuccess';
import { AccountantApplicationForm } from './components/accounting/AccountantApplicationForm';
import { AccountantApplicationSuccess } from './components/accounting/AccountantApplicationSuccess';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { RouteTracker } from './components/RouteTracker';
import { CookieConsentBanner } from './components/CookieConsentBanner';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CookieConsentProvider>
          <Router>
            <RouteTracker />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/checkup" element={<TaxCheckupForm />} />
                <Route path="/checkup/results" element={<CheckupResults />} />
                <Route path="/checkup/results/demo" element={<CheckupResultsDemo />} />
                <Route path="/compliance-review" element={<PaidReviewPage />} />
                <Route path="/accounting" element={<AccountingDeskLanding />} />
                <Route path="/consult" element={<ConsultBookingForm />} />
                <Route path="/consult/checkout" element={<ConsultCheckout />} />
                <Route path="/consult/success" element={<ConsultSuccess />} />
                <Route path="/consult/success/demo" element={<ConsultSuccessDemo />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/contact/success" element={<ContactSuccess />} />
                <Route path="/contact/success/demo" element={<ContactSuccessDemo />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/partner/join" element={<PartnerJoinPage />} />
                <Route path="/perks" element={<PerksDirectory />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/intake/success" element={<IntakeSuccess />} />
                <Route path="/apply" element={<AccountantApplicationForm />} />
                <Route path="/apply/success" element={<AccountantApplicationSuccess />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
            <CookieConsentBanner />
          </Router>
        </CookieConsentProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
