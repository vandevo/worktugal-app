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
import { EarlyAccessForm } from './EarlyAccessForm';
import { ConsultBookingForm } from './ConsultBookingForm';
import { useNavigate } from 'react-router-dom';
import type { ServiceType } from '../../types/accounting';

type ViewMode = 'landing' | 'booking';

// Early Birds Phase Flag - Set to false when ready to launch full booking
const EARLY_BIRDS_MODE = false;

export const AccountingDeskLanding: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
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
    // Scroll to the pricing section
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

            {/* Early Access Form - Embedded directly on page */}
            {EARLY_BIRDS_MODE && (
              <div id="early-access-form">
                <EarlyAccessForm />
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

    </>
  );
};
