# Worktugal Technical Reference

**Last Updated:** 2026-02-03

This document contains detailed technical documentation for developers and maintainers. For project overview, current state, and strategic direction, see the main [README.md](../README.md).

---

## Table of Contents

1. [Database Schema (All Tables)](#database-schema-all-tables)
2. [Edge Functions Reference](#edge-functions-reference)
3. [Webhook Integrations](#webhook-integrations)
4. [Error Handling Patterns](#error-handling-patterns)
5. [Build & Deployment Configuration](#build--deployment-configuration)
6. [RLS Policy Reference](#rls-policy-reference)
7. [File Storage](#file-storage)
8. [Project Changelog](#project-changelog)

---

## Database Schema (All Tables)

### Active Tables

#### `tax_checkup_leads`

Primary lead generation table from Tax Checkup Tool.

```sql
CREATE TABLE tax_checkup_leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  work_type TEXT NOT NULL,
  estimated_annual_income TEXT NOT NULL,
  months_in_portugal INTEGER NOT NULL,
  residency_status TEXT,
  has_nif BOOLEAN,
  activity_opened BOOLEAN,
  has_vat_number BOOLEAN,
  has_niss BOOLEAN,
  has_fiscal_representative BOOLEAN,
  compliance_score_red INTEGER DEFAULT 0,
  compliance_score_yellow INTEGER DEFAULT 0,
  compliance_score_green INTEGER DEFAULT 0,
  compliance_report TEXT,
  lead_quality_score INTEGER,
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  email_marketing_consent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new',
  notes TEXT,
  converted_to_intake_id BIGINT REFERENCES accounting_intakes(id),
  converted_at TIMESTAMPTZ,
  email_hash TEXT NOT NULL,
  is_latest_submission BOOLEAN DEFAULT true,
  submission_sequence INTEGER DEFAULT 1,
  previous_submission_id BIGINT REFERENCES tax_checkup_leads(id),
  first_submission_at TIMESTAMPTZ,
  interested_in_accounting_services BOOLEAN DEFAULT false
);
```

**Indexes:**
- `email_hash` - For deduplication lookups
- `is_latest_submission` - For filtering unique leads
- `compliance_score_red` - For prioritizing high-risk leads
- `interested_in_accounting_services` - For filtering warm leads
- `created_at` - For chronological sorting

#### `paid_compliance_reviews`

€49 Detailed Compliance Risk Review purchases.

```sql
CREATE TABLE paid_compliance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  access_token TEXT UNIQUE DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  status TEXT DEFAULT 'form_pending' CHECK (status IN ('form_pending', 'submitted', 'in_review', 'completed', 'escalated')),
  form_data JSONB DEFAULT '{}',
  form_progress JSONB DEFAULT '{"sections_completed": []}',
  escalation_flags JSONB DEFAULT '[]',
  ambiguity_score INTEGER DEFAULT 0,
  admin_notes TEXT,
  review_delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `accountant_applications`

Accountant partner applications.

```sql
CREATE TABLE accountant_applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  experience_years INTEGER,
  specializations TEXT[] DEFAULT '{}',
  resume_url TEXT,
  resume_path TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  current_freelancer_clients TEXT,
  foreign_client_percentage TEXT,
  preferred_communication TEXT,
  accepts_triage_role TEXT,
  vat_scenario_answer TEXT,
  partnership_interest_level TEXT,
  english_fluency TEXT CHECK (english_fluency IN ('fluent', 'advanced', 'intermediate', 'basic')),
  portuguese_fluency TEXT CHECK (portuguese_fluency IN ('native', 'fluent', 'advanced', 'intermediate')),
  availability TEXT CHECK (availability IN ('5-10', '10-20', '20+', 'full-time')),
  why_worktugal TEXT,
  has_occ BOOLEAN DEFAULT true,
  occ_number TEXT,
  status application_status DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `accounting_intakes`

Comprehensive freelancer/expat compliance intake data.

```sql
CREATE TABLE accounting_intakes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  residency_status TEXT,
  days_in_portugal INTEGER,
  city TEXT,
  income_sources JSONB DEFAULT '[]',
  has_nif BOOLEAN,
  nif_number TEXT,
  has_niss BOOLEAN,
  niss_number TEXT,
  has_iban BOOLEAN,
  iban_number TEXT,
  has_vat_number BOOLEAN,
  vat_regime TEXT,
  has_fiscal_representative BOOLEAN,
  has_electronic_notifications BOOLEAN,
  activity_opened BOOLEAN,
  activity_code TEXT,
  activity_date DATE,
  previous_accountant BOOLEAN,
  accounting_software TEXT,
  urgency_level TEXT DEFAULT 'medium',
  biggest_worry TEXT,
  special_notes TEXT,
  files JSONB DEFAULT '{}',
  status TEXT DEFAULT 'new',
  tags JSONB DEFAULT '[]',
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ,
  source_type TEXT DEFAULT 'full_intake',
  compliance_score_red INTEGER DEFAULT 0,
  compliance_score_yellow INTEGER DEFAULT 0,
  compliance_score_green INTEGER DEFAULT 0,
  compliance_report TEXT,
  lead_quality_score INTEGER,
  email_marketing_consent BOOLEAN DEFAULT false,
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  work_type TEXT,
  estimated_annual_income TEXT,
  months_in_portugal INTEGER,
  last_step_reached INTEGER,
  user_id UUID REFERENCES auth.users(id),
  lead_email_hash TEXT NOT NULL,
  is_latest_submission BOOLEAN DEFAULT true,
  submission_sequence INTEGER DEFAULT 1,
  previous_submission_id BIGINT REFERENCES accounting_intakes(id),
  first_submission_at TIMESTAMPTZ,
  came_from_checkup_id BIGINT REFERENCES tax_checkup_leads(id)
);
```

#### `contact_requests`

Multi-purpose contact form submissions.

```sql
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  purpose TEXT NOT NULL CHECK (purpose IN ('accounting', 'partnership', 'job', 'info', 'other')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  website_url TEXT,
  message TEXT,
  budget_range TEXT CHECK (budget_range IN ('200-499', '500-999', '1000+', 'not_yet', 'exploring')),
  timeline TEXT CHECK (timeline IN ('this_month', '3_months', 'later', 'flexible')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'replied', 'converted', 'archived')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  notes TEXT,
  webhook_sent BOOLEAN DEFAULT false,
  webhook_sent_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ
);
```

### Legacy Tables (Maintained)

#### `user_profiles`

User account information.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  role user_role DEFAULT 'user', -- user, partner, admin
  has_paid_compliance_review BOOLEAN DEFAULT false,
  paid_compliance_review_id UUID REFERENCES paid_compliance_reviews(id)
);
```

#### `accountant_profiles`

Approved accountant partner profiles.

```sql
CREATE TABLE accountant_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  specializations TEXT[] DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  commission_rate NUMERIC DEFAULT 0.65,
  status accountant_status DEFAULT 'pending_approval',
  cal_link TEXT,
  cal_api_key TEXT,
  bank_account_name TEXT,
  bank_iban TEXT,
  bank_bic TEXT,
  tax_id TEXT,
  preferred_payout_method payout_method,
  minimum_monthly_guarantee NUMERIC DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  average_rating NUMERIC DEFAULT 0,
  profile_picture_url TEXT,
  languages TEXT[] DEFAULT '{}',
  timezone TEXT DEFAULT 'Europe/Lisbon',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `partners`

Service provider directory entries.

```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  perk_description TEXT,
  discount_amount TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Stripe Tables

```sql
-- stripe_customers
CREATE TABLE stripe_customers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- stripe_subscriptions
CREATE TABLE stripe_subscriptions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id TEXT UNIQUE REFERENCES stripe_customers(customer_id),
  subscription_id TEXT,
  price_id TEXT,
  current_period_start BIGINT,
  current_period_end BIGINT,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method_brand TEXT,
  payment_method_last4 TEXT,
  status stripe_subscription_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- stripe_orders
CREATE TABLE stripe_orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  checkout_session_id TEXT NOT NULL,
  payment_intent_id TEXT NOT NULL,
  customer_id TEXT REFERENCES stripe_customers(customer_id),
  amount_subtotal BIGINT NOT NULL,
  amount_total BIGINT NOT NULL,
  currency TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  status stripe_order_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
```

---

## Edge Functions Reference

### Active Functions

#### `submit-tax-checkup`

Processes Tax Checkup form submissions.

**Endpoint:** `POST /functions/v1/submit-tax-checkup`

**Request Payload:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "work_type": "developer",
  "estimated_annual_income": "25k_50k",
  "months_in_portugal": 8,
  "has_nif": true,
  "activity_opened": true,
  "has_vat_number": false,
  "has_niss": false,
  "has_fiscal_representative": false,
  "interested_in_accounting_services": true,
  "email_marketing_consent": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "compliance_score_red": 2,
    "compliance_score_yellow": 1,
    "compliance_score_green": 3,
    "compliance_report": "Based on your answers..."
  }
}
```

**Scoring Logic:**
- Red flags: Missing NISS, no VAT when income > €15k, no fiscal rep when non-resident
- Yellow flags: Activity opened > 12 months ago without review, no electronic notifications
- Green flags: Has NIF, activity opened, proper VAT status

#### `paid-review-checkout`

Creates Stripe checkout session for €49 review.

**Endpoint:** `POST /functions/v1/paid-review-checkout`

**Request Payload:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_xxx..."
}
```

**Stripe Product Configuration:**
- Product: "Detailed Compliance Risk Review"
- Price: €49.00 one-time
- Mode: `payment` (not subscription)

#### `paid-review-webhook`

Handles Stripe webhook for successful payment.

**Endpoint:** `POST /functions/v1/paid-review-webhook`

**Events Handled:**
- `checkout.session.completed`

**Actions:**
1. Verify webhook signature
2. Create `paid_compliance_reviews` record
3. Generate unique access token
4. Update `user_profiles.has_paid_compliance_review` if user exists

#### `submit-accountant-application`

Processes accountant partner applications.

**Endpoint:** `POST /functions/v1/submit-accountant-application`

**Request Payload:**
```json
{
  "full_name": "Maria Silva",
  "email": "maria@accountant.pt",
  "phone": "+351912345678",
  "experience_years": 8,
  "specializations": ["freelancers", "foreign_residents"],
  "english_fluency": "fluent",
  "portuguese_fluency": "native",
  "has_occ": true,
  "occ_number": "12345",
  "accepts_triage_role": "yes",
  "availability": "10-20"
}
```

---

## Webhook Integrations

### Make.com Scenarios

#### Tax Checkup Lead Notification

**Webhook URL:** Stored in Supabase Edge Function as `MAKE_WEBHOOK_URL`

**Trigger:** New tax checkup submission with `is_latest_submission = true`

**Payload:**
```json
{
  "event": "tax_checkup_submitted",
  "lead": {
    "id": 123,
    "email": "user@example.com",
    "name": "John Doe",
    "work_type": "developer",
    "estimated_annual_income": "25k_50k",
    "months_in_portugal": 8,
    "compliance_score_red": 2,
    "compliance_score_yellow": 1,
    "compliance_score_green": 3,
    "interested_in_accounting_services": true
  },
  "enhanced_report": {
    "red_flags": ["Missing NISS registration", "VAT threshold risk"],
    "yellow_flags": ["No fiscal representative"],
    "green_flags": ["NIF obtained", "Activity opened"]
  },
  "live_stats": {
    "total_leads": 92,
    "high_risk_leads": 21,
    "conversion_rate": "7.6%"
  },
  "timestamp": "2026-02-03T12:00:00Z"
}
```

**Make.com Scenario Steps:**
1. Webhook trigger receives payload
2. Filter: Only process if `compliance_score_red >= 2`
3. Send email notification to admin
4. Log to Google Sheets for tracking

### Cal.com Integration (Legacy)

**Webhook URL:** `calcom-webhook` Edge Function

**Events:**
- `BOOKING_CREATED`
- `BOOKING_CANCELLED`
- `BOOKING_RESCHEDULED`

**Payload:**
```json
{
  "triggerEvent": "BOOKING_CREATED",
  "payload": {
    "uid": "abc123",
    "title": "Tax Consultation",
    "startTime": "2026-02-10T10:00:00Z",
    "endTime": "2026-02-10T10:30:00Z",
    "attendees": [
      {
        "email": "client@example.com",
        "name": "John Doe"
      }
    ],
    "metadata": {
      "booking_id": "456"
    }
  }
}
```

---

## Error Handling Patterns

### Edge Function Error Format

All Edge Functions return consistent error format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `DUPLICATE_SUBMISSION` | 409 | Email already submitted recently |
| `STRIPE_ERROR` | 502 | Stripe API failure |
| `DATABASE_ERROR` | 500 | Supabase query failed |
| `WEBHOOK_SIGNATURE_INVALID` | 401 | Stripe webhook signature mismatch |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |

### Frontend Error Handling

```typescript
try {
  const response = await supabase.functions.invoke('submit-tax-checkup', {
    body: formData
  });
  
  if (response.error) {
    // Edge Function returned error
    setError(response.error.message);
    return;
  }
  
  if (!response.data.success) {
    // Business logic error
    setError(response.data.error);
    return;
  }
  
  // Success
  setResult(response.data.data);
} catch (err) {
  // Network or unexpected error
  setError('Unable to connect. Please check your internet.');
}
```

---

## Build & Deployment Configuration

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
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  }
});
```

### Cloudflare Pages Configuration

**Build Settings:**
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Node version: 18.x

**Environment Variables:**
```
VITE_SUPABASE_URL=https://jbmfneyofhqlwnnfuqbd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_APP_URL=https://app.worktugal.com
```

**DNS Configuration:**
- Domain: `app.worktugal.com`
- Type: CNAME
- Target: `worktugal-apps.pages.dev`
- Proxy: DNS only (not proxied)

### SPA Routing (`public/_redirects`)

```
/*    /index.html   200
```

---

## RLS Policy Reference

### `tax_checkup_leads`

```sql
-- Allow anonymous inserts (public form)
CREATE POLICY "Allow anonymous inserts" ON tax_checkup_leads
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own submissions by email
CREATE POLICY "Users can view own submissions" ON tax_checkup_leads
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admin full access
CREATE POLICY "Admin full access" ON tax_checkup_leads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### `paid_compliance_reviews`

```sql
-- Users can view their own reviews
CREATE POLICY "Users can view own reviews" ON paid_compliance_reviews
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own reviews (form submission)
CREATE POLICY "Users can update own reviews" ON paid_compliance_reviews
  FOR UPDATE USING (user_id = auth.uid());

-- Service role can insert (webhook creates record)
CREATE POLICY "Service role insert" ON paid_compliance_reviews
  FOR INSERT WITH CHECK (true);
```

### `accountant_applications`

```sql
-- Allow anonymous inserts (public application form)
CREATE POLICY "Allow anonymous applications" ON accountant_applications
  FOR INSERT WITH CHECK (true);

-- Admin can view all applications
CREATE POLICY "Admin view all" ON accountant_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## File Storage

### Buckets

| Bucket | Purpose | Public | Max Size |
|--------|---------|--------|----------|
| `logos` | Partner business logos | Yes | 2MB |
| `resumes` | Accountant application resumes | No | 5MB |
| `documents` | Compliance review documents | No | 10MB |

### Upload Pattern

```typescript
const uploadFile = async (bucket: string, file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return publicUrl;
};
```

---

## Project Changelog

### 2026

**2026-02-03:**
- README completely rewritten to reflect current product state
- Created TECHNICAL_REFERENCE.md for detailed documentation
- Identified 7 HOT leads ready for outreach

**2026-02-01:**
- Migrated hosting from Netlify to Cloudflare Pages
- Established local development environment in Cursor IDE
- Configured MCP servers for Supabase and Cloudflare API access
- Updated AI Development Guardrail Prompt

**2026-01-22:**
- Deployed €49 Detailed Compliance Risk Review product
- Created paid-review-checkout and paid-review-webhook Edge Functions
- Built multi-step intake form with access token verification

**2026-01-xx:**
- Added interested_in_accounting_services field to tax_checkup_leads
- Enhanced lead deduplication with submission_sequence tracking

### 2025

**2025-12-xx:**
- Tax Checkup Tool enhancements
- Make.com webhook integration for lead notifications
- Enhanced compliance scoring algorithm

**2025-11-10:**
- Created checkup_feedback table for accuracy tracking
- Added feedback collection UI to results page

**2025-11-06:**
- Launched Tax Checkup Tool
- Created tax_checkup_leads table with compliance scoring
- Built 5-step diagnostic wizard
- Implemented red/yellow/green flag system

**2025-11-01:**
- Created contact_requests table
- Purpose-based routing system
- Budget/timeline qualification fields

**2025-10-29:**
- Comprehensive RLS policy review and fixes
- Performance optimization with strategic indexes

**2025-10-26:**
- Created accounting_intakes table (30+ fields)
- Comprehensive freelancer/expat compliance data collection
- Status workflow: new → ready → missing_docs → in_review → claimed → completed

**2025-10-04:**
- Major strategic pivot: Accounting Desk as primary product
- Partner directory repositioned as secondary "Partner Hub"
- SEO metadata overhaul for accounting focus

**2025-10-01:**
- Created accountant_profiles, appointments, payouts, disputes tables
- Cal.com integration infrastructure
- Accountant role added to user_profiles

**2025-10-03:**
- Created leads_accounting table for early access signups
- Webhook trigger to Make.com

**2025-10-02:**
- Created resume storage bucket
- Fixed bucket policies for authenticated upload/download

**2025-09-30:**
- Initial README documentation created

**2025-08-27:**
- Partner notification webhook integration
- Automatic email to partners on new member signup

**2025-07-22:**
- Completed Stripe webhook integration
- Subscription status auto-updates on payment

**2025-07-21:**
- Cookie consent banner with GDPR compliance
- Granular cookie preferences

**2025-07-20:**
- Form wizard redesign with progress bar
- Multi-step validation with Zod schemas

**2025-07-19:**
- Initial partner directory implementation
- Category filtering and search

**2025-07-18:**
- Project initialization
- Supabase database setup
- Authentication system with email/password

---

**End of Technical Reference**
