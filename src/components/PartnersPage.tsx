import React from 'react';
import { Seo } from './Seo';
import { PerksDirectory } from './PerksDirectory';
import { motion } from 'framer-motion';
import { Shield, Users } from 'lucide-react';

export const PartnersPage: React.FC = () => {
  return (
    <>
      <Seo
        title="Our network: established partners in Lisbon"
        description="Connect with established Lisbon professionals who support remote professionals. Verified accountants, coworking spaces, and legal experts."
        ogTitle="Our network: established partners in Lisbon"
        ogDescription="Connect with established Lisbon professionals who support remote professionals. Verified accountants, coworking spaces, and legal experts."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/partners"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Our network: established partners in Lisbon",
          "description": "Connect with established Lisbon professionals who support remote professionals. Verified accountants, coworking spaces, and legal experts.",
          "url": "https://app.worktugal.com/partners",
          "image": "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png",
          "inLanguage": "en-US",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Worktugal Pass",
            "url": "https://app.worktugal.com/"
          },
          "about": {
            "@type": "Thing",
            "name": "Professional Services for Remote Workers",
            "description": "Accounting, legal, coworking, and business services"
          },
          "provider": {
            "@type": "Organization",
            "name": "Worktugal",
            "url": "https://worktugal.com/",
            "logo": "https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png",
            "sameAs": [
              "https://www.linkedin.com/company/worktugal/",
              "https://t.me/worktugal"
            ]
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative py-24 bg-obsidian overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.05),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 bg-white/5 text-gray-400 px-4 py-2 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] border border-white/10">
              <Shield className="w-3.5 h-3.5 text-blue-500/50" />
              <span>Founding Partners</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif text-white mb-8 leading-[1.1]">
              Our Network
            </h1>
            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              These established Lisbon professionals have been part of Worktugal since the beginning. From accountants to coworking spaces, they've helped shape how we support remote professionals in Portugal.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-500/50" />
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">Verified Businesses</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-500/50" />
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">Member Benefits</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Partners Directory */}
      <PerksDirectory />
    </>
  );
};
