```tsx
import React from 'react';
import { Seo } from '../components/Seo';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Seo
        title="Privacy Policy - Worktugal Pass"
        description="Worktugal Pass Privacy Policy. We respect your data, use only necessary cookies, and comply with EU GDPR."
      />
      <div className="min-h-screen bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

          <p className="mb-4">
            <strong>Effective Date: August 9, 2025</strong>
          </p>

          <p className="mb-4">
            This Privacy Policy explains how Worktugal Pass ("we," "us," or "our") collects, uses, and protects your personal data when you use our website or services.
          </p>

          <p className="mb-4">We are operated by:</p>

          <p className="mb-4">
            <strong>Xolo Go OU - Van Vo</strong><br />
            Registry code: 14717109<br />
            EU VAT: EE102156920<br />
            Registered address: Paju tn 1a, 50603 Tartu, Estonia<br />
            Email: <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:underline">hello@worktugal.com</a>
          </p>

          <p className="mb-4">
            We are based in the European Union and comply with the{' '}
            <a href="https://gdpr-info.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">General Data Protection Regulation (GDPR)</a>.
          </p>

          <div className="border-t border-gray-700 my-8"></div>

          <h2 className="text-xl font-semibold mb-4">1. What We Collect</h2>
          <p className="mb-4">We only collect the data necessary to provide our services, including:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Partner listings: name, email, WhatsApp, business info</li>
            <li>Payments: Stripe processes payment data (we don't store card info)</li>
            <li>Website visits: anonymized cookie and usage data (with consent)</li>
            <li>Contact: any info you voluntarily provide via forms or messages</li>
          </ul>
          <p className="mb-4">We never ask for or store sensitive data without clear consent.</p>

          <div className="border-t border-gray-700 my-8"></div>

          <h2 className="text-xl font-semibold mb-4">2. Why We Collect It</h2>
          <p className="mb-4">We collect and process your data to:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Create and manage your Worktugal Pass listing</li>
            <li>Process payments and send confirmations</li>
            <li>Improve the website experience</li>
            <li>Send relevant updates or event invites</li>
            <li>Fulfill legal, accounting, or tax requirements</li>
          </ul>
          <p className="mb-4">We only process data under lawful bases: contract, consent, or legal obligation.</p>

          <div className="border-t border-gray-700 my-8"></div>

          <h2 className="text-xl font-semibold mb-4">3. How We Store and Protect It</h2>
          <p className="mb-4">Your data is stored securely using:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Supabase</a> (accounts, partner submissions)</li>
            <li><a href="https://stripe.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Stripe</a> (payments)</li>
            <li><a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Netlify</a> (hosting)</li>
            <li><a href="https://www.make.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Make.com</a> (automated emails)</li>
          </ul>
          <p className="mb-4">We apply strict access controls and appropriate technical safeguards to protect your information.</p>

          <div className="border-t border-gray-700 my-8"></div>

          <h2 className="text-xl font-semibold mb-4">4. Data Sharing</h2>
          <p className="mb-4">We do not sell or rent your data.</p>
          <p className="mb-4">We share data only with GDPR-compliant service providers who help us operate Worktugal Pass:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Stripe (payments)</li>
            <li>Supabase (database and auth)</li>
            <li>Make.com (automation)</li>
            <li>Netlify (hosting)</li>
          </ul>

          <div className="border-t border-gray-700 my-8"></div>

          <h2 className="text-xl font-semibold mb-4">5. Your Rights (Under GDPR)</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate info</li>
            <li>Request deletion ("right to be forgotten")</li>
            <li>Withdraw consent at any time</li>
            <li>File a complaint with your local data authority</li>
          </ul>
          <p className="mb-4">
            To exercise your rights, email: <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:underline">hello@worktugal.com</a>
          </p>
          <p className="mb-4">We respond within 30 days.</p>

          <div className="border-t border-gray-700 my-8"></div>

          <h2 className="text-xl font-semibold mb-4">6. Cookies</h2>
          <p className="mb-4">We use cookies only after you consent. They help us analyze usage and improve the experience.</p>
          <p className="mb-4">You can manage or revoke cookie preferences at any time through our site settings.</p>

          <div className="border-t border-gray-700 my-8"></div>

          <h2 className="text-xl font-semibold mb-4">7. Policy Updates</h2>
          <p className="mb-4">If we change this Privacy Policy, we'll update the date above and notify you when relevant.</p>
          <p className="mb-4">
            The latest version will always be available at:{' '}
            <a href="https://pass.worktugal.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://pass.worktugal.com/privacy</a>
          </p>

          <div className="border-t border-gray-700 my-8"></div>

          <h2 className="text-xl font-semibold mb-4">Questions or Concerns?</h2>
          <p className="mb-4">
            Email: <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:underline">hello@worktugal.com</a>
          </p>
          <p className="mb-4">We're building Worktugal Pass with transparency, trust, and respect for your data.</p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
```