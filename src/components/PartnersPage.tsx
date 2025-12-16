import React from 'react';
import { Seo } from './Seo';
import { PerksDirectory } from './PerksDirectory';
import { motion } from 'framer-motion';
import { Shield, Users } from 'lucide-react';

export const PartnersPage: React.FC = () => {
  return (
    <>
      <Seo
        title="Our Network - Founding Partners in Lisbon"
        description="Established Lisbon professionals who've supported Worktugal since the beginning. Accountants, coworking spaces, and service providers helping remote workers in Portugal."
        ogTitle="Worktugal Network - Founding Partners in Lisbon"
        ogDescription="Our founding partner network includes established Lisbon professionals: accountants, coworking spaces, and service providers who've been with us since the start."
        ogImage="https://jbmfneyofhqlwnnfuqbd.supabase.co/storage/v1/object/public/perk-assets/business-logos/worktugal-logo-bg-light-radius-1000-1000.png"
        ogType="website"
        ogUrl="https://app.worktugal.com/partners"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Worktugal Network - Founding Partners",
          "description": "Our founding partner network of established Lisbon professionals supporting remote workers in Portugal",
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
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiMyMzY1YzQiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/20">
              <Shield className="w-4 h-4" />
              <span>Founding Partners</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Our Network
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              These established Lisbon professionals have been part of Worktugal since the beginning. From accountants to coworking spaces, they've helped shape how we support remote workers in Portugal.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Verified Businesses</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Member Benefits Available</span>
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
