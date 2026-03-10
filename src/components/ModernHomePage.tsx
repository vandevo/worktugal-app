import React from 'react';
import { ModernHero } from './accounting/ModernHero';
import { ModernFeatures } from './accounting/ModernFeatures';
import { ModernComplianceReviewCTA } from './accounting/ModernComplianceReviewCTA';
import { ModernTestimonials } from './accounting/ModernTestimonials';
import { CheckupFAQ } from './accounting/CheckupFAQ';
import { Seo } from './Seo';

export const ModernHomePage: React.FC = () => {
  return (
    <>
      <Seo
        title="Worktugal: find hidden compliance risks before Portugal fines you"
        description="Free 3-minute diagnostic for remote workers, freelancers, and expats in Portugal. Discover compliance traps, penalty exposure, and corrective actions with legal citations."
        ogTitle="Worktugal: compliance risk diagnostic for remote workers and freelancers in Portugal"
        ogDescription="13 questions. Dual risk scoring. Source-cited legal basis. Find what you missed before it costs you up to €3,750."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/"
      />

      <ModernHero />
      <ModernFeatures />
      <ModernComplianceReviewCTA />
      <ModernTestimonials />
      <CheckupFAQ />
    </>
  );
};
