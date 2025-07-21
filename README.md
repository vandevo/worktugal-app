# Worktugal Pass - Partner Portal 🚀

A production-ready, mobile-first B2B web application for Worktugal Pass — Lisbon's trusted perk marketplace for remote professionals and expats.

**🌐 Live Site:** [https://pass.worktugal.com](https://pass.worktugal.com)

## 🎯 Purpose

This self-serve partner portal allows local businesses to:
- Submit their business information and perk offers
- Pay a one-time listing fee (€49 early access)
- Appear in a live public directory
- Reach 1,000+ verified remote workers in Lisbon

## ✨ Key Features

### 🔐 Authentication & Security
- **Supabase Auth**: Email/password authentication with no email confirmation required
- **Row Level Security (RLS)**: Database-level security policies
- **Protected Routes**: Authentication-required sections
- **Session Management**: Automatic session handling and token refresh
- **Input Validation**: Zod schema validation on all forms
- **CSRF Protection**: Built-in protection through Supabase

### 💳 Payment Integration
- **Stripe Integration**: Full payment processing with webhooks
- **One-time Payments**: €49 early access listing fee
- **Subscription Support**: Ready for future recurring billing
- **Payment Status Tracking**: Real-time payment status updates
- **Secure Checkout**: PCI-compliant payment processing
- **Refund Support**: Backend webhook handling for refunds

### 📱 User Experience
- **Multi-step Form Wizard**: Intuitive business registration flow
- **Real-time Validation**: Instant feedback on form inputs
- **Loading States**: Smooth loading indicators throughout
- **Error Handling**: Comprehensive error messages and recovery
- **Success Flows**: Clear confirmation and next steps
- **Mobile-First Design**: Optimized for all screen sizes

### 🎨 Design System
- **Dark Mode**: Modern dark theme with blue/purple accents
- **Responsive Grid**: CSS Grid and Flexbox layouts
- **Animations**: Framer Motion powered micro-interactions
- **Typography**: Inter font family with proper hierarchy
- **Color System**: Consistent color palette with semantic colors
- **Spacing**: 8px grid system for consistent spacing

### 🏗️ Architecture
- **Component-Based**: Reusable React components
- **Custom Hooks**: Shared logic in custom hooks
- **Type Safety**: Full TypeScript coverage
- **State Management**: React hooks for local state
- **Form Management**: React Hook Form with Zod validation
- **Database**: Supabase PostgreSQL with RLS

## 🚀 Tech Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **React Router DOM** - Client-side routing
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Database-level security
- **Real-time subscriptions** - Live data updates
- **Edge Functions** - Serverless functions

### Payment & Integration
- **Stripe** - Payment processing
- **Webhook handling** - Automated payment updates
- **Customer management** - Stripe customer sync
- **Order tracking** - Payment history

### DevOps & Deployment
- **Netlify** - Static site hosting
- **Continuous Deployment** - Git-based deployments
- **Environment Variables** - Secure configuration
- **Performance Optimization** - Bundle optimization

### Analytics & Monitoring
- **Google Analytics 4** - User behavior tracking
- **Simple Analytics** - Privacy-first analytics (100% GDPR compliant)

## 🛠️ Complete Replication Guide

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Netlify account (or similar hosting)
- Cloudflare account (for DNS management)
- Google Analytics account

### Step 1: Repository Setup

```bash
# Clone or create new repository
git clone <repository-url>
cd worktugal-pass-portal

# Install exact dependencies
npm install

# Verify Node.js version
node --version  # Should be 18+
```

### Step 2: Supabase Project Setup

#### 2.1 Create New Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization
4. **Project Name**: `worktugal-pass-portal`
5. **Database Password**: Generate strong password (save securely)
6. **Region**: Choose closest to your users (we used EU West - Ireland)
7. Wait for project creation (2-3 minutes)

#### 2.2 Configure Authentication
1. Go to Authentication → Settings
2. **Site URL**: `https://pass.worktugal.com`
3. **Redirect URLs**: Add these URLs:
   ```
   https://pass.worktugal.com
   https://pass.worktugal.com/**
   http://localhost:5173
   http://localhost:5173/**
   ```
4. **Email Confirmation**: DISABLE (turn off)
5. **Email Templates**: Customize if needed
6. Save configuration

#### 2.3 Database Migrations
Run these SQL commands in Supabase SQL Editor (in exact order):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE stripe_subscription_status AS ENUM (
  'not_started',
  'incomplete', 
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused'
);

CREATE TYPE stripe_order_status AS ENUM (
  'pending',
  'completed', 
  'canceled'
);

CREATE TYPE submission_status AS ENUM (
  'pending_payment',
  'completed_payment',
  'abandoned',
  'approved',
  'rejected'
);

-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for user profiles
CREATE POLICY "Users can manage their own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create stripe_customers table
CREATE TABLE stripe_customers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX idx_stripe_customers_customer_id ON stripe_customers(customer_id);

-- Create policy
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Create stripe_subscriptions table
CREATE TABLE stripe_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  customer_id TEXT UNIQUE NOT NULL,
  subscription_id TEXT,
  price_id TEXT,
  current_period_start BIGINT,
  current_period_end BIGINT,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_method_brand TEXT,
  payment_method_last4 TEXT,
  status stripe_subscription_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_stripe_subscriptions_customer_id ON stripe_subscriptions(customer_id);

-- Create policy
CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id 
      FROM stripe_customers 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    ) AND deleted_at IS NULL
  );

-- Create stripe_orders table
CREATE TABLE stripe_orders (
  id BIGSERIAL PRIMARY KEY,
  checkout_session_id TEXT NOT NULL,
  payment_intent_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  amount_subtotal BIGINT NOT NULL,
  amount_total BIGINT NOT NULL,
  currency TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  status stripe_order_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_stripe_orders_customer_id ON stripe_orders(customer_id);

-- Create policy
CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id 
      FROM stripe_customers 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    ) AND deleted_at IS NULL
  );

-- Create partner_submissions table
CREATE TABLE partner_submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  business_website TEXT,
  business_instagram TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  business_category TEXT NOT NULL,
  business_neighborhood TEXT NOT NULL,
  perk_title TEXT NOT NULL,
  perk_description TEXT NOT NULL,
  perk_redemption_method TEXT NOT NULL,
  perk_redemption_details TEXT NOT NULL,
  perk_images TEXT[],
  perk_logo TEXT,
  perk_is_portuguese_owned BOOLEAN DEFAULT FALSE NOT NULL,
  perk_needs_nif BOOLEAN DEFAULT FALSE NOT NULL,
  status submission_status DEFAULT 'pending_payment' NOT NULL,
  stripe_order_id BIGINT REFERENCES stripe_orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE partner_submissions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_partner_submissions_user_id ON partner_submissions(user_id);
CREATE INDEX idx_partner_submissions_status ON partner_submissions(status);
CREATE INDEX idx_partner_submissions_created_at ON partner_submissions(created_at);

-- Create policy
CREATE POLICY "Users can manage their own partner submissions"
  ON partner_submissions
  FOR ALL
  TO public
  USING (auth.uid() = user_id);

-- Create views
CREATE VIEW stripe_user_subscriptions AS
SELECT 
  sc.customer_id,
  ss.subscription_id,
  ss.status as subscription_status,
  ss.price_id,
  ss.current_period_start,
  ss.current_period_end,
  ss.cancel_at_period_end,
  ss.payment_method_brand,
  ss.payment_method_last4
FROM stripe_customers sc
LEFT JOIN stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE sc.user_id = auth.uid() AND sc.deleted_at IS NULL AND ss.deleted_at IS NULL;

CREATE VIEW stripe_user_orders AS
SELECT 
  sc.customer_id,
  so.id as order_id,
  so.checkout_session_id,
  so.payment_intent_id,
  so.amount_subtotal,
  so.amount_total,
  so.currency,
  so.payment_status,
  so.status as order_status,
  so.created_at as order_date
FROM stripe_customers sc
LEFT JOIN stripe_orders so ON sc.customer_id = so.customer_id
WHERE sc.user_id = auth.uid() AND sc.deleted_at IS NULL AND so.deleted_at IS NULL;
```

#### 2.4 Setup Edge Functions

1. Create webhook function directory structure:
```bash
mkdir -p supabase/functions/stripe-webhook
mkdir -p supabase/functions/stripe-checkout
```

2. Copy the exact edge function code from the existing files:
   - `supabase/functions/stripe-webhook/index.ts`
   - `supabase/functions/stripe-checkout/index.ts`

#### 2.5 Configure Environment Variables in Supabase
Go to Settings → Environment Variables and add:
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Step 3: Stripe Configuration

#### 3.1 Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Create account or sign in
3. Switch to **Test Mode** during development

#### 3.2 Create Products and Prices
1. Go to Products → Add Product
2. **Product Details**:
   - **Name**: `Partner Listing Early Access (Lifetime)`
   - **Description**: `Join Lisbon's #1 Perk Marketplace. Get lifetime visibility to remote workers, expats, and digital nomads. This early access offer is limited to 25 local businesses only. No renewals, no hidden fees.`
   - **Image**: Upload business-related image
   
3. **Pricing**:
   - **Pricing Model**: One time
   - **Price**: €49.00
   - **Currency**: EUR
   - **Tax Behavior**: Exclusive (recommended for EU)

4. **Save the Price ID** (starts with `price_`) - you'll need this for `src/stripe-config.ts`

#### 3.3 Configure Webhooks
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://your-project.supabase.co/functions/v1/stripe-webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Save and copy the **Webhook Secret** (starts with `whsec_`)

#### 3.4 Update Stripe Configuration
Edit `src/stripe-config.ts` with your actual Stripe data:

```typescript
export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_YOUR_PRODUCT_ID', // From Stripe Dashboard
    priceId: 'price_YOUR_PRICE_ID', // From Stripe Dashboard  
    name: 'Partner Listing Early Access (Lifetime)',
    description: 'Join Lisbon\'s #1 Perk Marketplace. Get lifetime visibility to remote workers, expats, and digital nomads. This early access offer is limited to 25 local businesses only. No renewals, no hidden fees.',
    mode: 'payment',
    price: 49.00
  }
];
```

### Step 4: Environment Variables Setup

Create `.env` file with exact configuration:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-settings

# Stripe Configuration (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# For Production, use:
# VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
```

**Important**: 
- Get Supabase keys from: Project Settings → API
- Get Stripe keys from: Developers → API Keys
- **Never commit real keys to version control**

### Step 5: Domain and DNS Configuration

#### 5.1 Cloudflare DNS Setup
1. Log into Cloudflare dashboard
2. Go to your domain (`worktugal.com`)
3. Click "DNS" tab
4. Add DNS record:
   - **Type**: CNAME
   - **Name**: pass
   - **Target**: your-netlify-site.netlify.app
   - **Proxy Status**: Proxied (orange cloud)
   - **TTL**: Auto

#### 5.2 Netlify Custom Domain
1. Go to Netlify dashboard
2. Select your site
3. Go to Domain Settings
4. Add custom domain: `pass.worktugal.com`
5. Verify DNS configuration
6. Enable HTTPS (should be automatic with Cloudflare)

### Step 6: Google Analytics Setup

#### 6.1 Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com)
2. Create new property or use existing
3. **Property Name**: Worktugal Pass
4. **Reporting Time Zone**: Europe/Lisbon
5. **Currency**: Euro (EUR)

#### 6.2 Data Stream Configuration
1. Add new web data stream
2. **Website URL**: https://pass.worktugal.com
3. **Stream Name**: Worktugal Pass Portal
4. Copy the **Measurement ID** (format: G-XXXXXXXXXX)

#### 6.3 Enhanced Ecommerce (Optional)
Enable enhanced ecommerce for payment tracking:
1. Go to Admin → Property → Data Settings → Data Streams
2. Click your web stream
3. Enable "Enhanced Measurement"
4. Configure events: Page views, Scrolls, Outbound clicks, File downloads

### Step 7: Netlify Deployment Configuration

#### 7.1 Build Settings
```toml
# netlify.toml (create in root directory)
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false

[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### 7.2 Environment Variables in Netlify
1. Go to Site Settings → Environment Variables
2. Add all environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key (or pk_live_ for production)
   ```

#### 7.3 Deploy Settings
1. **Branch to deploy**: main
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`
4. **Node version**: 18.x

### Step 8: File Upload Configuration (Supabase Storage)

#### 8.1 Create Storage Buckets
1. Go to Supabase → Storage
2. Create new bucket: `perk-assets`
3. **Bucket Settings**:
   - **Public**: Yes
   - **File Size Limit**: 5MB
   - **Allowed MIME Types**: image/jpeg, image/png, image/webp

#### 8.2 Storage Policies
Run in SQL Editor:
```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'perk-assets');

-- Allow public access to read files
CREATE POLICY "Allow public access to read files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'perk-assets');

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'perk-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 9: Development and Testing

#### 9.1 Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The site will be available at http://localhost:5173
```

#### 9.2 Testing Checklist
- [ ] User registration and login
- [ ] Form validation (all steps)
- [ ] File uploads (images and logos)
- [ ] Stripe checkout flow (use test cards)
- [ ] Success page and redirects
- [ ] Email notifications (if configured)
- [ ] Analytics tracking
- [ ] Mobile responsiveness
- [ ] Error handling

#### 9.3 Stripe Test Cards
Use these for testing payments:
- **Successful Payment**: 4242 4242 4242 4242
- **Declined Payment**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Step 10: Production Deployment

#### 10.1 Switch to Production Mode
1. **Stripe**: Switch to Live Mode
2. **Update Environment Variables**:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-production-key
   ```
3. **Update Webhook URLs** to production Supabase URLs
4. **Test everything** with small real payments

#### 10.2 Go-Live Checklist
- [ ] All environment variables updated to production
- [ ] Stripe webhooks configured for production
- [ ] SSL certificate active
- [ ] Custom domain working
- [ ] Analytics tracking confirmed
- [ ] Error monitoring enabled
- [ ] Database backups configured
- [ ] Payment flow tested with real transactions

### Step 11: Monitoring and Maintenance

#### 11.1 Set Up Monitoring
1. **Supabase Dashboard**: Monitor database usage, API calls
2. **Stripe Dashboard**: Track payments, failed transactions
3. **Netlify Analytics**: Monitor site performance
4. **Google Analytics**: Track user behavior

#### 11.2 Regular Maintenance Tasks
- Monitor and optimize database queries
- Review and update security policies
- Check for dependency updates
- Monitor payment success/failure rates
- Review user feedback and analytics
- Backup database regularly

## 📁 Complete Project Structure

```
src/
├── components/              # React components
│   ├── auth/               # Authentication components
│   │   ├── AuthModal.tsx   # Login/signup modal
│   │   ├── LoginForm.tsx   # Login form
│   │   └── SignupForm.tsx  # Signup form
│   ├── forms/              # Form components
│   │   ├── BusinessForm.tsx # Business details form
│   │   ├── PerkForm.tsx    # Perk details form
│   │   ├── PaymentForm.tsx # Payment form
│   │   └── SuccessScreen.tsx # Success confirmation
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx      # Button component
│   │   ├── Input.tsx       # Input component
│   │   ├── Select.tsx      # Select component
│   │   ├── Card.tsx        # Card component
│   │   ├── Alert.tsx       # Alert component
│   │   ├── ProgressBar.tsx # Progress indicator
│   │   └── FileUpload.tsx  # File upload component
│   ├── FormWizard.tsx      # Multi-step form wizard
│   ├── Hero.tsx            # Landing page hero
│   ├── PerksDirectory.tsx  # Partner directory
│   ├── PricingSection.tsx  # Pricing and payment
│   ├── Layout.tsx          # App layout wrapper
│   ├── Footer.tsx          # Site footer
│   ├── SuccessPage.tsx     # Payment success page
│   ├── Seo.tsx             # SEO component
│   ├── ProfileModal.tsx    # User profile editing
│   ├── ProtectedRoute.tsx  # Route protection
│   └── UserSubscriptionStatus.tsx # Subscription status indicator
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── useFormData.ts      # Form state management
│   ├── useSubscription.ts  # Subscription status
│   └── useUserProfile.ts   # User profile management
├── lib/                    # External library configs
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # Authentication functions
│   ├── stripe.ts           # Stripe integration
│   ├── validations.ts      # Zod schemas
│   ├── profile.ts          # User profile functions
│   ├── storage.ts          # File upload functions
│   └── submissions.ts      # Submission management
├── types/                  # TypeScript definitions
│   └── index.ts            # Type definitions
├── utils/                  # Utility functions
│   ├── cn.ts               # Class name utility
│   └── constants.ts        # App constants
├── stripe-config.ts        # Stripe product config
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
└── index.css               # Global styles

supabase/
├── functions/              # Edge functions
│   ├── stripe-checkout/    # Checkout session creation
│   │   └── index.ts
│   └── stripe-webhook/     # Payment webhook handler
│       └── index.ts
└── migrations/             # Database migrations
    ├── 20250718183925_humble_crystal.sql
    ├── 20250718202132_gentle_temple.sql
    ├── 20250718233740_restless_haze.sql
    └── 20250719001210_shrill_villa.sql

public/
├── _redirects             # Netlify redirects
├── favicon-180x180.png    # App icons
├── favicon-192x192.png
├── favicon-512x512.png
├── robots.txt             # SEO robots file
├── sitemap.xml            # SEO sitemap
├── site.webmanifest       # PWA manifest
└── worktugal-logo-bg-light-radius-1000-1000.png # Logo

# Configuration files
├── .env                   # Environment variables (not in repo)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── netlify.toml          # Netlify configuration
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.app.json     # TypeScript app configuration
├── tsconfig.node.json    # TypeScript Node configuration
└── vite.config.ts        # Vite build configuration
```

## 🔧 Exact Configuration Files

### package.json Dependencies
```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.1.1",
    "@supabase/supabase-js": "^2.52.0",
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.6",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-helmet-async": "^2.0.5",
    "react-hook-form": "^7.60.0",
    "react-router-dom": "^7.7.0",
    "tailwind-merge": "^3.3.1",
    "zod": "^4.0.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          ui: ['framer-motion', 'lucide-react'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### Tailwind Configuration
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        gray: {
          750: '#374151',
        },
      },
    },
  },
  plugins: [],
};
```

## 🚨 Critical Security Notes

### Environment Variables
- **NEVER** commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly
- Store production keys securely (use Netlify/Vercel env vars)

### Database Security
- RLS (Row Level Security) is enabled on all tables
- Users can only access their own data
- All policies are properly configured
- Regular security audits recommended

### Payment Security
- All payment processing handled by Stripe (PCI compliant)
- No sensitive payment data stored in our database
- Webhook signatures verified for security
- Production webhooks use HTTPS only

## 📊 Analytics & Monitoring Setup

### Google Analytics 4
```html
<!-- Already configured in index.html -->
<!-- Measurement ID: G-FLJ2KM6R1Z -->
```

### Simple Analytics (Privacy-First)
```html
<!-- Already configured in index.html -->
<!-- 100% GDPR compliant -->
```

### Key Metrics to Monitor
- Conversion rate (form completion to payment)
- User journey through form steps
- Payment success/failure rates
- Page load times and performance
- Error rates and types

## 🔍 Troubleshooting Guide

### Common Issues and Solutions

#### 1. Supabase Connection Issues
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify in browser dev tools
console.log(import.meta.env.VITE_SUPABASE_URL)
```

#### 2. Stripe Payment Issues
- Verify webhook URL is accessible
- Check webhook secret matches environment variable
- Ensure test/live mode consistency
- Verify product and price IDs

#### 3. Authentication Issues
- Check Supabase auth settings
- Verify site URL and redirect URLs
- Ensure email confirmation is disabled
- Check RLS policies

#### 4. Build/Deployment Issues
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build

# Check for TypeScript errors
npm run lint
```

#### 5. File Upload Issues
- Verify Supabase storage bucket exists and is public
- Check storage policies allow authenticated uploads
- Ensure file size limits are appropriate
- Verify MIME type restrictions

## 🔄 Update and Maintenance Procedures

### Regular Updates
1. **Dependencies**: Update monthly
   ```bash
   npm update
   npm audit
   ```

2. **Database**: Backup before major changes
3. **Monitoring**: Check error rates weekly
4. **Performance**: Monitor Core Web Vitals

### Backup Procedures
1. **Database**: Supabase auto-backups enabled
2. **Code**: Git repository backups
3. **Environment Variables**: Securely documented
4. **Configuration**: All configs in version control

### Scaling Considerations
- Monitor Supabase usage limits
- Consider CDN for static assets
- Database query optimization
- Consider edge deployment for global users

## 📈 Future Enhancements

### Planned Features
- Partner dashboard with analytics
- Multi-language support (Portuguese/English)
- Advanced perk management
- Customer relationship management
- Automated partner onboarding
- Mobile app for customers

### Technical Debt
- Implement comprehensive error boundary
- Add unit and integration tests
- Set up proper logging and monitoring
- Implement cache strategies
- Add offline support (PWA)

---

## 📞 Support and Contacts

### Technical Support
- **Documentation**: This README
- **Codebase**: Fully commented and typed
- **Architecture**: Component-based, easy to extend

### Business Support
- **Email**: partners@worktugal.com
- **Phone**: +351 912 345 678

---

## 🎯 Project Status

- **Version**: 1.2.0
- **Status**: ✅ Live in Production
- **Last Updated**: July 21, 2025
- **Live URL**: https://pass.worktugal.com
- **Repository**: Fully documented and replicable

### Production Checklist ✅
- [x] Supabase production database configured
- [x] Stripe live payment processing active
- [x] Custom domain with SSL active
- [x] Analytics tracking implemented
- [x] Error monitoring enabled
- [x] Performance optimized
- [x] SEO fully configured
- [x] Security audit completed
- [x] Backup procedures established
- [x] Monitoring dashboards active

### Replication Checklist
Use this checklist when replicating the project:

- [ ] Prerequisites installed (Node.js 18+, accounts created)
- [ ] Repository cloned and dependencies installed
- [ ] Supabase project created and configured
- [ ] Database migrations executed in correct order
- [ ] Authentication settings configured
- [ ] Storage buckets and policies created
- [ ] Edge functions deployed
- [ ] Stripe account and products configured
- [ ] Webhooks configured and tested
- [ ] Environment variables set correctly
- [ ] Domain and DNS configured
- [ ] Google Analytics configured
- [ ] Netlify deployment configured
- [ ] All integrations tested
- [ ] Security review completed
- [ ] Performance optimization verified
- [ ] Go-live checklist completed

**🚀 This documentation ensures 100% project replicability. Follow each step precisely for identical results.**