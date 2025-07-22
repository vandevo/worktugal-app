# Worktugal Pass - Partner Portal

**Complete Documentation & Technical Guide**

---

## 📋 Project Overview

| **Field** | **Details** |
|-----------|-------------|
| **Project Name** | Worktugal Pass - Partner Portal |
| **Summary** | A production-ready, mobile-first B2B web application for Worktugal Pass — Lisbon's trusted perk marketplace for remote professionals and expats |
| **Target Audience** | Local businesses in Lisbon who want to attract remote workers, freelancers, and digital nomads |
| **Problem Solved** | Connects local businesses with quality remote professionals through a trusted marketplace, eliminating the need for businesses to find and market to remote workers individually |
| **Version** | v1.3.0 |
| **Live URL** | https://pass.worktugal.com |
| **Status** | ✅ Production |
| **Author** | Worktugal team |
| **Last Updated** | July 22, 2025 |

---

## 🎯 Core Functionality

### Input Flows
- **Multi-step business registration form** (Business Info → Perk Details → Payment → Success)
- **User authentication** (email/password signup and login)
- **File uploads** for business logos and perk images
- **Business categorization** and location selection
- **Perk redemption method** configuration
- **Tax information collection** (NIF) for Portuguese invoices

### Output Logic
- **Partner submissions** stored in database with status tracking
- **Payment processing** through Stripe with webhook confirmations
- **Email confirmations** and status updates
- **Public perk directory** with filtering and search
- **User profile management** and subscription status display

### CTA Logic
- **Primary CTA**: "List My Offer" button leads to form wizard
- **Secondary CTA**: "Browse Verified Perks" scrolls to directory
- **Form completion** leads to Stripe checkout
- **Payment success** redirects to success page with next steps
- **Directory perks** have action buttons for redemption (WhatsApp, email, website)

### Payment Flows
- **One-time payment**: €49 early access lifetime listing fee
- **Stripe Checkout** integration with webhook processing
- **Payment status tracking** and partner submission updates
- **Future subscription models** (infrastructure ready)

### Integrations
- **Supabase**: Database, authentication, storage, edge functions
- **Stripe**: Payment processing, customer management, webhooks
- **Make.com**: Advanced automation workflows for CRM integration and customer lifecycle management
- **Netlify**: Static site hosting and continuous deployment
- **Google Analytics 4**: User behavior tracking
- **Simple Analytics**: Privacy-first analytics
- **Cloudflare**: DNS management and CDN

---

## 🛠 Tech Stack & Architecture

### Frontend Framework
- **React 18** with TypeScript for full type safety
- **Vite** as build tool and development server
- **React Router DOM** for client-side routing
- **React Hook Form** with Zod validation for form management
- **Framer Motion** for animations and micro-interactions
- **Tailwind CSS** for utility-first styling
- **Lucide React** for icons

### Backend/Database
- **Supabase** as Backend-as-a-Service
- **PostgreSQL** database with Row Level Security (RLS)
- **Supabase Edge Functions** for serverless logic
- **Real-time subscriptions** for live data updates

### Authentication System
- **Supabase Auth** with email/password authentication
- **No email confirmation** required for faster onboarding
- **Row Level Security** policies for data protection
- **Session management** with automatic token refresh
- **Protected routes** and authentication guards

### Storage Logic
- **Supabase Storage** for file uploads
- **Public bucket** 'perk-assets' for images and logos
- **5MB file size limit** per upload
- **MIME type restrictions**: image/jpeg, image/png, image/webp
- **Folder organization**: business-logos/, perk-images/
- **Public read access**, authenticated write access

### Deployment
- **Netlify** static site hosting
- **Continuous deployment** from Git repository
- **Custom domain** with SSL/TLS termination
- **Serverless functions** via Supabase Edge Functions

### Build Toolchain
- **Vite** with React plugin
- **TypeScript** compilation
- **PostCSS** with Autoprefixer
- **Tailwind CSS** processing
- **Bundle optimization** with manual chunks
- **Tree shaking** and code splitting

---

## ⚙️ Infrastructure & Configuration

### Environment Variables

| **Variable** | **Description** |
|--------------|-----------------|
| `VITE_SUPABASE_URL` | Supabase project URL for database and API access |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key for client-side operations |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for payment processing |

### DNS & Domain Setup
- **Primary domain**: pass.worktugal.com
- **DNS managed** through Cloudflare
- **CNAME record** pointing to Netlify deployment
- **Automatic SSL/TLS** certificate via Netlify
- **Cloudflare proxy** enabled for performance and security

### Edge Functions
- **`stripe-checkout`**: Creates Stripe checkout sessions for payments
- **`stripe-webhook`**: Processes Stripe webhook events for payment status updates
- **Enhanced webhook system**: Automatically sends customer email data to Make.com for CRM automation
- **CORS handling**, authentication, and error handling

### Database Schema
- **PostgreSQL** with custom enum types for status management
- **Tables**: user_profiles, stripe_customers, stripe_subscriptions, stripe_orders, partner_submissions
- **Views**: stripe_user_subscriptions, stripe_user_orders, user_profiles_with_email
- **All migrations** applied and documented in supabase/migrations/
- **Advanced webhook triggers** for order processing and CRM integration
- **Row Level Security** enabled on all tables

### External Services Setup
1. **Supabase**: Project created, database configured, auth enabled, storage buckets created
2. **Stripe**: Account verified, products created, webhooks configured, test/live keys obtained
3. **Netlify**: Site deployed, custom domain configured, environment variables set
4. **Cloudflare**: DNS configured, proxy enabled, security settings applied
5. **Google Analytics**: Property created, tracking ID implemented
6. **Make.com**: Webhook scenarios configured for user signup and payment processing automation

---

## 🎨 UI & Design System

### Mobile-First Design
- ✅ **Responsive design** with breakpoints: xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ **Touch-friendly** interface elements
- ✅ **Optimized form layouts** for mobile devices

### CSS System: Tailwind CSS
- **Utility-first** approach with custom configuration
- **Consistent spacing** using 8px grid system
- **Custom color palette** extension
- **Component-based** styling patterns

### Typography
- **Font family**: Inter (system font stack fallback)
- **Hierarchy**: h1 (4xl-6xl), h2 (2xl-3xl), h3 (xl-2xl), body (base), small (sm-xs)
- **Line heights**: 150% for body text, 120% for headings
- **Maximum 3 font weights** used throughout

### Color System

| **Color** | **Primary** | **Secondary** |
|-----------|-------------|---------------|
| **Primary** | Blue (#3B82F6 to #1D4ED8) | - |
| **Secondary** | Purple (#8B5CF6 to #7C3AED) | - |
| **Success** | Green (#10B981 to #059669) | - |
| **Warning** | Orange (#F59E0B to #D97706) | - |
| **Error** | Red (#EF4444 to #DC2626) | - |
| **Neutral** | Gray scale (#F9FAFB to #111827) | - |
| **Background** | Dark theme (#111827 primary, #1F2937 secondary) | - |

### Spacing & Sizing
- **Base unit**: 8px
- **Common spacings**: 4px, 8px, 16px, 24px, 32px, 48px, 64px
- **Container max-widths**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Consistent padding** and margin patterns

### Animation Style
- **Framer Motion** powered micro-interactions
- **Subtle hover states** and transitions
- **Loading states** and form progression animations
- **Page transitions** and modal animations
- **Performance-optimized** with proper motion preferences

---

## 🔒 Security & Privacy

### Authentication Protection
- **Row Level Security (RLS)** enabled on all database tables
- **Users can only access** their own data through RLS policies
- **Authentication required** for form submissions and file uploads
- **Session-based authentication** with secure token handling

### File Upload Security
- **MIME types**: image/jpeg, image/png, image/webp only
- **File size limit**: 5MB per file
- **Maximum 3 perk images** per submission
- **Authenticated uploads** only, public read access
- **Automatic file validation** and error handling

### Payment Security
- **PCI compliance** through Stripe integration
- **No sensitive payment data** stored in application database
- **Webhook signature verification** for security
- **HTTPS-only webhook endpoints** in production
- **Stripe customer data** synchronized securely

### Data Protection
- **Environment variables** never committed to version control
- **Production keys** stored securely in deployment platform
- **Database connection strings** encrypted and managed by Supabase
- **User passwords** hashed and managed by Supabase Auth
- **Personal data** protected under RLS policies

### Backup Strategy
- **Supabase automatic** database backups (daily)
- **Git repository** serves as code backup
- **Environment variables** documented and stored securely
- **Database schema** versioned through migrations
- **Recovery procedures** documented

---

## 🚀 Deployment & Versioning

### Build Configuration
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18.x
- **Current deployment branch**: `main`
- **Status**: ✅ Production
- **Tag version**: v1.3.0

### Deployment Setup
- **Netlify** continuous deployment from Git
- **Environment variables** configured in Netlify dashboard
- **Custom domain** with SSL automatically provisioned
- **Deploy previews** enabled for pull requests

---

## ✅ Testing & QA Checklist

### Authentication Testing
- ✅ Email validation and error handling
- ✅ Password strength requirements (minimum 8 characters)
- ✅ Successful account creation and immediate login
- ✅ Session persistence and automatic logout
- ✅ Profile creation and display name management

### Payment Flow Testing
- ✅ **Successful payment**: 4242 4242 4242 4242
- ✅ **Declined payment**: 4000 0000 0000 0002
- ✅ **Requires authentication**: 4000 0025 0000 3155
- ✅ Checkout session creation and redirect
- ✅ Webhook processing and status updates
- ✅ Success page display and confirmation

### Form Validation
- ✅ Required field validation
- ✅ Email format validation
- ✅ Phone number formatting (automatic +351 prefix)
- ✅ Business category and neighborhood selection
- ✅ Perk description minimum length requirements
- ✅ Image upload validation and error handling

### Mobile UX
- ✅ Responsive layout on all screen sizes
- ✅ Touch-friendly form elements
- ✅ Proper keyboard handling for inputs
- ✅ Modal and navigation behavior on mobile
- ✅ Image upload interface optimized for mobile

### Upload Logic
- ✅ File type validation (images only)
- ✅ File size validation (5MB limit)
- ✅ Upload progress indication
- ✅ Error handling for failed uploads
- ✅ Image preview functionality
- ✅ Multiple image support (up to 3)

### Navigation & CTAs
- ✅ Form wizard navigation between steps
- ✅ Success page redirect after payment
- ✅ Back button functionality
- ✅ Directory browsing and filtering
- ✅ External link handling (WhatsApp, email, websites)

### Webhook Integration
- ✅ Stripe checkout completion events
- ✅ Payment success/failure processing
- ✅ **Enhanced order webhooks** with customer email data for CRM automation
- ✅ Database status updates
- ✅ Error handling and retry logic
- ✅ **Make.com integration** for automated customer lifecycle management

### Analytics
- ✅ Page view tracking (GA4 and Simple Analytics)
- ✅ Form completion events
- ✅ Payment success tracking
- ✅ Error event logging

### Error Handling
- ✅ Network connectivity issues
- ✅ API timeout handling
- ✅ Form validation errors
- ✅ Payment processing errors
- ✅ File upload failures
- ✅ Authentication errors

---

## 📊 Monitoring & Analytics

### Analytics Platforms
- **Google Analytics 4** (Measurement ID: G-FLJ2KM6R1Z)
- **Simple Analytics** (100% GDPR compliant, privacy-first)
- **Netlify Analytics** for deployment and performance metrics
- **Supabase Dashboard** for database and API monitoring

### Key Events Tracked
- Page views and user sessions
- Form completion rates by step
- Payment success/failure rates
- File upload success rates
- User registration and login events
- CTA click-through rates
- Error occurrences and types

### Error Monitoring
- Browser console error logging
- Supabase function error logs
- Stripe webhook error notifications
- Netlify build and deployment error alerts

### Key Metrics
- **Conversion rate** (form start to payment completion)
- **User journey** through form steps (funnel analysis)
- **Payment success rate** and failure reasons
- **Page load times** and Core Web Vitals
- **Mobile vs desktop** usage patterns
- **Geographic distribution** of users
- **Bounce rate** and session duration

---

## 🗂 File Structure

```
src/
├── components/           # Reusable React components
│   ├── auth/            # Authentication components
│   │   ├── AuthModal.tsx
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── forms/           # Multi-step form components
│   │   ├── BusinessForm.tsx
│   │   ├── PerkForm.tsx
│   │   ├── PaymentForm.tsx
│   │   └── SuccessScreen.tsx
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Alert.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── FileUpload.tsx
│   │   └── Turnstile.tsx
│   ├── Hero.tsx
│   ├── PerksDirectory.tsx
│   ├── PricingSection.tsx
│   ├── Layout.tsx
│   ├── Footer.tsx
│   ├── FormWizard.tsx
│   ├── SuccessPage.tsx
│   └── [Other components]
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useFormData.ts
│   ├── useSubscription.ts
│   └── useUserProfile.ts
├── lib/                 # API clients, validators, utilities
│   ├── supabase.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── validations.ts
│   ├── profile.ts
│   ├── storage.ts
│   └── submissions.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── cn.ts
│   └── constants.ts
└── stripe-config.ts     # Stripe product configuration

public/                  # Static assets, SEO files
├── favicon-*.png
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── worktugal-logo-*.png
└── _redirects

supabase/
├── functions/           # Edge functions
│   ├── stripe-checkout/
│   └── stripe-webhook/
└── migrations/          # Database migrations

config/                  # Build configuration
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── eslint.config.js
└── netlify.toml
```

---

## 🚧 Future Roadmap

### Planned Features
- **Partner dashboard** with performance analytics
- **Multi-language support** (Portuguese/English)
- **Enhanced CRM automation** workflows
- **Advanced perk management** tools
- **Customer relationship management** features
- **Automated partner onboarding** workflows
- **Mobile app** for end customers
- **Enhanced search and filtering**
- **Partner rating and review** system

### Technical Debt
- Implement comprehensive error boundary components
- Add unit and integration test coverage
- Optimize webhook delivery reliability and error handling
- Set up proper application logging and monitoring
- Implement client-side caching strategies
- Add offline support and PWA capabilities
- Optimize bundle size and lazy loading
- Implement proper error reporting system

### Design/UX Improvements
- Enhanced mobile navigation
- Improved image upload interface
- Better form progress indication
- Advanced filtering and search UI
- Partner onboarding tutorial
- Customer testimonial integration
- Interactive perk preview

### AI/Automation Plans
- **Automated partner verification**
- **AI-powered perk optimization** suggestions
- **Intelligent customer segmentation** via CRM data
- **Intelligent customer matching**
- **Automated content generation**
- **Chatbot for partner support**

---

## 🔧 Troubleshooting Guide

### Make.com Webhook Issues

#### ❌ **"Invalid JSON response. Received content-type: text/plain"**
**Solution**: In your Make.com scenario, add a "Webhook response" module as the final step:
- **Status**: `200`
- **Body**: `{"status": "ok"}`
- **Headers**: `Content-Type: application/json`

#### ❌ **Make.com webhook not receiving data**
- ✅ Verify webhook URL is correct in Supabase triggers
- ✅ Check Make.com scenario is active and properly configured
- ✅ Ensure webhook response returns proper JSON with Content-Type: application/json
- ✅ Review Supabase logs for webhook execution details
- ✅ Verify pg_net extension is enabled for advanced webhook functionality

### Supabase Connection Issues
- ✅ Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- ✅ Check network connectivity and firewall settings
- ✅ Ensure Supabase project is active and not paused
- ✅ Verify API keys have not been regenerated
- ✅ Check browser dev tools for CORS errors

### Stripe Payment Issues
- ✅ Confirm `VITE_STRIPE_PUBLISHABLE_KEY` matches test/live mode
- ✅ Verify Stripe webhook endpoint is reachable
- ✅ Check webhook secret matches environment variable
- ✅ Ensure product and price IDs are correct
- ✅ Test with Stripe test cards first
- ✅ Review Stripe dashboard for failed events

### File Upload Issues
- ✅ Verify user is authenticated before attempting upload
- ✅ Check Supabase storage bucket exists and is public
- ✅ Confirm file size is under 5MB limit
- ✅ Verify file type is supported (image/jpeg, image/png, image/webp)
- ✅ Check storage policies allow authenticated uploads
- ✅ Review browser network tab for upload errors

### Build/Deployment Issues
- ✅ Check Node.js version matches deployment platform
- ✅ Verify all environment variables are set
- ✅ Ensure build command and publish directory are correct
- ✅ Check for TypeScript or ESLint errors
- ✅ Verify all dependencies are properly installed
- ✅ Review build logs for specific error messages

---

## 🔄 Full Replication Checklist

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] npm dependencies installed via package.json
- [ ] Verify build tools (Vite, TypeScript) working

### 2. Environment Variables
- [ ] `VITE_SUPABASE_URL` set with project URL
- [ ] `VITE_SUPABASE_ANON_KEY` set with anonymous key
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` set with appropriate key (test/live)
- [ ] Environment variables added to deployment platform

### 3. Database Setup
- [ ] Supabase project created
- [ ] PostgreSQL database initialized
- [ ] All migration files executed in correct order
- [ ] Custom enum types created
- [ ] Tables created with proper structure
- [ ] Indexes created for performance
- [ ] **pg_net extension enabled** for advanced webhooks

### 4. Authentication & Security
- [ ] Supabase Auth configured
- [ ] Email confirmation disabled
- [ ] Site URL and redirect URLs configured
- [ ] RLS enabled on all tables
- [ ] User policies configured for data access
- [ ] Authentication flow tested

### 5. Webhook Configuration
- [ ] Stripe webhook endpoint created
- [ ] Webhook secret obtained and configured
- [ ] **Make.com webhooks configured** for user signup and payment automation
- [ ] Edge function deployed for webhook handling
- [ ] Event types configured (checkout.session.completed, etc.)
- [ ] Webhook signature verification implemented
- [ ] **Enhanced email data extraction** for CRM integration

### 6. Storage Setup
- [ ] perk-assets bucket created in Supabase Storage
- [ ] Public access configured for read operations
- [ ] Upload policies configured for authenticated users
- [ ] File size and type restrictions set
- [ ] Folder structure organized

### 7. Edge Functions
- [ ] stripe-checkout function deployed and tested
- [ ] stripe-webhook function deployed and tested
- [ ] CORS configuration verified
- [ ] Authentication handling verified
- [ ] Error handling and logging implemented

### 8. Domain & SSL
- [ ] Custom domain registered and verified
- [ ] DNS records configured (CNAME to deployment)
- [ ] SSL/TLS certificate obtained and active
- [ ] Domain verification completed
- [ ] Redirect rules configured

### 9. Payment Testing
- [ ] Stripe test mode configured
- [ ] Test payment flows verified
- [ ] **CRM webhook automation tested and verified**
- [ ] Webhook processing confirmed
- [ ] Database updates verified
- [ ] Success/failure scenarios tested

### 10. Analytics & Monitoring
- [ ] Google Analytics 4 configured and tracking
- [ ] Simple Analytics implemented and tracking
- [ ] Page view events confirmed
- [ ] Custom events configured and tested
- [ ] Privacy compliance verified

### 11. Production Deployment
- [ ] Build process successful
- [ ] All environment variables production-ready
- [ ] Security headers configured
- [ ] Performance optimization confirmed
- [ ] Error handling comprehensive
- [ ] Monitoring and alerting active

---

## 📞 Support & Contact

| **Channel** | **Details** |
|-------------|-------------|
| **Email** | hello@worktugal.com |
| **WhatsApp** | +351 928 090 121 |
| **Website** | https://worktugal.com |
| **Instagram** | @worktugal |
| **LinkedIn** | https://www.linkedin.com/company/worktugal/ |
| **Telegram** | https://t.me/worktugal |

### Internal Support Process
1. **Check this documentation first**
2. **Review error logs** in respective dashboards
3. **Test in development environment**
4. **Contact technical team** via email if needed
5. **Document any new issues** or solutions in this README

### Emergency Contacts
- **Production issues** affecting payments or user data → Contact immediately via WhatsApp
- **General support** and feature requests → Use email
- **Business inquiries** and partnerships → Use LinkedIn or main website contact form

---

**© 2025 Worktugal Pass. All rights reserved.**