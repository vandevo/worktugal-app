import React from 'react';
import { Seo } from '../Seo';
import { AccountingEarlyHero } from './AccountingEarlyHero';
import { EarlyAccessWhatToExpect } from './EarlyAccessWhatToExpect';
import { EarlyAccessForm } from './EarlyAccessForm';
import { AccountantRecruitmentBanner } from './AccountantRecruitmentBanner';

export const AccountingEarlyAccessLanding: React.FC = () => {
  const handleJoinWaitlist = () => {
    const formElement = document.getElementById('early-access-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Seo
        title="Early Access - Accounting Desk for Expats | Worktugal"
        description="Join the waitlist for Worktugal Accounting Desk. Prepaid tax consults for freelancers and expats in Portugal. Priority access for early birds."
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Worktugal Accounting Desk - Early Access",
          "description": "Tax and accounting consults for expats and freelancers in Portugal - Early Access",
          "url": "https://pass.worktugal.com/accounting-early",
          "areaServed": {
            "@type": "Country",
            "name": "Portugal"
          }
        }}
      />

      <div>
        <AccountingEarlyHero onJoinWaitlist={handleJoinWaitlist} />

        <EarlyAccessWhatToExpect />

        <div id="early-access-form">
          <EarlyAccessForm />
        </div>

        <AccountantRecruitmentBanner />
      </div>
    </>
  );
};
