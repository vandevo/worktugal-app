import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'business.business';
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  structuredData?: object;
  noindex?: boolean;
}

export const Seo: React.FC<SeoProps> = ({
  title = 'Accounting Desk for Remote Professionals in Portugal',
  description = 'Tax compliance made simple for remote professionals in Portugal. Talk to OCC-certified accountants, get a written action plan, and navigate Portuguese tax law with confidence. Starting from €59.',
  ogTitle,
  ogDescription,
  ogImage = 'https://app.worktugal.com/worktugal-logo-bg-light-radius-1000-1000.png',
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  canonicalUrl,
  structuredData,
  noindex = false,
}) => {
  const fullTitle = title.includes('Worktugal') ? title : `${title} | Worktugal`;
  const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}${urlObj.pathname}`.replace(/\/$/, '');
    } catch {
      return url;
    }
  };

  const canonical = canonicalUrl ? normalizeUrl(canonicalUrl) : (currentUrl ? normalizeUrl(currentUrl) : '');
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <meta name="language" content="English" />
      <meta name="author" content="Worktugal" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Worktugal" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={ogTitle || fullTitle} />
      <meta property="twitter:description" content={ogDescription || description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:creator" content="@worktugal" />

      {/* Additional Meta Tags for Local Business */}
      <meta name="geo.region" content="PT-11" />
      <meta name="geo.placename" content="Lisbon" />
      <meta name="geo.position" content="38.7223;-9.1393" />
      <meta name="ICBM" content="38.7223, -9.1393" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};