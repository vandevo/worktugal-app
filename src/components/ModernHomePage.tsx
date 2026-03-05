import React from 'react';
import { ModernHero } from './accounting/ModernHero';
import { ModernFeatures } from './accounting/ModernFeatures';
import { ModernPartners } from './accounting/ModernPartners';
import { ModernComplianceReviewCTA } from './accounting/ModernComplianceReviewCTA';
import { ModernTestimonials } from './accounting/ModernTestimonials';
import { CheckupFAQ } from './accounting/CheckupFAQ';
import { Seo } from './Seo';

export const ModernHomePage: React.FC = () => {
  return (
    <>
      <Seo
        title="Worktugal: find hidden compliance risks before Portugal fines you"
        description="Free 3-minute diagnostic for freelancers in Portugal. Discover compliance traps, penalty exposure, and corrective actions with legal citations."
        ogTitle="Worktugal: compliance risk diagnostic for freelancers in Portugal"
        ogDescription="12 questions. Dual risk scoring. Source-cited legal basis. Find what you missed before it costs you 150 to 3,750 EUR."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/"
      />

      {/* Primary: Modern AI Search Hero */}
      <ModernHero />

      {/* Features: Why Compliance Matters */}
      <ModernFeatures />

      {/* CTA: Compliance Review */}
      <ModernComplianceReviewCTA />

      {/* Partners: Trusted By Best */}
      <ModernPartners />

      {/* Testimonials Section */}
      <ModernTestimonials />

      {/* FAQ Section */}
      <CheckupFAQ />
    </>
  );
};
