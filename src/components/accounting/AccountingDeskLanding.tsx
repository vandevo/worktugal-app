import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Seo } from '../Seo';
import { AccountingHero } from './AccountingHero';
import { ConsultPricingSection } from './ConsultPricingSection';
import { WhatToExpect } from './WhatToExpect';
import { HowItWorks } from './HowItWorks';
import { MeetAccountants } from './MeetAccountants';
import { ConsultFAQ } from './ConsultFAQ';
import { AccountantRecruitmentBanner } from './AccountantRecruitmentBanner';
import { AccountingWaitlistModal } from './AccountingWaitlistModal';
import { ConsultBookingForm } from './ConsultBookingForm';
import { useNavigate } from 'react-router-dom';
import type { ServiceType } from '../../types/accounting';

type ViewMode = 'landing' | 'booking';

// Early Birds Phase Flag - Set to false when ready to launch full booking
const EARLY_BIRDS_MODE = true;

export const AccountingDeskLanding: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectService = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
    setViewMode('booking');
  };

  const handleBackToLanding = () => {
    setViewMode('landing');
    setSelectedService(null);
  };

  const handleBookingSuccess = (bookingId: number) => {
    navigate(`/accounting/checkout?booking=${bookingId}`);
  };

  const handleBookNow = () => {
    setIsWaitlistModalOpen(true);
  };

  return (
    <>
      <Seo
        title="Accounting Desk for Expats in Portugal | Worktugal"
        description="Prepaid tax consults for freelancers and expats in Portugal. Book an OCC-certified accountant. Clear pricing, written outcomes, no surprises. From €59."
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Worktugal Accounting Desk",
          "description": "Tax and accounting consults for expats and freelancers in Portugal",
          "url": "https://pass.worktugal.com/accounting",
          "priceRange": "€59-€349",
          "areaServed": {
            "@type": "Country",
            "name": "Portugal"
          }
        }}
      />

      <AnimatePresence mode="wait">
        {viewMode === 'landing' ? (
          <div key="landing">
            <AccountingHero onBookNow={handleBookNow} />

            {/* Early Birds Banner */}
            {EARLY_BIRDS_MODE && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Launching Soon - Join Early Access
                  </h3>
                  <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
                    We're building something special. Be first in line when booking opens.
                    Get priority access and exclusive launch updates.
                  </p>
                  <button
                    onClick={handleBookNow}
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Join the Waitlist
                  </button>
                </div>
              </div>
            )}

            {/* Hide pricing during Early Birds phase */}
            {!EARLY_BIRDS_MODE && (
              <div id="pricing">
                <ConsultPricingSection onSelectService={handleSelectService} />
              </div>
            )}

            <WhatToExpect />
            <HowItWorks />
            <MeetAccountants />
            <ConsultFAQ />
            <AccountantRecruitmentBanner />
          </div>
        ) : (
          <div key="booking" className="min-h-screen bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {selectedService && (
                <ConsultBookingForm
                  serviceType={selectedService}
                  onSuccess={handleBookingSuccess}
                  onBack={handleBackToLanding}
                />
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      <AccountingWaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </>
  );
};
