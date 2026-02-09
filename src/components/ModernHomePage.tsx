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
        title="Worktugal - Compliance Readiness for Remote Professionals"
        description="Verify your compliance status in Portugal. The readiness layer for foreign freelancers and remote workers."
        ogTitle="Worktugal - Compliance Readiness Layer"
        ogDescription="Check your tax residency and compliance status in 3 minutes. Stop unverified decisions."
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
