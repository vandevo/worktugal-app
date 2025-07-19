import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, Suspense } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Seo } from './components/Seo';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { useAuth } from './hooks/useAuth';

// Lazy load components for better performance
const FormWizard = React.lazy(() => import('./components/FormWizard').then(module => ({ default: module.FormWizard })));
const PerksDirectory = React.lazy(() => import('./components/PerksDirectory').then(module => ({ default: module.PerksDirectory })));
const PricingSection = React.lazy(() => import('./components/PricingSection').then(module => ({ default: module.PricingSection })));
const SuccessPage = React.lazy(() => import('./components/SuccessPage').then(module => ({ default: module.SuccessPage })));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const HomePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Check for submission ID in URL parameters
  const submissionIdParam = searchParams.get('submission');
  const submissionId = submissionIdParam ? parseInt(submissionIdParam, 10) : undefined;
  
  // Auto-show form if there's a submission ID
  React.useEffect(() => {
    if (submissionId && !showForm) {
      setShowForm(true);
    }
  }, [submissionId, showForm]);

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleFormComplete = () => {
    setShowForm(false);
  };

  return (
    <>
      <Seo
        title="Lisbon Perks for Remote Workers | Worktugal Pass"
        description="Join 1,000+ verified remote workers in Lisbon's trusted perk marketplace. Get exclusive discounts at cafés, gyms, coworking spaces, and more. Lifetime access."
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Worktugal Pass",
          "description": "Lisbon's trusted perk marketplace for remote professionals and expats",
          "url": "https://pass.worktugal.com",
          "telephone": "+351912345678",
          "email": "hello@worktugal.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lisbon",
            "addressCountry": "PT"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 38.7223,
            "longitude": -9.1393
          },
          "sameAs": [
            "https://www.instagram.com/worktugal/",
            "https://t.me/worktugal"
          ]
        }}
      />
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-900 py-20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <motion.button
                  onClick={handleFormComplete}
                  className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
                  whileHover={{ x: -4 }}
                >
                  ← Back to directory
                </motion.button>
                <h1 className="text-3xl font-bold mb-2">Join our partner network</h1>
                <p className="text-gray-400">Get your business in front of 1,000+ remote workers</p>
              </div>
              
              <Suspense fallback={<LoadingSpinner />}>
                <FormWizard 
                  onComplete={handleFormComplete} 
                  submissionId={submissionId}
                />
              </Suspense>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onGetStarted={handleGetStarted} />
            <Suspense fallback={<LoadingSpinner />}>
              <PerksDirectory />
            </Suspense>
            <Suspense fallback={<LoadingSpinner />}>
              <PricingSection />
            </Suspense>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/success" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SuccessPage />
            </Suspense>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;