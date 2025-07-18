import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleFormComplete = () => {
    setShowForm(false);
  };

  return (
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
              
              <FormWizard onComplete={handleFormComplete} />
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