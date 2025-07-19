import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Seo } from './components/Seo';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { FormWizard } from './components/FormWizard';
import { PerksDirectory } from './components/PerksDirectory';
import { PricingSection } from './components/PricingSection';
import { SuccessPage } from './components/SuccessPage';
import { Footer } from './components/Footer';
import { useAuth } from './hooks/useAuth';

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
        title="Partner Portal - Lisbon's Trusted Perk Marketplace for Remote Professionals"
        description="Join 1,000+ verified remote workers in Lisbon. Get exclusive perks from local businesses or become a partner. €49 early access for businesses."
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
              
              <FormWizard 
                onComplete={handleFormComplete} 
                submissionId={submissionId}
              />
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
            <PerksDirectory />
            <PricingSection />
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
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;