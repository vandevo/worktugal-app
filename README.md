# Worktugal

**Last Updated:** 2025-10-29

---

## Project Overview

### Purpose
Worktugal is a digital platform connecting international remote workers with Portuguese service providers and perks. The platform facilitates relocation, integration, and lifestyle optimization for digital nomads, remote workers, and expats choosing Portugal as their base.

### Mission
Streamline the transition to Portugal by aggregating vetted partners, exclusive discounts, and essential services into a single subscription-based marketplace.

### Audience
- Primary: Remote workers, digital nomads, and expats relocating to Portugal
- Secondary: Portuguese service providers seeking international clientele
- Tertiary: Partner businesses offering perks and discounts

### Operator Contact
Contact details managed through Supabase profile system and displayed via authenticated dashboard.

### Key Features

- **Partner Directory**: Searchable catalog of vetted Portuguese service providers across multiple categories (legal, real estate, banking, healthcare, utilities, lifestyle)
- **Exclusive Perks System**: Members-only discounts and offers from partner businesses
- **Multi-Step Onboarding**: Progressive form wizard collecting user profiles, business information, and payment details
- **Stripe Integration**: Subscription payment processing with webhook-driven status updates
- **Authentication System**: Email/password authentication via Supabase Auth with profile management
- **File Upload**: Secure document storage for business logos and verification materials
- **Mobile-First Design**: Responsive interface optimized for all device sizes
- **Cookie Consent Management**: GDPR-compliant cookie banner with granular consent options
- **SEO Optimization**: Server-side rendering support, meta tags, sitemap, robots.txt
- **Success Dashboard**: Post-payment member area with profile access and perk browsing
- **Protected Routes**: Role-based access control for authenticated content
- **Email Notifications**: Automated confirmation and welcome sequences via Make.com
- **Form State Persistence**: Local storage backup preventing data loss during navigation
- **Progressive Disclosure**: Step-by-step information collection minimizing cognitive load
- **Real-time Validation**: Client-side form validation with immediate user feedback

---

## Tech Stack

### Frontend
- **React 18.3.1**: UI library with hooks and functional components
- **TypeScript 5.5.3**: Type-safe JavaScript superset
- **Vite 5.4.2**: Build tool and dev server
- **React Router DOM 7.7.0**: Client-side routing with protected routes
- **React Hook Form 7.60.0**: Form state management with validation
- **Zod 4.0.5**: Runtime type validation and schema definition
- **React Helmet Async 2.0.5**: Head management for SEO

### Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **PostCSS 8.4.35**: CSS processing with Autoprefixer
- **Framer Motion 12.23.6**: Animation library for transitions and micro-interactions
- **clsx 2.1.1**: Conditional className utility
- **tailwind-merge 3.3.1**: Merge Tailwind classes without conflicts

### Backend & Database
- **Supabase 2.52.0**: PostgreSQL database, authentication, storage, and real-time subscriptions
- **Supabase Edge Functions**: Serverless functions for Stripe webhook handling and checkout session creation
- **PostgreSQL**: Relational database with Row Level Security (RLS)

### Payment Processing
- **Stripe**: Subscription management, checkout sessions, webhook events

### Icons & Assets
- **Lucide React 0.344.0**: Icon library for UI components
- **Custom Logo**: Worktugal branding assets in `/public`

### Build & Development Tools
- **ESLint 9.9.1**: Linting with TypeScript support
- **TypeScript ESLint 8.3.0**: TypeScript-specific linting rules
- **Vite Plugin React 4.3.1**: Fast Refresh and JSX support

### Deployment & Hosting
- **Netlify**: CDN, continuous deployment, serverless functions, form handling
- **Supabase Cloud**: Managed PostgreSQL, Auth, Storage, Edge Functions

### Analytics & Monitoring
- **Google Analytics 4**: User behavior tracking (configured via cookie consent)
- **Supabase Dashboard**: Database monitoring, query performance
- **Netlify Analytics**: Traffic and deployment metrics

### Automation
- **Make.com**: Webhook orchestration for email notifications and partner updates
- **Supabase Webhooks**: Database triggers for real-time partner notifications

---

## Project Structure

```
/tmp/cc-agent/52752575/project/
├── .bolt/                          # Bolt.new configuration and metadata
│   ├── config.json                 # Bolt environment settings
│   ├── prompt                      # Original project prompt
│   └── supabase_discarded_migrations/  # Old migration files (archived)
├── public/                         # Static assets served directly
│   ├── _redirects                  # Netlify redirect rules
│   ├── favicon-180x180.png         # iOS home screen icon
│   ├── favicon-192x192.png         # Android home screen icon
│   ├── favicon-512x512.png         # High-res app icon
│   ├── index.html                  # Fallback HTML (unused with Vite)
│   ├── robots.txt                  # Search engine crawler instructions
│   ├── site.webmanifest            # PWA manifest file
│   ├── sitemap.xml                 # SEO sitemap
│   └── worktugal-logo-bg-light-radius-1000-1000.png  # Primary logo
├── scripts/                        # Database population utilities
│   ├── populate-partners.js        # Initial partner data seeding
│   ├── populate-partners-fixed.js  # Corrected partner seeding script
│   └── update-secondhome-contact.js  # Partner contact data update
├── src/                            # Application source code
│   ├── components/                 # React components
│   │   ├── auth/                   # Authentication UI
│   │   │   ├── AuthModal.tsx       # Modal container for login/signup
│   │   │   ├── LoginForm.tsx       # Email/password login form
│   │   │   ├── ResetPasswordForm.tsx  # Password reset flow
│   │   │   └── SignupForm.tsx      # User registration form
│   │   ├── forms/                  # Multi-step form wizard
│   │   │   ├── BusinessForm.tsx    # Business profile collection
│   │   │   ├── PaymentForm.tsx     # Stripe checkout integration
│   │   │   ├── PerkForm.tsx        # User profile and preferences
│   │   │   └── SuccessScreen.tsx   # Form completion confirmation
│   │   ├── ui/                     # Reusable UI primitives
│   │   │   ├── Alert.tsx           # Error/success message component
│   │   │   ├── Button.tsx          # Styled button with variants
│   │   │   ├── Card.tsx            # Container component
│   │   │   ├── FileUpload.tsx      # Drag-drop file input
│   │   │   ├── Input.tsx           # Text input with label
│   │   │   ├── ProgressBar.tsx     # Form step indicator
│   │   │   └── Select.tsx          # Dropdown select input
│   │   ├── CookieConsentBanner.tsx # GDPR cookie consent UI
│   │   ├── Footer.tsx              # Site footer with links
│   │   ├── FormWizard.tsx          # Multi-step form orchestrator
│   │   ├── Hero.tsx                # Landing page hero section
│   │   ├── Layout.tsx              # Page wrapper with header/footer
│   │   ├── PerksDirectory.tsx      # Partner catalog display
│   │   ├── PricingSection.tsx      # Subscription pricing cards
│   │   ├── PrivacyPolicy.tsx       # Privacy policy content
│   │   ├── ProfileModal.tsx        # User profile editor
│   │   ├── ProtectedRoute.tsx      # Auth-required route wrapper
│   │   ├── ProtectedSuccessRoute.tsx  # Post-payment route guard
│   │   ├── Seo.tsx                 # Meta tags and structured data
│   │   ├── SuccessPage.tsx         # Post-checkout member dashboard
│   │   ├── TermsAndConditions.tsx  # Terms of service content
│   │   └── UserRoleBadge.tsx       # Role display component
│   ├── contexts/                   # React context providers
│   │   └── CookieConsentContext.tsx  # Cookie preferences state
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts              # Authentication state hook
│   │   ├── useFormData.ts          # Form persistence hook
│   │   ├── useSubscription.ts      # Stripe subscription status hook
│   │   └── useUserProfile.ts       # User profile data hook
│   ├── lib/                        # Core business logic
│   │   ├── auth.ts                 # Supabase Auth wrapper functions
│   │   ├── profile.ts              # User profile CRUD operations
│   │   ├── storage.ts              # Supabase Storage file handling
│   │   ├── stripe.ts               # Stripe API client functions
│   │   ├── submissions.ts          # Form submission handling
│   │   ├── supabase.ts             # Supabase client initialization
│   │   └── validations.ts          # Zod validation schemas
│   ├── types/                      # TypeScript type definitions
│   │   ├── cookie.ts               # Cookie consent types
│   │   └── index.ts                # Global type definitions
│   ├── utils/                      # Utility functions
│   │   ├── cn.ts                   # Tailwind className merger
│   │   ├── constants.ts            # App-wide constants
│   │   └── cookieConstants.ts      # Cookie configuration values
│   ├── App.tsx                     # Root component with routing
│   ├── index.css                   # Global styles and Tailwind imports
│   ├── main.tsx                    # Application entry point
│   ├── stripe-config.ts            # Stripe public key configuration
│   └── vite-env.d.ts               # Vite environment type declarations
├── supabase/                       # Supabase configuration
│   ├── functions/                  # Edge Functions (serverless)
│   │   ├── stripe-checkout/        # Create Stripe checkout session
│   │   │   └── index.ts
│   │   └── stripe-webhook/         # Handle Stripe webhook events
│   │       └── index.ts
│   └── migrations/                 # Database schema versions
│       ├── 20250718183925_humble_crystal.sql
│       ├── 20250718202132_gentle_temple.sql
│       ├── 20250718233740_restless_haze.sql
│       ├── 20250719001210_shrill_villa.sql
│       ├── 20250720230734_gentle_snow.sql
│       ├── 20250720233732_flat_rice.sql
│       ├── 20250721001603_billowing_darkness.sql
│       ├── 20250721213608_morning_dawn.sql
│       ├── 20250721234013_bronze_reef.sql
│       ├── 20250721235758_damp_glitter.sql
│       ├── 20250722000703_floral_summit.sql
│       ├── 20250722002829_maroon_desert.sql
│       ├── 20250722003126_orange_flame.sql
│       ├── 20250722003132_purple_lake.sql
│       ├── 20250722003144_damp_villa.sql
│       ├── 20250722004231_small_limit.sql
│       ├── 20250722004940_young_sun.sql
│       ├── 20250722005501_odd_block.sql
│       ├── 20250722010102_wandering_shore.sql
│       ├── 20250722010150_rapid_silence.sql
│       ├── 20250722111444_fragrant_flower.sql
│       ├── 20250722132606_delicate_bird.sql
│       ├── 20250827131232_late_sun.sql
│       ├── 20250827131430_wispy_tooth.sql
│       └── 20250827131830_green_river.sql
├── .env                            # Environment variables (local)
├── .env.example                    # Environment variable template
├── .gitignore                      # Git exclusion rules
├── .npmrc                          # npm configuration
├── eslint.config.js                # ESLint configuration
├── index.html                      # Vite HTML template
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Dependency lock file
├── postcss.config.js               # PostCSS plugin configuration
├── README.md                       # Project documentation (this file)
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript base configuration
├── tsconfig.app.json               # App-specific TypeScript config
├── tsconfig.node.json              # Node/build TypeScript config
└── vite.config.ts                  # Vite build configuration
```

---

## Development Setup

### Prerequisites

- **Node.js**: 18.x or higher (LTS recommended)
- **npm**: 9.x or higher (included with Node.js)
- **Supabase Account**: Free tier sufficient for development
- **Stripe Account**: Test mode keys for payment integration
- **Make.com Account**: Free tier for webhook automation
- **Git**: Version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in all required values (see section below)

4. **Initialize Supabase**
   - Create new Supabase project at https://supabase.com
   - Copy project URL and anon key to `.env`
   - Run migrations (automatically applied via Supabase Dashboard or CLI)

5. **Configure Stripe**
   - Create Stripe account at https://stripe.com
   - Enable test mode
   - Copy publishable key and secret key to `.env`
   - Set up webhook endpoint pointing to Supabase Edge Function

6. **Start development server**
   ```bash
   npm run dev
   ```
   - Application runs at `http://localhost:5173`
   - Hot module replacement enabled

7. **Build for production**
   ```bash
   npm run build
   ```
   - Output in `dist/` directory
   - Ready for Netlify deployment

### Example `.env` File

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (server-side only, never expose in frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product/Price IDs (from Stripe Dashboard)
VITE_STRIPE_PRICE_ID=price_1234567890

# Application URLs
VITE_APP_URL=http://localhost:5173
VITE_SUCCESS_URL=http://localhost:5173/success
VITE_CANCEL_URL=http://localhost:5173

# Make.com Webhook URLs (create scenarios first)
MAKE_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
MAKE_PARTNER_WEBHOOK_URL=https://hook.eu1.make.com/your-partner-webhook-id

# Analytics (optional for development)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_DEBUG=true
```

**Important Notes:**
- All `VITE_` prefixed variables are exposed to the frontend
- Never commit `.env` file to version control
- Use Netlify environment variables for production deployment
- Stripe webhook secret obtained after creating webhook endpoint
- Make.com webhook URLs created in Make.com scenario settings

---

## Build & Deployment

### Build Commands

**Development:**
```bash
npm run dev          # Start Vite dev server on port 5173
npm run lint         # Run ESLint on all source files
```

**Production:**
```bash
npm run build        # TypeScript compile + Vite build to dist/
npm run preview      # Preview production build locally
```

**Utilities:**
```bash
npm run build:sitemap  # Placeholder (sitemap exists in public/)
```

### Netlify Deployment Configuration

**Build Settings:**
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Functions Directory:** (Not used, Supabase Edge Functions handle serverless)
- **Node Version:** 18.x (set via `.nvmrc` or environment variable)

**Environment Variables (Netlify Dashboard):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51...
VITE_STRIPE_PRICE_ID=price_1234567890
VITE_APP_URL=https://worktugal.com
VITE_SUCCESS_URL=https://worktugal.com/success
VITE_CANCEL_URL=https://worktugal.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Redirects Configuration (`public/_redirects`):**
```
# SPA fallback for client-side routing
/*    /index.html   200

# Redirect www to non-www
https://www.worktugal.com/*  https://worktugal.com/:splat  301!

# Force HTTPS
http://worktugal.com/*  https://worktugal.com/:splat  301!
```

**Headers Configuration (Netlify `netlify.toml` or Dashboard):**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.png"
  [headers.values]
    Cache-Control = "public, max-age=2592000"

[[headers]]
  for = "/*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=2592000"
```

**Custom Domains:**
- Primary: `worktugal.com`
- Alias: `www.worktugal.com` (redirects to primary)
- SSL: Automatic via Let's Encrypt (managed by Netlify)

**Deploy Contexts:**
- **Production:** `main` branch auto-deploys
- **Preview:** Pull request deploy previews enabled
- **Branch Deploys:** Optional feature branches

**Post-Deploy Hooks:**
- Supabase Edge Functions deployed separately via Supabase CLI or MCP tool
- Stripe webhooks configured to point to production Edge Function URLs

---

## Database Schema

### Tables Overview

1. **profiles**: User account information and preferences
2. **partners**: Service provider directory entries
3. **submissions**: Form wizard data collection
4. **subscriptions**: Stripe subscription status tracking

---

### `profiles` Table

**Purpose:** Stores extended user profile data linked to Supabase Auth users.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key, matches `auth.users.id` |
| `email` | `text` | NO | - | User email (synced from auth.users) |
| `full_name` | `text` | YES | `NULL` | User's full name |
| `company_name` | `text` | YES | `NULL` | Business name if applicable |
| `role` | `text` | YES | `'member'` | User role: `member`, `partner`, `admin` |
| `subscription_status` | `text` | YES | `'inactive'` | Stripe status: `active`, `inactive`, `trialing`, `past_due` |
| `stripe_customer_id` | `text` | YES | `NULL` | Stripe customer identifier |
| `stripe_subscription_id` | `text` | YES | `NULL` | Stripe subscription identifier |
| `created_at` | `timestamptz` | NO | `now()` | Account creation timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Last profile update timestamp |

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Index on `stripe_customer_id` for fast Stripe lookups
- Index on `subscription_status` for filtering active members

**Row Level Security Policies:**
- **SELECT:** Users can view their own profile only (`auth.uid() = id`)
- **INSERT:** Users can create their own profile during signup (`auth.uid() = id`)
- **UPDATE:** Users can update their own profile (`auth.uid() = id`)
- **DELETE:** No policy (admin-only via service role)

---

### `partners` Table

**Purpose:** Directory of vetted service providers offering perks to members.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `name` | `text` | NO | - | Business name |
| `category` | `text` | NO | - | Service category (legal, real estate, banking, healthcare, utilities, lifestyle, coworking, education, transportation, entertainment) |
| `description` | `text` | YES | `NULL` | Business description and services offered |
| `perk_description` | `text` | YES | `NULL` | Exclusive offer for Worktugal members |
| `discount_amount` | `text` | YES | `NULL` | Discount percentage or fixed amount |
| `logo_url` | `text` | YES | `NULL` | URL to partner logo image |
| `website_url` | `text` | YES | `NULL` | Partner website link |
| `contact_email` | `text` | YES | `NULL` | Partner contact email |
| `contact_phone` | `text` | YES | `NULL` | Partner phone number |
| `location` | `text` | YES | `NULL` | Physical location or service area |
| `featured` | `boolean` | NO | `false` | Highlight partner in directory |
| `active` | `boolean` | NO | `true` | Partner visibility toggle |
| `created_at` | `timestamptz` | NO | `now()` | Partner added timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Index on `category` for filtering
- Index on `featured` for homepage display
- Index on `active` for public listings

**Row Level Security Policies:**
- **SELECT:** Public access to active partners only (`active = true`)
- **INSERT:** Authenticated users with partner role can add entries (`auth.jwt()->>'role' = 'partner'`)
- **UPDATE:** Partners can update their own entries
- **DELETE:** Admin-only via service role

---

### `submissions` Table

**Purpose:** Stores form wizard responses before and after payment completion.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | YES | `NULL` | Foreign key to `auth.users.id` (nullable for anonymous submissions) |
| `email` | `text` | NO | - | Submitter email |
| `full_name` | `text` | YES | `NULL` | From PerkForm step |
| `company_name` | `text` | YES | `NULL` | From BusinessForm step |
| `company_website` | `text` | YES | `NULL` | From BusinessForm step |
| `industry` | `text` | YES | `NULL` | Industry selection |
| `company_size` | `text` | YES | `NULL` | Employee count range |
| `logo_url` | `text` | YES | `NULL` | Uploaded logo file URL |
| `interests` | `jsonb` | YES | `'[]'::jsonb` | Array of selected interest categories |
| `status` | `text` | NO | `'pending'` | Submission status: `pending`, `completed`, `paid`, `abandoned` |
| `stripe_session_id` | `text` | YES | `NULL` | Stripe checkout session ID |
| `created_at` | `timestamptz` | NO | `now()` | Submission start timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Last update timestamp |
| `completed_at` | `timestamptz` | YES | `NULL` | Payment completion timestamp |

**Indexes:**
- Primary key on `id`
- Foreign key index on `user_id`
- Index on `status` for filtering incomplete submissions
- Index on `email` for duplicate detection
- Index on `stripe_session_id` for webhook lookups

**Row Level Security Policies:**
- **SELECT:** Users can view their own submissions (`auth.uid() = user_id`)
- **INSERT:** Authenticated users can create submissions (`auth.uid() = user_id`)
- **UPDATE:** Users can update their own submissions (`auth.uid() = user_id`)
- **DELETE:** No policy (admin-only)

---

### `subscriptions` Table

**Purpose:** Tracks Stripe subscription lifecycle events and status changes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | NO | - | Foreign key to `auth.users.id` |
| `stripe_subscription_id` | `text` | NO | - | Stripe subscription ID |
| `stripe_customer_id` | `text` | NO | - | Stripe customer ID |
| `stripe_price_id` | `text` | YES | `NULL` | Stripe price ID |
| `status` | `text` | NO | `'active'` | Subscription status: `active`, `canceled`, `past_due`, `trialing`, `incomplete` |
| `current_period_start` | `timestamptz` | YES | `NULL` | Billing period start |
| `current_period_end` | `timestamptz` | YES | `NULL` | Billing period end |
| `cancel_at_period_end` | `boolean` | NO | `false` | User requested cancellation |
| `canceled_at` | `timestamptz` | YES | `NULL` | Cancellation timestamp |
| `created_at` | `timestamptz` | NO | `now()` | Subscription creation timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Last webhook update timestamp |

**Indexes:**
- Primary key on `id`
- Unique index on `stripe_subscription_id`
- Foreign key index on `user_id`
- Index on `stripe_customer_id` for webhook processing
- Index on `status` for active subscription queries

**Row Level Security Policies:**
- **SELECT:** Users can view their own subscriptions (`auth.uid() = user_id`)
- **INSERT:** Service role only (created via webhook)
- **UPDATE:** Service role only (updated via webhook)
- **DELETE:** No policy (admin-only)

---

## Form Structure & Logic

### Multi-Step Wizard Architecture

The form wizard consists of three primary steps with progressive disclosure:

1. **Step 1: Perk Selection** (`PerkForm.tsx`)
2. **Step 2: Business Information** (`BusinessForm.tsx`)
3. **Step 3: Payment** (`PaymentForm.tsx`)
4. **Step 4: Success** (`SuccessScreen.tsx`)

### Step 1: Perk Selection

**Purpose:** Collect user profile and interest categories.

**Fields:**

| Field | Label | Type | Validation | Placeholder | Required |
|-------|-------|------|------------|-------------|----------|
| `fullName` | Full Name | Text input | Min 2 chars | John Doe | Yes |
| `email` | Email Address | Email input | Valid email format | you@example.com | Yes |
| `interests` | Categories of Interest | Checkbox group | At least 1 selected | - | Yes |

**Interest Categories:**
- Legal Services
- Real Estate
- Banking & Finance
- Healthcare
- Utilities & Internet
- Lifestyle & Entertainment
- Coworking Spaces
- Education & Language
- Transportation
- Home Services

**Behavior:**
- Email pre-filled if user authenticated
- Form data persisted to localStorage on change
- Email uniqueness checked against existing submissions
- Submit button enabled only when validation passes

**Error Handling:**
- Duplicate email: "This email has already been registered"
- Network error: "Unable to connect. Please check your internet."
- Validation errors displayed inline below fields

---

### Step 2: Business Information

**Purpose:** Collect company details and branding.

**Fields:**

| Field | Label | Type | Validation | Placeholder | Required |
|-------|-------|------|------------|-------------|----------|
| `companyName` | Company Name | Text input | Min 2 chars | Acme Inc. | Yes |
| `companyWebsite` | Website | URL input | Valid URL | https://example.com | No |
| `industry` | Industry | Dropdown select | Must select option | Select industry | Yes |
| `companySize` | Company Size | Dropdown select | Must select option | Select size | Yes |
| `logo` | Company Logo | File upload | PNG/JPG, max 2MB | - | No |

**Industry Options:**
- Technology
- Finance
- Healthcare
- Education
- Retail
- Real Estate
- Consulting
- Marketing
- Manufacturing
- Other

**Company Size Options:**
- 1-10 employees
- 11-50 employees
- 51-200 employees
- 201-500 employees
- 501+ employees
- Solo entrepreneur

**Logo Upload Behavior:**
- Drag-and-drop or click to select
- Preview thumbnail displayed after selection
- File validation: PNG, JPG, JPEG only
- Size limit: 2MB maximum
- Upload to Supabase Storage on form submit
- Error states: "File too large" or "Invalid file type"

**Special Handling:**
- Website URL automatically prefixed with `https://` if missing protocol
- Industry and size selections stored as string values
- Form data synced to localStorage on change

---

### Step 3: Payment

**Purpose:** Initiate Stripe Checkout and process subscription.

**Fields:**
- Pricing display (monthly/annual toggle)
- Terms and conditions checkbox
- Privacy policy checkbox
- CTA button: "Subscribe Now"

**Pricing Display:**
- Monthly: EUR 29/month (or configured price)
- Annual: EUR 290/year (save 17%, or configured discount)
- Price fetched from Stripe via environment variable

**Validation Requirements:**
- Both checkboxes must be checked to enable payment button
- All previous form steps must be completed

**Payment Flow:**
1. User clicks "Subscribe Now"
2. Frontend calls Supabase Edge Function `stripe-checkout`
3. Edge Function creates Stripe Checkout Session with:
   - `customer_email` from form data
   - `success_url` pointing to `/success?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url` pointing to form step 3
   - `metadata` containing `user_id`, `submission_id`
4. Frontend redirects user to Stripe-hosted checkout
5. User completes payment on Stripe
6. Stripe redirects to success URL

**Error Handling:**
- Stripe API error: "Payment processing unavailable. Please try again."
- Network error: "Connection lost. Please refresh and try again."
- Session creation failure: Display error message from Edge Function

---

### Step 4: Success

**Purpose:** Confirm payment and provide next steps.

**Display Elements:**
- Success message with checkmark icon
- User's name and email
- Subscription details (plan, billing cycle)
- Access to member dashboard button
- Email confirmation notice

**Data Displayed:**
- Pulled from `profiles` table via `user_id`
- Subscription status verified via `subscriptions` table
- Shows "Processing" state if webhook not yet received

**Protected Route:**
- Route guarded by `ProtectedSuccessRoute.tsx`
- Checks for valid `session_id` query parameter
- Verifies Stripe session via Edge Function
- Redirects to home if unauthorized

---

### Status Flow

**Submission Status Lifecycle:**
1. `pending`: User started form, not completed
2. `completed`: All form steps filled, payment not initiated
3. `paid`: Stripe payment successful, webhook received
4. `abandoned`: User left form incomplete for 24+ hours

**Subscription Status Lifecycle:**
1. `incomplete`: Checkout session created, payment pending
2. `active`: Payment successful, subscription active
3. `trialing`: Free trial period (if configured)
4. `past_due`: Payment failed, retry in progress
5. `canceled`: User or admin canceled subscription

**Webhook-Driven Updates:**
- `checkout.session.completed`: Create subscription record, update submission to `paid`
- `customer.subscription.updated`: Update subscription status and period dates
- `customer.subscription.deleted`: Set subscription status to `canceled`
- `invoice.payment_failed`: Set subscription status to `past_due`

---

## Data Flow & Architecture

### Intake Flow

**Step-by-Step User Journey:**

1. **Landing Page**
   - User visits homepage
   - Sees hero section, pricing, partner directory preview
   - Clicks "Get Started" or "Subscribe Now"

2. **Form Wizard Initialization**
   - FormWizard component mounts
   - Checks localStorage for existing `formData`
   - If found, restores previous progress
   - If authenticated, pre-fills email from `auth.user`

3. **Step 1: Perk Selection**
   - User fills name, email, interests
   - On blur, data saved to localStorage
   - On submit, data sent to Supabase `submissions` table
   - Row created with `status = 'pending'`
   - Progress bar advances to Step 2

4. **Step 2: Business Information**
   - User fills company details
   - Logo file selected (not uploaded yet)
   - On submit:
     - Logo uploaded to Supabase Storage bucket `logos/`
     - Public URL stored in submission record
     - Submission updated with business fields
     - Progress bar advances to Step 3

5. **Step 3: Payment Initiation**
   - User clicks "Subscribe Now"
   - Frontend calls Edge Function `stripe-checkout` with:
     ```json
     {
       "email": "user@example.com",
       "fullName": "John Doe",
       "submissionId": "uuid-here",
       "priceId": "price_xxx"
     }
     ```
   - Edge Function creates Stripe Checkout Session
   - User redirected to Stripe-hosted checkout page

6. **Stripe Checkout**
   - User enters payment details on Stripe
   - Stripe validates card
   - On success, Stripe fires webhook `checkout.session.completed`
   - Stripe redirects user to `success_url`

7. **Webhook Processing**
   - Stripe webhook received by Edge Function `stripe-webhook`
   - Webhook signature verified using `STRIPE_WEBHOOK_SECRET`
   - Event type checked: `checkout.session.completed`
   - Extracts `customer_id`, `subscription_id`, `metadata`
   - Updates Supabase:
     - `submissions` table: `status = 'paid'`, `completed_at = now()`
     - `subscriptions` table: New row created with subscription details
     - `profiles` table: `subscription_status = 'active'`, Stripe IDs saved
   - Triggers Make.com webhook with submission data

8. **Make.com Automation**
   - Webhook received in Make.com scenario
   - Sends welcome email to user via email service (e.g., Gmail, SendGrid)
   - Notifies partner businesses in user's selected categories
   - Logs submission to internal tracking sheet (optional)

9. **Success Page Display**
   - User lands on `/success?session_id=xxx`
   - `ProtectedSuccessRoute` verifies session with Stripe
   - `SuccessPage` fetches user profile and subscription from Supabase
   - Displays confirmation message
   - Shows "Go to Dashboard" button linking to `/dashboard`

10. **Member Dashboard**
    - User accesses protected dashboard route
    - `ProtectedRoute` verifies authentication and subscription status
    - Dashboard displays:
      - User profile with edit modal
      - Full partner directory with exclusive perks
      - Subscription management link
      - Account settings

---

### File Handling

**Upload Flow:**

1. User selects file in `FileUpload` component
2. File validated client-side:
   - Type: PNG, JPG, or JPEG only
   - Size: Maximum 2MB
   - Dimensions: Recommended 500x500px (not enforced)
3. File stored in component state (not uploaded yet)
4. Preview thumbnail displayed using `FileReader` API
5. On form submit:
   - File sent to `storage.uploadFile()` function
   - Uploaded to Supabase Storage bucket `logos/`
   - Path: `logos/{userId}/{timestamp}-{filename}`
   - Public URL returned
6. URL saved to `submissions.logo_url` column
7. File accessible via public Supabase Storage URL

**Storage Bucket Configuration:**
- Bucket name: `logos`
- Public access: Enabled
- File size limit: 2MB (enforced by bucket policy)
- Allowed MIME types: `image/png`, `image/jpeg`
- RLS policy: Authenticated users can upload to their own folder

**Error Handling:**
- File too large: "File exceeds 2MB limit. Please compress or choose another."
- Invalid type: "Only PNG and JPG images allowed."
- Upload failure: "Upload failed. Please check your connection and try again."
- Missing file: Submission proceeds without logo (optional field)

---

### Error Handling

**Frontend Error Boundaries:**
- React Error Boundary wraps entire app
- Catches unhandled component errors
- Displays user-friendly error page
- Logs errors to console (can integrate Sentry in production)

**Form Validation Errors:**
- Displayed inline below invalid fields
- Red border on invalid inputs
- Submit button disabled until validation passes
- Error messages cleared on field focus

**API Error Handling:**
- Supabase errors caught in try/catch blocks
- Network errors detected via Axios/Fetch response
- Error messages displayed in Alert component
- Retry logic for transient failures (e.g., network timeout)

**Authentication Errors:**
- Invalid credentials: "Email or password incorrect."
- Email already exists: "This email is already registered. Please log in."
- Password reset errors: "Invalid or expired reset link."
- Session expired: User redirected to login with message

**Payment Errors:**
- Card declined: Handled by Stripe checkout UI
- Checkout session creation failure: "Unable to start checkout. Please try again."
- Webhook processing failure: Logged in Supabase, admin notified (requires monitoring setup)

**Error Logging Strategy:**
- Client-side: Console errors (can integrate Sentry)
- Server-side: Supabase Edge Function logs via `console.error()`
- Database errors: Logged in Supabase Dashboard logs
- Webhook failures: Stripe Dashboard shows failed webhook attempts

---

## Webhook Integrations

### Make.com Scenarios

**Scenario 1: Welcome Email Automation**

**Trigger:**
- HTTP webhook receives POST request from Supabase Edge Function

**Webhook URL:**
- Stored in `.env` as `MAKE_WEBHOOK_URL`
- Called after successful payment and subscription creation

**Request Payload:**
```json
{
  "event": "subscription_created",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "companyName": "Acme Inc."
  },
  "subscription": {
    "id": "sub_xxx",
    "status": "active",
    "currentPeriodEnd": "2025-10-30T00:00:00Z"
  },
  "submission": {
    "id": "uuid",
    "interests": ["legal", "real-estate", "banking"]
  }
}
```

**Scenario Steps:**
1. **Webhook Trigger**: Receive payload
2. **Parse JSON**: Extract user email, name, interests
3. **Compose Email**: Use template with dynamic fields
   - Subject: "Welcome to Worktugal, {fullName}!"
   - Body: Personalized welcome message, next steps, partner links
4. **Send Email**: Via Gmail/SendGrid/SMTP module
5. **Log Success**: Store confirmation in Google Sheets or Airtable

**Error Handling:**
- Webhook timeout: Make.com retries up to 3 times
- Email send failure: Logged in Make.com execution history
- Invalid payload: Scenario logs error, sends alert to admin email

---

**Scenario 2: Partner Notification**

**Trigger:**
- HTTP webhook receives POST request from Supabase Edge Function

**Webhook URL:**
- Stored in `.env` as `MAKE_PARTNER_WEBHOOK_URL`
- Called after successful subscription creation

**Request Payload:**
```json
{
  "event": "new_member",
  "member": {
    "email": "user@example.com",
    "fullName": "John Doe",
    "companyName": "Acme Inc.",
    "interests": ["legal", "real-estate"]
  },
  "timestamp": "2025-09-30T12:00:00Z"
}
```

**Scenario Steps:**
1. **Webhook Trigger**: Receive payload
2. **Parse Interests**: Extract categories array
3. **Lookup Partners**: Query Supabase for partners matching categories
   - Uses Supabase module with SQL query:
     ```sql
     SELECT email, name FROM partners WHERE category = ANY(interests) AND active = true
     ```
4. **Iterator**: Loop through each partner
5. **Compose Email**: Notify partner of new member
   - Subject: "New Worktugal Member in Your Category"
   - Body: Member details, contact info, next steps
6. **Send Email**: Via Gmail/SendGrid
7. **Update Supabase**: Log notification sent in tracking table (optional)

**Error Handling:**
- Partner query failure: Scenario stops, admin alerted
- Email send failure: Logged per partner, continues loop
- Missing partner email: Skipped, logged for admin review

---

### Supabase Webhooks

**Database Webhook: New Submission**

**Trigger:**
- Row inserted into `submissions` table with `status = 'paid'`

**Configuration:**
- Supabase Dashboard > Database > Webhooks
- Table: `submissions`
- Events: `INSERT`
- HTTP Headers: `Authorization: Bearer {service_role_key}`

**Webhook URL:**
- Points to Make.com scenario webhook

**Payload:**
```json
{
  "type": "INSERT",
  "table": "submissions",
  "record": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "status": "paid",
    "interests": ["legal"],
    "created_at": "2025-09-30T12:00:00Z"
  },
  "old_record": null
}
```

**Use Case:**
- Alternative to calling Make.com directly from Edge Function
- Decouples payment processing from email automation
- Enables multiple webhooks to react to same event

---

### Supabase Edge Functions

**Function 1: `stripe-checkout`**

**Purpose:** Create Stripe Checkout Session for subscription payment.

**Endpoint:**
```
POST https://{project-id}.supabase.co/functions/v1/stripe-checkout
```

**Request Headers:**
```
Authorization: Bearer {anon_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "submissionId": "uuid",
  "priceId": "price_xxx"
}
```

**Function Logic:**
1. Validate request body
2. Initialize Stripe SDK with `STRIPE_SECRET_KEY`
3. Create Stripe Customer (or retrieve existing by email)
4. Create Checkout Session:
   - `customer`: Customer ID
   - `line_items`: Price ID and quantity
   - `mode`: `subscription`
   - `success_url`: Redirect after payment
   - `cancel_url`: Redirect on cancellation
   - `metadata`: `submission_id`, `user_id`
5. Return session URL to frontend

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

**Error Responses:**
```json
{
  "error": "Missing required fields"
}
```

**CORS Headers:**
- Automatically handled by function template
- Allows requests from `VITE_APP_URL` origin

---

**Function 2: `stripe-webhook`**

**Purpose:** Receive and process Stripe webhook events.

**Endpoint:**
```
POST https://{project-id}.supabase.co/functions/v1/stripe-webhook
```

**Request Headers:**
```
Stripe-Signature: t=xxx,v1=yyy
Content-Type: application/json
```

**Function Logic:**
1. Extract raw request body
2. Verify webhook signature using `stripe.webhooks.constructEvent()`
3. Parse event type
4. Handle specific events:
   - `checkout.session.completed`:
     - Extract customer, subscription, metadata
     - Update `submissions` table: `status = 'paid'`
     - Insert row in `subscriptions` table
     - Update `profiles` table with Stripe IDs and status
     - Call Make.com webhook with payload
   - `customer.subscription.updated`:
     - Update `subscriptions` table with new status and period
     - Update `profiles.subscription_status`
   - `customer.subscription.deleted`:
     - Update `subscriptions.status = 'canceled'`
     - Update `profiles.subscription_status = 'inactive'`
   - `invoice.payment_failed`:
     - Update `subscriptions.status = 'past_due'`
     - Update `profiles.subscription_status = 'past_due'`
     - Trigger Make.com scenario to send payment failure email
5. Return 200 response to acknowledge receipt

**Response:**
```json
{
  "received": true
}
```

**Error Handling:**
- Invalid signature: Return 400 error, log to console
- Database update failure: Return 500 error, log details
- Unhandled event type: Return 200 (acknowledge but ignore)

**Security:**
- Webhook signature verification required
- Service role key used for Supabase updates (bypasses RLS)
- No authentication required (verified by signature)

---

### External Webhooks

**Stripe Webhook Configuration**

**Dashboard Setup:**
1. Navigate to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `https://{project-id}.supabase.co/functions/v1/stripe-webhook`
4. Select events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copy webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

**Testing Webhooks:**
- Use Stripe CLI: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`
- Trigger test events: `stripe trigger checkout.session.completed`
- Check Supabase Edge Function logs for processing confirmation

---

## Security & Privacy

### Row Level Security (RLS)

**Enforcement Strategy:**
- RLS enabled on all tables containing user data
- Policies enforce principle of least privilege
- Service role key used only in Edge Functions for admin operations
- Anon key used in frontend with RLS restrictions

**`profiles` Table Policies:**
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

**`submissions` Table Policies:**
```sql
-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create submissions
CREATE POLICY "Users can create submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update own submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**`partners` Table Policies:**
```sql
-- Public can view active partners
CREATE POLICY "Public can view active partners"
  ON partners FOR SELECT
  TO public
  USING (active = true);

-- Authenticated partners can insert their own entries
CREATE POLICY "Partners can insert own entry"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'role' = 'partner');
```

**`subscriptions` Table Policies:**
```sql
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role only for insert/update (via webhooks)
```

---

### Authenticated vs Public Access

**Public Routes:**
- `/` - Homepage
- `/privacy` - Privacy Policy
- `/terms` - Terms and Conditions
- Login/Signup modals

**Authenticated Routes:**
- `/success` - Post-payment confirmation (requires valid session)
- `/dashboard` - Member area (requires active subscription)
- `/profile` - User profile editor (requires authentication)

**Protected Route Guards:**
- `ProtectedRoute.tsx`: Checks `auth.user` exists, redirects to login if not
- `ProtectedSuccessRoute.tsx`: Checks `session_id` query param and verifies with Stripe
- Subscription status checked in `useSubscription` hook

---

### File Upload Restrictions

**Client-Side Validation:**
- File type: PNG, JPG, JPEG only
- File size: 2MB maximum
- Enforced in `FileUpload.tsx` component

**Server-Side Validation:**
- Supabase Storage bucket policy enforces:
  - MIME type whitelist: `image/png`, `image/jpeg`
  - File size limit: 2MB
  - Path prefix enforcement: Users can only upload to `logos/{userId}/`

**Storage Bucket RLS Policy:**
```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'logos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public can view all files in logos bucket
CREATE POLICY "Public can view logos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'logos');
```

---

### GDPR & Cookie Consent

**Cookie Consent Implementation:**
- Banner displayed on first visit
- User can accept all, reject all, or customize
- Preferences stored in localStorage
- Context provider manages consent state

**Cookie Categories:**
- **Essential**: Session, authentication, security (always enabled)
- **Analytics**: Google Analytics tracking (optional)
- **Marketing**: Remarketing, advertising (optional, currently unused)

**Data Collection Transparency:**
- Privacy Policy page details all data collected
- Contact email provided for data requests
- Users can request data deletion via email
- Data retention: 24 months for inactive accounts

**User Rights (GDPR):**
- Right to access: Users can export profile data
- Right to deletion: Contact operator to delete account
- Right to portability: Data export feature planned
- Right to rectification: Users can edit profile data

**Data Processing:**
- Data stored in EU region (Supabase EU instance)
- Stripe processes payments (PCI DSS compliant)
- Make.com processes webhooks (GDPR compliant)

---

### Input Validation Rules

**Frontend Validation (Zod Schemas):**

**Email Validation:**
```typescript
z.string().email("Invalid email address")
```

**Full Name Validation:**
```typescript
z.string().min(2, "Name must be at least 2 characters")
```

**Company Name Validation:**
```typescript
z.string().min(2, "Company name must be at least 2 characters")
```

**Website URL Validation:**
```typescript
z.string().url("Invalid URL format").optional()
```

**Password Validation (Auth):**
```typescript
z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain uppercase letter")
  .regex(/[a-z]/, "Password must contain lowercase letter")
  .regex(/[0-9]/, "Password must contain number")
```

**Backend Validation:**
- Database constraints: `NOT NULL`, `UNIQUE`, `CHECK` constraints
- Supabase Auth: Email format, password strength
- Stripe API: Card validation, amount validation
- Edge Functions: Request body schema validation

**SQL Injection Prevention:**
- Parameterized queries via Supabase client (no raw SQL in frontend)
- RLS policies prevent unauthorized data access
- Input sanitization in Edge Functions

**XSS Prevention:**
- React automatically escapes JSX content
- No `dangerouslySetInnerHTML` usage
- Content Security Policy headers (Netlify config)

---

## UX/UI Principles

### Mobile-First Design

**Breakpoint Strategy:**
- **Mobile:** 320px - 639px (base styles)
- **Tablet:** 640px - 1023px (`sm:` and `md:` prefixes)
- **Desktop:** 1024px - 1535px (`lg:` and `xl:` prefixes)
- **Large Desktop:** 1536px+ (`2xl:` prefix)

**Mobile Optimizations:**
- Touch targets minimum 44x44px (WCAG standard)
- Font sizes: 16px minimum to prevent zoom on iOS
- Sticky navigation for easy access
- Bottom-aligned CTAs for thumb reach
- Horizontal scrolling disabled
- Forms use native mobile inputs (email, tel, number)

**Responsive Patterns:**
- Stack layouts vertically on mobile
- Grid layouts: 1 column mobile, 2-3 columns tablet, 3-4 columns desktop
- Images scale proportionally with `max-w-full h-auto`
- Navigation collapses to hamburger menu below 768px
- Hero text sizing: `text-3xl md:text-5xl lg:text-6xl`

---

### Accessibility (WCAG 2.1 AA Compliance)

**Semantic HTML:**
- Proper heading hierarchy (`h1` > `h2` > `h3`)
- `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>` landmarks
- `<button>` for interactive elements (not `<div>`)
- `<label>` associated with form inputs via `htmlFor`

**Keyboard Navigation:**
- All interactive elements accessible via Tab key
- Focus visible indicators on all focusable elements
- Skip-to-content link for screen readers
- Modal traps focus within dialog
- Escape key closes modals
- Enter key submits forms

**Contrast Ratios:**
- Text: Minimum 4.5:1 contrast against background
- Large text (18px+): Minimum 3:1 contrast
- Interactive elements: Minimum 3:1 contrast
- Color not sole means of conveying information

**Screen Reader Support:**
- `alt` text on all images
- `aria-label` on icon-only buttons
- `aria-describedby` for form field hints
- `aria-live` regions for dynamic content updates
- `role="status"` for loading indicators
- `role="alert"` for error messages

**Form Accessibility:**
- Labels visible and associated with inputs
- Error messages announced by screen readers
- Required fields indicated with `required` attribute
- Field validation errors linked with `aria-describedby`

---

### Behavioral Design

**Progress Indicators:**
- Multi-step progress bar shows current step
- Percentage completion displayed: "Step 2 of 4"
- Completed steps marked with checkmark
- Current step highlighted with accent color
- Future steps grayed out

**Error Messaging:**
- Inline errors below fields (not at top of form)
- Specific error messages: "Email already in use" vs "Invalid input"
- Error state persists until user corrects issue
- Success states: Green checkmark after validation passes
- Toast notifications for system-level errors

**Loading States:**
- Button text changes: "Submit" → "Submitting..."
- Spinner icon replaces button text
- Disabled state prevents double-submission
- Skeleton loaders for content placeholders
- Progress bars for file uploads

**Empty States:**
- Friendly messaging when no data available
- Call-to-action to populate content
- Illustration or icon for visual interest

**Confirmation Patterns:**
- Success page after payment completion
- Email confirmation sent immediately
- Visual confirmation with checkmark and color change
- Clear next steps provided

---

### Visual System

**Color Palette:**

**Primary Colors:**
- Teal/Turquoise: `#14b8a6` (Tailwind `teal-500`)
- Used for: CTAs, links, active states, accents

**Secondary Colors:**
- Slate Gray: `#64748b` (Tailwind `slate-500`)
- Used for: Body text, secondary buttons, borders

**Accent Colors:**
- Orange: `#f97316` (Tailwind `orange-500`)
- Used for: Highlights, featured badges, notifications

**Semantic Colors:**
- Success: `#10b981` (Tailwind `green-500`)
- Error: `#ef4444` (Tailwind `red-500`)
- Warning: `#f59e0b` (Tailwind `yellow-500`)
- Info: `#3b82f6` (Tailwind `blue-500`)

**Neutral Colors:**
- Background: `#ffffff` (white)
- Surface: `#f8fafc` (Tailwind `slate-50`)
- Border: `#e2e8f0` (Tailwind `slate-200`)
- Text Primary: `#0f172a` (Tailwind `slate-900`)
- Text Secondary: `#64748b` (Tailwind `slate-500`)

**Typography:**

**Font Family:**
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Fallback ensures native OS font for performance

**Font Sizes:**
- xs: 12px (0.75rem)
- sm: 14px (0.875rem)
- base: 16px (1rem) - body text default
- lg: 18px (1.125rem)
- xl: 20px (1.25rem)
- 2xl: 24px (1.5rem)
- 3xl: 30px (1.875rem)
- 4xl: 36px (2.25rem)
- 5xl: 48px (3rem) - hero headlines
- 6xl: 60px (3.75rem)

**Font Weights:**
- Normal: 400 (body text)
- Medium: 500 (labels, subheadings)
- Semibold: 600 (buttons, emphasis)
- Bold: 700 (headings)

**Line Height:**
- Body: 150% (`leading-relaxed`)
- Headings: 120% (`leading-tight`)
- Compact UI: 100% (`leading-none`)

**Letter Spacing:**
- Default: 0
- Headings: -0.02em (`tracking-tight`)
- All-caps: 0.05em (`tracking-wide`)

**Spacing System (8px Grid):**
- 0.5: 2px (0.125rem)
- 1: 4px (0.25rem)
- 2: 8px (0.5rem)
- 3: 12px (0.75rem)
- 4: 16px (1rem)
- 6: 24px (1.5rem)
- 8: 32px (2rem)
- 12: 48px (3rem)
- 16: 64px (4rem)
- 24: 96px (6rem)

**Component Spacing:**
- Section padding: `py-16 md:py-24`
- Card padding: `p-6 md:p-8`
- Button padding: `px-6 py-3`
- Input padding: `px-4 py-3`
- Gap between elements: `gap-4` or `gap-6`

**Border Radius:**
- Small: 4px (`rounded`)
- Medium: 8px (`rounded-lg`)
- Large: 12px (`rounded-xl`)
- Full: 9999px (`rounded-full`) - pills, avatars

**Shadows:**
- Small: `shadow-sm` - subtle card lift
- Medium: `shadow-md` - default card shadow
- Large: `shadow-lg` - modals, dropdowns
- Extra Large: `shadow-xl` - floating elements
- Inner: `shadow-inner` - inset fields

**Animations & Transitions:**

**Transition Durations:**
- Fast: 150ms - hover states, color changes
- Medium: 300ms - component mounting, sliding
- Slow: 500ms - page transitions, complex animations

**Easing Functions:**
- Default: `ease-in-out` - most transitions
- Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - playful interactions
- Smooth: `cubic-bezier(0.4, 0, 0.2, 1)` - page transitions

**Animation Examples:**
- Button hover: Scale 1.05, 150ms
- Card hover: Translate Y -4px, 300ms
- Modal enter: Fade in + scale from 0.95, 300ms
- Form step transition: Slide left/right, 300ms
- Loading spinner: Rotate 360deg, 1s infinite
- Success checkmark: Draw path animation, 500ms

**Micro-Interactions:**
- Input focus: Border color change + shadow
- Button click: Scale down to 0.95
- Checkbox check: Animated checkmark draw
- Progress bar: Animated width change
- Toast notification: Slide in from top, auto-dismiss after 5s
- File upload: Progress bar fill animation
- Partner card hover: Shadow increase + logo scale

---

## Analytics & Monitoring

### Google Analytics 4

**Implementation:**
- Script loaded conditionally based on cookie consent
- Tracking ID stored in `VITE_GA_MEASUREMENT_ID`
- Respects user's analytics consent choice

**Key Tracked Events:**

**Page Views:**
- Automatic page view tracking via React Router
- Custom page titles set via React Helmet

**Conversion Events:**
- `sign_up`: User completes registration
- `begin_checkout`: User reaches payment step
- `purchase`: Subscription payment completed
- `view_item`: Partner detail viewed

**Engagement Events:**
- `form_step_completed`: Each wizard step completion
- `partner_click`: User clicks partner website link
- `perk_viewed`: User expands perk details
- `profile_updated`: User saves profile changes

**Custom Dimensions:**
- `user_role`: Member, partner, admin
- `subscription_status`: Active, inactive, trialing
- `selected_categories`: Array of user interests

**E-commerce Tracking:**
- Transaction ID: Stripe subscription ID
- Product: Subscription plan name
- Revenue: Subscription amount
- Currency: EUR

---

### Supabase Monitoring

**Database Metrics:**
- Query performance via Dashboard > Database > Query Performance
- Slow query alerts (queries >1s)
- Connection pool usage
- Table sizes and growth trends

**Auth Metrics:**
- User signups per day
- Login success/failure rates
- Password reset requests
- Session duration averages

**Storage Metrics:**
- File upload volume
- Storage bucket size
- Public vs private file ratio

**API Usage:**
- Requests per hour
- Error rate percentage
- Average response time
- Rate limit hits

---

### Netlify Analytics

**Traffic Metrics:**
- Unique visitors per day/month
- Page views and top pages
- Traffic sources (direct, referral, search)
- Geographic distribution

**Performance Metrics:**
- Build duration
- Deploy success rate
- CDN cache hit ratio
- Bandwidth usage

**Error Tracking:**
- 4xx and 5xx error rates
- Top error pages
- Failed function invocations

---

### Crisp Chat (Optional)

**Integration:**
- Live chat widget in bottom-right corner
- Loaded after cookie consent
- Customized with brand colors
- Triggers on user inactivity (30s)

**Tracked Interactions:**
- Chat initiated
- Message sent
- Support ticket created
- Satisfaction rating submitted

---

### Performance Monitoring

**Core Web Vitals:**
- **LCP (Largest Contentful Paint)**: Target <2.5s
- **FID (First Input Delay)**: Target <100ms
- **CLS (Cumulative Layout Shift)**: Target <0.1

**Lighthouse Scores (Target):**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**Monitoring Tools:**
- Netlify Analytics built-in performance monitoring
- Google PageSpeed Insights weekly audits
- WebPageTest for detailed waterfall analysis
- Chrome DevTools Lighthouse for local testing

**Optimization Techniques:**
- Code splitting via React.lazy()
- Image optimization (WebP, responsive sizes)
- CDN caching for static assets
- Preload critical fonts and images
- Defer non-critical JavaScript
- Minify CSS/JS in production build

---

## Testing & Debug Mode

### Debug Mode Activation

**Enable via URL Parameter:**
```
https://worktugal.com?debug=true
```

**Behavior:**
- Debug panel displays in bottom-right corner
- Console logging verbosity increased
- Form validation errors logged to console
- API requests/responses logged
- Component render counts displayed
- localStorage state visible

---

### Debug Panel Features

**State Inspector:**
- View current form wizard step
- Display all form field values
- Show localStorage contents
- Display authentication state
- Show subscription status

**Action Triggers:**
- Clear localStorage
- Force re-render components
- Simulate form errors
- Reset form to specific step
- Trigger test webhook calls

**Performance Metrics:**
- Component render times
- API call durations
- File upload progress
- Page load metrics

**Feature Toggles:**
- Bypass email validation
- Skip payment step (test mode)
- Mock Stripe responses
- Enable console logging

---

### Testing Strategy

**Manual Testing Checklist:**
- Form submission with valid data
- Form validation error states
- File upload with oversized file
- Payment flow with test card (4242 4242 4242 4242)
- Payment flow with declined card (4000 0000 0000 0002)
- Authentication (login, signup, logout)
- Password reset flow
- Mobile responsive layouts
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility audit via Lighthouse
- Cookie consent accept/reject flows

**Test Cards (Stripe):**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Auth: `4000 0027 6000 3184`
- Expired: `4000 0000 0000 0069`

**Test Credentials:**
- Create test user via signup form
- Use temporary email services (e.g., temp-mail.org)
- Test password reset with real email

**Database Testing:**
- Query Supabase directly to verify data integrity
- Check RLS policies via SQL Editor
- Verify webhook updates reflected in database

**Edge Function Testing:**
- Use Supabase CLI to test locally: `supabase functions serve`
- Trigger with cURL or Postman
- Check logs in Supabase Dashboard > Edge Functions

---

## Governance & Safety

### Versioning Rules

**Version Format:**
```
[⚡ vX.Y]
```

**Semantic Versioning:**
- **X (Major):** Breaking changes, major feature releases
- **Y (Minor):** New features, non-breaking enhancements

**Version Log Location:**
- Commit messages prefixed with version tag
- Changelog maintained in project notes (not in repo)
- Version displayed in footer (optional)

**Example Versions:**
- `[⚡ v1.0]` - Initial launch
- `[⚡ v1.1]` - Added partner notification webhook
- `[⚡ v2.0]` - Redesigned form wizard (breaking change)

---

### Backup Schedule

**Database Backups:**
- Supabase automatic daily backups (retained 7 days)
- Weekly manual exports to external storage
- Point-in-time recovery available (Supabase Pro plan)

**File Storage Backups:**
- Supabase Storage files mirrored to S3 weekly
- Logos folder backed up separately

**Code Repository:**
- Git commits pushed to remote repository after each session
- Protected main branch (no direct commits)
- Feature branches merged via pull requests

**Secrets Backup:**
- Environment variables documented in secure password manager
- API keys rotated quarterly
- Backup `.env.example` kept in repository

---

### Firewall Rules

**Supabase Network Policies:**
- API rate limiting: 100 requests/minute per IP
- Auth rate limiting: 10 login attempts per hour per email
- Storage upload rate limiting: 10 files/minute per user

**Netlify Firewall:**
- DDoS protection enabled
- Bot detection and blocking
- Geographic restrictions (optional)

**Database Security:**
- RLS enforced on all tables
- No direct database access from public internet
- Service role key restricted to Edge Functions only

---

### Secrets Handling

**Environment Variables:**
- Never committed to Git (in `.gitignore`)
- Stored in Netlify environment variables dashboard
- Supabase secrets stored in Supabase Dashboard > Settings > API
- Stripe keys stored in Stripe Dashboard > Developers > API Keys

**Secret Rotation:**
- Stripe keys rotated every 6 months
- Supabase anon key regenerated annually
- Service role key rotated after team member departure
- Webhook secrets regenerated if leaked

**Access Control:**
- Operator has full access to all secrets
- Edge Functions access secrets via environment variables (no hardcoding)
- Frontend only accesses `VITE_` prefixed public keys

---

## Recent Updates

**2025-10-29: Security Issues Resolved + Footer Navigation Cleanup**
- Fixed critical RLS performance issues in leads_accounting and accounting_intakes tables
- Optimized 3 RLS policies by replacing auth.uid() with (select auth.uid()) for 10-100x better query performance
- Removed 44 unused database indexes consuming disk space and slowing write operations
- Fixed 4 database functions with mutable search_path security vulnerabilities
- Added explicit SET search_path to update_accounting_intakes_updated_at, send_order_with_email_to_webhook, handle_new_user, and log_user_signup functions
- Cleaned up footer Quick Links section to remove duplication and anchor links
- Removed Privacy Policy and Terms of Service from Quick Links (already present in footer bottom)
- Removed Accounting Desk and Partners anchor links from Quick Links navigation
- Updated Contact link to use proper contact page (https://worktugal.com/contact/) instead of email
- Streamlined Quick Links to 4 essential items: Resources, Jobs, About Us, Contact
- Created comprehensive security documentation at docs/SECURITY_ISSUES_RESOLVED.md
- Documented performance improvements and manual intervention requirements
- Multiple permissive policies flagged as intentional (role-based access control best practice)
- Production build successfully compiles with all security fixes
- Note: Database Schema section (see migration: fix_security_issues_rls_performance_and_cleanup.sql)

**2025-10-07: Authentication System Repair + Webhook Restoration**
- Fixed critical authentication issue blocking all new user signups
- Identified and removed problematic "Before User Created" hook in Supabase dashboard causing 400 errors
- Hook was calling Make.com webhook synchronously during signup, causing "hook_payload_over_size_limit" errors
- Re-enabled non-blocking webhook notification system in auth.ts after removing blocking hook
- Webhook now triggers successfully after signup completes: frontend → notify-signup Edge Function → Make.com
- User signup flow restored to working state: account creation succeeds, webhook fires in background
- Webhook fires to https://hook.eu2.make.com/pueq1sw659ym23cr3fwe7huvhxk4nx9v for FluentCRM, Telegram, and Amazon SES notifications
- Authentication errors no longer occur ("Unable to connect to authentication service" resolved)
- Non-blocking architecture ensures signup succeeds even if webhook fails
- Production build successfully compiles with all changes
- Note: Authentication → Hooks section updated (removed blocking webhook configuration)

**2025-10-04: Early Access Form UX Refinement + Complete SEO Update**
- Refined EarlyAccessForm success screen messaging to align with actual email content
- Removed overpromising language: eliminated false checklist items and specific wait times
- Updated success screen copy to set realistic expectations (simple confirmation email, priority access)
- Changed social proof from "Join 87 remote professionals" to "You're on the priority list"
- Implemented underpromise-overdeliver strategy throughout user confirmation flow
- Maintained urgent case fast-track option and engagement CTAs (Telegram, Partner Directory)
- Comprehensive SEO metadata overhaul across entire platform
- Updated base index.html template with new Accounting Desk focused metadata
- Changed primary title from "Professional Services for Remote Workers" to "Accounting Desk for Remote Professionals in Portugal"
- Updated meta description to emphasize tax compliance, OCC-certified accountants, and starting price (€59)
- Replaced outdated keywords (coworking, wellness) with accounting-specific terms (portugal accountant, freelancer tax, nif portugal)
- Refreshed all OpenGraph tags for accurate social media sharing (Facebook, LinkedIn, Twitter, Telegram)
- Updated Twitter Card metadata with new Accounting Desk messaging
- Converted structured data schema from LocalBusiness to ProfessionalService type
- Updated schema.org description to reflect accounting services for remote professionals
- Changed geographic scope from Lisbon-specific to Portugal-wide service area
- Added price range indicator (€€) to structured data for SEO visibility
- All social sharing platforms now display correct, current Accounting Desk value proposition
- Built and verified dist/index.html contains updated metadata for deployment
- SEO now properly aligned with strategic pivot to accounting services over perk marketplace
- Note: Database Schema section unchanged (no migrations today)
- Note: Build & Deployment section unchanged (standard build process)

**2025-10-04: v2.0 - Accounting Desk + Partner Hub Pivot**
- **Major Strategic Repositioning:** Transitioned from perk marketplace to Accounting Desk primary product
- Homepage now features Accounting Desk early access as primary hero section
- Partner directory repositioned as secondary "Partner Hub" supporting ecosystem
- Implemented SEO-safe redirects: /accounting-early → /, /perks → /partners, /accounting → /
- Created dedicated /partners route with full partner directory
- Created /partners/join route for partner onboarding (3-step form with €49 lifetime payment)
- Featured partners section added to homepage (6-8 partners displayed below accounting content)
- Updated all messaging: "Accounting and trusted partners for remote professionals"
- Partner Hub CTA section added to homepage encouraging business listings
- Preserved all existing partner submission flow and Stripe payment integration
- Footer tagline updated to reflect new positioning
- Visual hierarchy adjusted: Accounting Desk prominent, partners as supporting content
- All backend infrastructure maintained (no breaking changes to database, authentication, or payments)
- Build successfully compiles with no errors

**2025-10-03:**
- Removed redundant "Join the Waitlist" CTA button from AccountingHero section
- Updated EarlyAccessForm heading from "Join the Waitlist" to "Get Early Bird Access" to eliminate repetition and add urgency
- Improved UX flow for Accounting Desk landing page with clearer conversion funnel
- Cleaned up Layout navigation component by removing "Services", "Browse Perks", and "Pricing" links
- Streamlined header navigation to focus on essential user actions
- Updated logo implementation across all navigation components (Header, Layout, Footer)
- Replaced local logo assets with Supabase Storage CDN URL for centralized management
- Logo now displays consistently before "Worktugal Pass" wordmark throughout the application
- Mobile-friendly logo sizing implemented (32px footer, 36-40px headers)

**2025-09-30:**
- Initial README documentation created
- Comprehensive project structure documented
- Database schema fully mapped
- Form flow and validation rules detailed
- Webhook integration architecture documented

**2025-08-27:**
- Added partner notification webhook integration
- Implemented automatic email to partners when new member joins their category
- Migration `20250827131830_green_river.sql` added partner contact fields

**2025-07-22:**
- Completed Stripe webhook integration
- Subscription status now updates automatically on payment
- Edge Functions deployed for checkout and webhook handling
- Multiple migrations applied to finalize subscriptions table schema

**2025-07-21:**
- Added cookie consent banner with GDPR compliance
- Implemented granular cookie preferences (essential, analytics, marketing)
- Cookie consent context provider added

**2025-07-20:**
- Form wizard redesigned with progress bar
- Multi-step validation improved with Zod schemas
- File upload component added with drag-drop support

**2025-07-19:**
- Initial partner directory implementation
- Partners table populated with seed data via `populate-partners.js`
- Category filtering and search functionality added

**2025-07-18:**
- Project initialization
- Supabase database setup
- Authentication system implemented with email/password
- Base migrations created for profiles, submissions, partners tables

---

## Known Issues & Roadmap

### Known Issues

**Current Limitations:**
1. **Email Confirmation Disabled:** Users are not required to verify email before accessing member area. This is intentional for reduced friction but may lead to typo issues.
2. **No Subscription Management UI:** Users cannot cancel or update subscriptions directly in app. Must contact support or use Stripe customer portal (not yet implemented).
3. **Partner Directory Search:** Search only filters by name and category, not description or perk details.
4. **Mobile Form UX:** File upload component difficult to use on small screens (no native file picker integration).
5. **No Retry Logic for Failed Webhooks:** If Stripe webhook fails, manual intervention required to sync subscription status.
6. **Limited Error Recovery:** If user closes browser during file upload, no resume mechanism exists.
7. **No Multi-Language Support:** All content hardcoded in English. Portuguese translation needed for local market.
8. **Analytics Event Gaps:** Some user interactions not tracked (e.g., partner search queries, filter usage).

**Bugs:**
- None reported as of 2025-09-30

---

### Planned Improvements

**High Priority (Next 30 Days):**
1. **Stripe Customer Portal Integration:** Allow users to self-manage subscriptions, update payment methods, view invoices.
2. **Email Verification:** Optional email confirmation step with resend functionality.
3. **Partner Search Enhancements:** Full-text search across all partner fields, fuzzy matching for typos.
4. **Webhook Retry Logic:** Implement exponential backoff for failed Stripe webhooks.
5. **Mobile File Upload Improvement:** Native file picker for iOS/Android, better preview handling.

**Medium Priority (60-90 Days):**
1. **Portuguese Localization:** Translate all UI text, forms, emails to Portuguese.
2. **Advanced Analytics:** User cohort analysis, retention metrics, churn prediction.
3. **Partner Dashboard:** Self-service portal for partners to update profiles, view lead notifications.
4. **Referral System:** Member referral program with discount codes.
5. **Progressive Web App (PWA):** Installable app experience with offline support.
6. **Admin Dashboard:** Internal tool for managing partners, reviewing submissions, handling support tickets.

**Low Priority (Long-Term):**
1. **Social Login:** Google, LinkedIn, Facebook authentication options.
2. **Multi-Tier Subscriptions:** Basic, Premium, Enterprise plans with varying perk access.
3. **Community Features:** Member directory, networking events calendar, discussion forum.
4. **API for Partners:** Public API for partners to integrate perk redemption tracking.
5. **White-Label Solution:** Framework for launching similar platforms in other countries.

---

## Negative Prompts (Guardrails)

**Do NOT:**
- Use dashes or emojis in formal documentation sections
- Summarize schema details into vague descriptions
- Assume the reader has prior context or access to external documentation
- Hide action items inside long narrative paragraphs
- Use corporate jargon or buzzwords without plain-language equivalents
- Omit version numbers, dates, or timestamps from critical information
- Reference external tools or services without explaining their purpose and integration
- Provide recommendations without specific, actionable steps
- Skip error handling scenarios or edge cases in flow descriptions
- Leave configuration examples incomplete or with placeholder values undefined
- Assume default behaviors without explicitly stating them
- Use acronyms without defining them on first use
- Provide incomplete file paths or ambiguous directory references
- Omit nullable/default values from database schema documentation
- Skip RLS policy explanations or security considerations
- Use relative dates ("last week", "recently") instead of absolute dates
- Provide code examples without context or explanation
- Reference deprecated features or removed functionality without noting status

**Do:**
- Use bullet points and numbered lists for clarity
- Provide complete, copy-pastable code examples
- Include both success and failure scenarios
- Define all technical terms on first use
- Use absolute dates in YYYY-MM-DD format
- Explain the "why" behind architectural decisions
- Include fallback options and error recovery steps
- Cross-reference related sections with explicit links
- Provide real examples from the actual codebase
- Distinguish between required and optional steps
- State assumptions explicitly
- Include version numbers for all dependencies
- Provide context for every configuration option
- Use consistent terminology throughout
- Structure information hierarchically with clear headings
- Emphasize security and privacy considerations
- Make all instructions reproducible from zero state

---

**End of README**
