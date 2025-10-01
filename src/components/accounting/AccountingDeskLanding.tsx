import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Seo } from '../Seo';
import { AccountingHero } from './AccountingHero';
import { ConsultPricingSection } from './ConsultPricingSection';
import { HowItWorks } from './HowItWorks';
import { ConsultFAQ } from './ConsultFAQ';
import { ConsultBookingForm } from './ConsultBookingForm';
import { useNavigate } from 'react-router-dom';
import type { ServiceType } from '../../types/accounting';

type ViewMode = 'landing' | 'booking';

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
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
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
            <div id="pricing">
              <ConsultPricingSection onSelectService={handleSelectService} />
            </div>
            <HowItWorks />
            <ConsultFAQ />
          </div>
        ) : (
          <div key="booking" className="min-h-screen bg-gray-50 py-20">
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
