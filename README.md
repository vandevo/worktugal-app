WORKTUGAL PASS - PARTNER PORTAL COMPLETE DOCUMENTATION

1. GENERAL PROJECT INFO

Project name: Worktugal Pass - Partner Portal
One-sentence summary: A production-ready, mobile-first B2B web application for Worktugal Pass — Lisbon's trusted perk marketplace for remote professionals and expats.
Target audience: Local businesses in Lisbon who want to attract remote workers, freelancers, and digital nomads
Problem this solves: Connects local businesses with quality remote professionals through a trusted marketplace, eliminating the need for businesses to find and market to remote workers individually
Version: v1.2.0
Live URL: https://pass.worktugal.com
Status: production
Author or builder: Worktugal team
Last updated: 2025-07-21

2. CORE FUNCTIONALITY

Input flows:
- Multi-step business registration form (Business Info → Perk Details → Payment → Success)
- User authentication (email/password signup and login)
- File uploads for business logos and perk images
- Business categorization and location selection
- Perk redemption method configuration
- Tax information collection (NIF) for Portuguese invoices

Output logic:
- Partner submissions stored in database with status tracking
- Payment processing through Stripe with webhook confirmations
- Email confirmations and status updates
- Public perk directory with filtering and search
- User profile management and subscription status display

CTA logic:
- Primary CTA: "List My Offer" button leads to form wizard
- Secondary CTA: "Browse Verified Perks" scrolls to directory
- Form completion leads to Stripe checkout
- Payment success redirects to success page with next steps
- Directory perks have action buttons for redemption (WhatsApp, email, website)

Payment flows:
- One-time payment: €49 early access lifetime listing fee
- Stripe Checkout integration with webhook processing
- Payment status tracking and partner submission updates
- Support for future subscription models (infrastructure ready)

Integrations used:
- Supabase: Database, authentication, storage, edge functions
- Stripe: Payment processing, customer management, webhooks
- Netlify: Static site hosting and continuous deployment
- Google Analytics 4: User behavior tracking
- Simple Analytics: Privacy-first analytics
- Cloudflare: DNS management and CDN

3. TECH STACK + ARCHITECTURE

Frontend framework and tooling:
- React 18 with TypeScript for full type safety
- Vite as build tool and development server
- React Router DOM for client-side routing
- React Hook Form with Zod validation for form management
- Framer Motion for animations and micro-interactions
- Tailwind CSS for utility-first styling
- Lucide React for icons

Backend/database stack:
- Supabase as Backend-as-a-Service
- PostgreSQL database with Row Level Security (RLS)
- Supabase Edge Functions for serverless logic
- Real-time subscriptions for live data updates

Auth system:
- Supabase Auth with email/password authentication
- No email confirmation required for faster onboarding
- Row Level Security policies for data protection
- Session management with automatic token refresh
- Protected routes and authentication guards

Storage logic:
- Supabase Storage for file uploads
- Public bucket 'perk-assets' for images and logos
- 5MB file size limit per upload
- MIME type restrictions: image/jpeg, image/png, image/webp
- Folder organization: business-logos/, perk-images/
- Public read access, authenticated write access

Deployment method and host:
- Netlify static site hosting
- Continuous deployment from Git repository
- Custom domain with SSL/TLS termination
- Serverless functions via Supabase Edge Functions

Build toolchain:
- Vite with React plugin
- TypeScript compilation
- PostCSS with Autoprefixer
- Tailwind CSS processing
- Bundle optimization with manual chunks
- Tree shaking and code splitting

4. INFRASTRUCTURE + CONFIG

Environment variable keys and descriptions:
- VITE_SUPABASE_URL: Supabase project URL for database and API access
- VITE_SUPABASE_ANON_KEY: Supabase anonymous key for client-side operations
- VITE_STRIPE_PUBLISHABLE_KEY: Stripe publishable key for payment processing (pk_test_ for development, pk_live_ for production)

DNS, custom domain, and HTTPS setup:
- Primary domain: pass.worktugal.com
- DNS managed through Cloudflare
- CNAME record pointing to Netlify deployment
- Automatic SSL/TLS certificate via Netlify
- Cloudflare proxy enabled for performance and security

Edge functions or serverless logic:
- stripe-checkout: Creates Stripe checkout sessions for payments
- stripe-webhook: Processes Stripe webhook events for payment status updates
- Both functions handle CORS, authentication, and error handling

Database types and migration status:
- PostgreSQL with custom enum types for status management
- Tables: user_profiles, stripe_customers, stripe_subscriptions, stripe_orders, partner_submissions
- Views: stripe_user_subscriptions, stripe_user_orders
- All migrations applied and documented in supabase/migrations/
- Row Level Security enabled on all tables

External service setup steps:
- Supabase: Project created, database configured, auth enabled, storage buckets created
- Stripe: Account verified, products created, webhooks configured, test/live keys obtained
- Netlify: Site deployed, custom domain configured, environment variables set
- Cloudflare: DNS configured, proxy enabled, security settings applied
- Google Analytics: Property created, tracking ID implemented

5. UI + DESIGN SYSTEM

Mobile-first layout: yes
- Responsive design with breakpoints: xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface elements
- Optimized form layouts for mobile devices

CSS system: Tailwind CSS
- Utility-first approach with custom configuration
- Consistent spacing using 8px grid system
- Custom color palette extension
- Component-based styling patterns

Typography:
- Font family: Inter (system font stack fallback)
- Hierarchy: h1 (4xl-6xl), h2 (2xl-3xl), h3 (xl-2xl), body (base), small (sm-xs)
- Line heights: 150% for body text, 120% for headings
- Maximum 3 font weights used throughout

Color tokens:
- Primary: Blue (#3B82F6 to #1D4ED8)
- Secondary: Purple (#8B5CF6 to #7C3AED)
- Success: Green (#10B981 to #059669)
- Warning: Orange (#F59E0B to #D97706)
- Error: Red (#EF4444 to #DC2626)
- Neutral: Gray scale (#F9FAFB to #111827)
- Background: Dark theme (#111827 primary, #1F2937 secondary)

Spacing and sizing grid:
- Base unit: 8px
- Common spacings: 4px, 8px, 16px, 24px, 32px, 48px, 64px
- Container max-widths: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Consistent padding and margin patterns

Animation style:
- Framer Motion powered micro-interactions
- Subtle hover states and transitions
- Loading states and form progression animations
- Page transitions and modal animations
- Performance-optimized with proper motion preferences

6. SECURITY AND PRIVACY

Auth protection level:
- Row Level Security (RLS) enabled on all database tables
- Users can only access their own data through RLS policies
- Authentication required for form submissions and file uploads
- Session-based authentication with secure token handling

File upload restrictions:
- MIME types: image/jpeg, image/png, image/webp only
- File size limit: 5MB per file
- Maximum 3 perk images per submission
- Authenticated uploads only, public read access
- Automatic file validation and error handling

Payment security:
- PCI compliance through Stripe integration
- No sensitive payment data stored in application database
- Webhook signature verification for security
- HTTPS-only webhook endpoints in production
- Stripe customer data synchronized securely

Sensitive data handling rules:
- Environment variables never committed to version control
- Production keys stored securely in deployment platform
- Database connection strings encrypted and managed by Supabase
- User passwords hashed and managed by Supabase Auth
- Personal data protected under RLS policies

Environment key safety protocols:
- Separate keys for development and production environments
- Regular key rotation recommended
- Keys stored in deployment platform environment variables
- Local development uses .env files (gitignored)
- No hardcoded keys in source code

Backup strategy and frequency:
- Supabase automatic database backups (daily)
- Git repository serves as code backup
- Environment variables documented and stored securely
- Database schema versioned through migrations
- Recovery procedures documented

7. DEPLOYMENT + VERSIONING

Build command: npm run build
Publish directory: dist
GitHub repo link: Private repository
Last Git commit message: Update pricing section headline to be unique while maintaining core message
Current deployment branch: main
Status: production
Clone-ready: yes
Tag version: v1.2.0

Deployment configuration:
- Netlify continuous deployment from Git
- Build command: npm run build
- Node version: 18.x
- Environment variables configured in Netlify dashboard
- Custom domain with SSL automatically provisioned
- Deploy previews enabled for pull requests

8. TESTING + QA CHECKLIST

Signup and login:
- Email validation and error handling
- Password strength requirements (minimum 6 characters)
- Successful account creation and immediate login
- Session persistence and automatic logout
- Profile creation and display name management

Payment flow (test cards):
- Successful payment: 4242 4242 4242 4242
- Declined payment: 4000 0000 0000 0002
- Requires authentication: 4000 0025 0000 3155
- Checkout session creation and redirect
- Webhook processing and status updates
- Success page display and confirmation

Form validation (client and server):
- Required field validation
- Email format validation
- Phone number formatting (automatic +351 prefix)
- Business category and neighborhood selection
- Perk description minimum length requirements
- Image upload validation and error handling

Mobile UX:
- Responsive layout on all screen sizes
- Touch-friendly form elements
- Proper keyboard handling for inputs
- Modal and navigation behavior on mobile
- Image upload interface optimized for mobile

Upload logic:
- File type validation (images only)
- File size validation (5MB limit)
- Upload progress indication
- Error handling for failed uploads
- Image preview functionality
- Multiple image support (up to 3)

Redirects and CTAs:
- Form wizard navigation between steps
- Success page redirect after payment
- Back button functionality
- Directory browsing and filtering
- External link handling (WhatsApp, email, websites)

Webhook triggers:
- Stripe checkout completion events
- Payment success/failure processing
- Database status updates
- Error handling and retry logic

Analytics fire:
- Page view tracking (GA4 and Simple Analytics)
- Form completion events
- Payment success tracking
- Error event logging

Errors handled gracefully:
- Network connectivity issues
- API timeout handling
- Form validation errors
- Payment processing errors
- File upload failures
- Authentication errors

9. MONITORING + ANALYTICS

Platforms used:
- Google Analytics 4 (Measurement ID: G-FLJ2KM6R1Z)
- Simple Analytics (100% GDPR compliant, privacy-first)
- Netlify Analytics for deployment and performance metrics
- Supabase Dashboard for database and API monitoring

Key events tracked:
- Page views and user sessions
- Form completion rates by step
- Payment success/failure rates
- File upload success rates
- User registration and login events
- CTA click-through rates
- Error occurrences and types

Error monitoring tool:
- Browser console error logging
- Supabase function error logs
- Stripe webhook error notifications
- Netlify build and deployment error alerts

Metrics to monitor:
- Conversion rate (form start to payment completion)
- User journey through form steps (funnel analysis)
- Payment success rate and failure reasons
- Page load times and Core Web Vitals
- Mobile vs desktop usage patterns
- Geographic distribution of users
- Bounce rate and session duration

10. FUTURE ROADMAP

Planned features:
- Partner dashboard with performance analytics
- Multi-language support (Portuguese/English)
- Advanced perk management tools
- Customer relationship management features
- Automated partner onboarding workflows
- Mobile app for end customers
- Enhanced search and filtering
- Partner rating and review system

Known technical debt:
- Implement comprehensive error boundary components
- Add unit and integration test coverage
- Set up proper application logging and monitoring
- Implement client-side caching strategies
- Add offline support and PWA capabilities
- Optimize bundle size and lazy loading
- Implement proper error reporting system

Design/UX improvements queued:
- Enhanced mobile navigation
- Improved image upload interface
- Better form progress indication
- Advanced filtering and search UI
- Partner onboarding tutorial
- Customer testimonial integration
- Interactive perk preview

Refactor or modularization goals:
- Extract reusable form components
- Implement design system tokens
- Modularize business logic hooks
- Optimize database query patterns
- Implement proper state management
- Add comprehensive TypeScript coverage

AI or agent plans:
- Automated partner verification
- AI-powered perk optimization suggestions
- Intelligent customer matching
- Automated content generation
- Chatbot for partner support

11. FULL REPLICATION CHECKLIST

Node + dependencies installed:
- Node.js 18+ installed
- npm dependencies installed via package.json
- Verify build tools (Vite, TypeScript) working

Env variables configured:
- VITE_SUPABASE_URL set with project URL
- VITE_SUPABASE_ANON_KEY set with anonymous key
- VITE_STRIPE_PUBLISHABLE_KEY set with appropriate key (test/live)
- Environment variables added to deployment platform

Database provisioned and migrated:
- Supabase project created
- PostgreSQL database initialized
- All migration files executed in correct order
- Custom enum types created
- Tables created with proper structure
- Indexes created for performance

Auth and RLS policies in place:
- Supabase Auth configured
- Email confirmation disabled
- Site URL and redirect URLs configured
- RLS enabled on all tables
- User policies configured for data access
- Authentication flow tested

Webhooks registered:
- Stripe webhook endpoint created
- Webhook secret obtained and configured
- Edge function deployed for webhook handling
- Event types configured (checkout.session.completed, etc.)
- Webhook signature verification implemented

Storage buckets created:
- perk-assets bucket created in Supabase Storage
- Public access configured for read operations
- Upload policies configured for authenticated users
- File size and type restrictions set
- Folder structure organized

Edge functions deployed:
- stripe-checkout function deployed and tested
- stripe-webhook function deployed and tested
- CORS configuration verified
- Authentication handling verified
- Error handling and logging implemented

Domain configured:
- Custom domain registered and verified
- DNS records configured (CNAME to deployment)
- SSL/TLS certificate obtained and active
- Domain verification completed
- Redirect rules configured

Payments tested:
- Stripe test mode configured
- Test payment flows verified
- Webhook processing confirmed
- Database updates verified
- Success/failure scenarios tested

Analytics firing:
- Google Analytics 4 configured and tracking
- Simple Analytics implemented and tracking
- Page view events confirmed
- Custom events configured and tested
- Privacy compliance verified

Production-ready deployment verified:
- Build process successful
- All environment variables production-ready
- Security headers configured
- Performance optimization confirmed
- Error handling comprehensive
- Monitoring and alerting active

12. FILE STRUCTURE

src/components/: reusable React components
  auth/: authentication-related components (AuthModal, LoginForm, SignupForm)
  forms/: multi-step form components (BusinessForm, PerkForm, PaymentForm, SuccessScreen)
  ui/: reusable UI components (Button, Input, Select, Card, Alert, ProgressBar, FileUpload)
  Hero.tsx: landing page hero section
  PerksDirectory.tsx: public partner directory with filtering
  PricingSection.tsx: pricing and payment section
  Layout.tsx: main application layout wrapper
  Footer.tsx: site footer component
  FormWizard.tsx: multi-step form orchestration
  SuccessPage.tsx: payment success page
  Other utility components

src/hooks/: custom React hooks
  useAuth.ts: authentication state management
  useFormData.ts: form state and data management
  useSubscription.ts: payment and subscription status
  useUserProfile.ts: user profile management

src/lib/: API clients, validators, utilities
  supabase.ts: Supabase client configuration
  auth.ts: authentication functions
  stripe.ts: Stripe integration functions
  validations.ts: Zod schema validators
  profile.ts: user profile functions
  storage.ts: file upload functions
  submissions.ts: partner submission management

src/types/: TypeScript type definitions
  index.ts: application-wide type definitions

src/utils/: utility functions
  cn.ts: className utility for Tailwind
  constants.ts: application constants and configuration

public/: static assets, SEO files
  favicon files (180x180, 192x192, 512x512)
  robots.txt: SEO robots file
  sitemap.xml: SEO sitemap
  site.webmanifest: PWA manifest
  worktugal-logo-bg-light-radius-1000-1000.png: main logo
  _redirects: Netlify redirect configuration

supabase/functions/: edge logic
  stripe-checkout/: Stripe checkout session creation
  stripe-webhook/: Stripe webhook processing

supabase/migrations/: database setup
  Migration files in chronological order
  Enum types, table creation, RLS policies
  Indexes and performance optimizations

config/: Vite, PostCSS, Tailwind, etc
  vite.config.ts: Vite build configuration
  tailwind.config.js: Tailwind CSS configuration
  postcss.config.js: PostCSS configuration
  tsconfig.json: TypeScript configuration
  eslint.config.js: ESLint configuration
  netlify.toml: Netlify deployment configuration

13. TROUBLESHOOTING GUIDE

Supabase not connecting:
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Check network connectivity and firewall settings
- Ensure Supabase project is active and not paused
- Verify API keys have not been regenerated
- Check browser dev tools for CORS errors

Stripe payment not triggering:
- Confirm VITE_STRIPE_PUBLISHABLE_KEY matches test/live mode
- Verify Stripe webhook endpoint is reachable
- Check webhook secret matches environment variable
- Ensure product and price IDs are correct
- Test with Stripe test cards first
- Review Stripe dashboard for failed events

File upload not working:
- Verify user is authenticated before attempting upload
- Check Supabase storage bucket exists and is public
- Confirm file size is under 5MB limit
- Verify file type is supported (image/jpeg, image/png, image/webp)
- Check storage policies allow authenticated uploads
- Review browser network tab for upload errors

Mobile bugs:
- Test on multiple devices and browsers
- Check viewport meta tag is present
- Verify touch targets are adequately sized
- Test form submission on mobile keyboards
- Check modal and overlay behavior
- Verify responsive breakpoints work correctly

CI/CD errors:
- Check Node.js version matches deployment platform
- Verify all environment variables are set
- Ensure build command and publish directory are correct
- Check for TypeScript or ESLint errors
- Verify all dependencies are properly installed
- Review build logs for specific error messages

Build breaking:
- Clear node_modules and package-lock.json, reinstall
- Check for TypeScript errors in IDE
- Verify all imports are correct and files exist
- Check for circular dependencies
- Ensure all required environment variables are available during build
- Test build locally before deploying

Webhook not firing:
- Verify webhook URL is publicly accessible
- Check webhook secret is correctly configured
- Ensure edge function is deployed and working
- Test webhook endpoint with Stripe CLI
- Review Supabase function logs for errors
- Confirm webhook events are configured correctly

14. SUPPORT + CONTACT

Email: hello@worktugal.com
WhatsApp: +351 928 090 121
Website: https://worktugal.com
Social: @worktugal on Instagram
Business LinkedIn: https://www.linkedin.com/company/worktugal/
Telegram: https://t.me/worktugal

Technical Documentation: This README serves as primary technical documentation
Code Repository: Private repository with full source code
Deployment Platform: Netlify dashboard for deployment management
Database Management: Supabase dashboard for database operations
Payment Management: Stripe dashboard for payment processing

Internal Support Process:
1. Check this documentation first
2. Review error logs in respective dashboards
3. Test in development environment
4. Contact technical team via email if needed
5. Document any new issues or solutions in this README

Emergency Contacts:
For production issues affecting payments or user data, contact immediately via WhatsApp
For general support and feature requests, use email
For business inquiries and partnerships, use LinkedIn or main website contact form