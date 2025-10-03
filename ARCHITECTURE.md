# Worktugal Platform Architecture

## Overview

Worktugal is a dual-purpose platform serving remote workers and expats in Portugal:
1. **Perk Marketplace** - Directory of local business discounts and perks
2. **Accounting Desk** - Tax consultation services with Portuguese accountants

**Tech Stack:**
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Payments**: Stripe (Checkout + Webhooks)
- **Automation**: Make.com (webhooks for booking confirmations)

---

## Project Structure

```
src/
├── components/          # React components
│   ├── accounting/      # Accounting Desk feature
│   ├── accountant/      # Accountant portal
│   ├── admin/          # Admin dashboard
│   ├── auth/           # Login, signup, password reset
│   ├── client/         # Client dashboard
│   ├── forms/          # Multi-step forms
│   └── ui/             # Reusable UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Business logic & API calls
├── types/              # TypeScript type definitions
├── utils/              # Helper functions & constants
└── stripe-config.ts    # Stripe product definitions

supabase/
├── functions/          # Edge Functions (serverless)
│   ├── stripe-checkout/    # Create Stripe sessions
│   ├── stripe-webhook/     # Handle payment events
│   ├── calcom-webhook/     # Handle booking events
│   └── verify-session/     # Auth verification
└── migrations/         # Database schema changes
```

---

## Core Features

### 1. Perk Marketplace

**User Journey:**
1. Browse approved perks in directory (no login required)
2. Sign up/login to access redemption details
3. View perk details with redemption instructions

**Partner Journey:**
1. Submit business + perk info via multi-step form
2. Pay €49 for lifetime listing
3. Wait for admin approval
4. Perk appears in public directory

**Key Files:**
- `components/PerksDirectory.tsx` - Main directory with filtering
- `components/FormWizard.tsx` - Partner submission flow
- `components/forms/` - Business, Perk, Payment forms
- `lib/submissions.ts` - API calls for partner data

### 2. Accounting Desk

**Client Journey:**
1. Browse consultation services (Tax Triage, Annual Return, Freelancer Start)
2. Book consultation and submit intake form
3. Pay via Stripe
4. Receive confirmation email (via Make.com)
5. Get matched with accountant
6. Attend consultation via Cal.com

**Accountant Journey:**
1. Apply via application form
2. Admin reviews and approves
3. Account auto-created with standard password
4. View assigned consultations in dashboard
5. Complete consultation and submit notes
6. Receive payout after admin verification

**Key Files:**
- `components/accounting/` - All accounting desk components
- `components/accountant/` - Accountant portal
- `components/admin/` - Admin review & management
- `lib/accountants.ts` - Accountant management
- `lib/appointments.ts` - Consultation booking
- `lib/consults.ts` - Consultation data
- `lib/payouts.ts` - Payout management

---

## Database Schema

### Core Tables

**user_profiles**
- Stores user info and role (client, partner, accountant, admin)
- Linked to Supabase Auth users

**partner_submissions**
- Business and perk information from partners
- Status: pending_payment → completed_payment → approved/rejected
- Links to stripe_orders

**consult_bookings**
- Client booking requests for consultations
- Contains intake form data
- Status: pending → completed_payment → pending_assignment

**appointments**
- Matched consultations between clients and accountants
- Contains payment distribution (platform fee vs accountant payout)
- Status: pending_assignment → scheduled → completed → paid_out

**accountant_profiles**
- Accountant details, specializations, ratings
- Tracks total earnings and consultations

**accountant_applications**
- New accountant applications awaiting admin review

**payouts**
- Records of payments to accountants
- Tracks platform fees and accountant earnings

**stripe_customers**
- Maps Supabase users to Stripe customer IDs

**stripe_orders**
- Records of completed payments
- Links to partner_submissions or consult_bookings

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access:
- Their own data (user_id match)
- Public approved content (perks)
- Role-based access (admin sees everything, accountants see their assignments)

---

## Authentication Flow

1. User signs up with email/password (no email verification required)
2. Supabase creates auth user + user_profiles record
3. `useAuth` hook manages session state globally
4. `ProtectedRoute` components guard authenticated pages
5. Session persists in localStorage (automatic by Supabase)

**Key Files:**
- `lib/auth.ts` - Auth functions (signup, login, logout)
- `hooks/useAuth.ts` - Central auth state hook
- `components/ProtectedRoute.tsx` - Route guard

---

## Payment Flow

### Partner Listing Payment

1. Partner submits form → creates partner_submissions (status: pending_payment)
2. Payment form calls stripe-checkout Edge Function
3. Stripe creates checkout session
4. User redirects to Stripe, completes payment
5. Stripe webhook updates partner_submissions (status: completed_payment)
6. Stripe webhook updates user role to "partner"
7. User redirected to success page

### Consultation Payment

1. Client books consultation → creates consult_bookings (status: pending)
2. Intake form submitted → status: pending_payment
3. Payment triggers stripe-checkout Edge Function
4. After payment, webhook creates appointments record
5. Webhook calculates: payment_amount, platform_fee (30%), accountant_payout (70%)
6. Status: pending_assignment (awaits admin to assign accountant)

**Key Files:**
- `supabase/functions/stripe-checkout/` - Create sessions
- `supabase/functions/stripe-webhook/` - Handle payment events
- `lib/stripe.ts` - Frontend Stripe calls
- `stripe-config.ts` - Product definitions

---

## Edge Functions

### stripe-checkout
- Creates Stripe checkout sessions
- Handles both one-time payments and subscriptions
- Creates/retrieves Stripe customer
- Adds metadata for tracking (submission_id, payment_type)

### stripe-webhook
- Listens for Stripe payment events
- Updates partner_submissions or consult_bookings
- Creates appointments for consultations
- Calculates platform fees and payouts
- Updates user roles

### calcom-webhook
- Receives booking confirmations from Cal.com
- Updates appointment records with booking details

### verify-session
- Validates user session for secure operations

**Important:** All Edge Functions include CORS headers for cross-origin requests.

---

## State Management

**No Redux or Zustand** - Uses React built-ins:
- `useState` for component state
- `useEffect` for side effects
- `useContext` for global state (cookies, auth)
- Custom hooks for shared logic

**Key Hooks:**
- `useAuth()` - Current user and session
- `useUserProfile()` - User profile data with display name
- `useUserPurchases()` - Purchase history
- `useSubscription()` - Subscription status
- `useFormData()` - Multi-step form state

---

## Data Fetching Pattern

All API calls follow this pattern:

```typescript
// In lib/ files
export const fetchSomething = async () => {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('field', value);

  if (error) throw error;
  return { data, error: null };
};

// In components
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      const result = await fetchSomething();
      setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [dependencies]);
```

---

## Environment Variables

Required in `.env`:
```bash
# Supabase
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Public anon key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=  # Public key for checkout

# Stripe Price IDs (from Stripe Dashboard)
VITE_STRIPE_PRICE_TRIAGE=
VITE_STRIPE_PRICE_START_PACK=
VITE_STRIPE_PRICE_ANNUAL_RETURN=

# Accountant Onboarding
VITE_ACCOUNTANT_DEFAULT_PASSWORD=  # Standard password for new accountants
```

**Edge Function Environment (auto-configured in Supabase):**
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

---

## User Roles

**client** (default)
- Browse perks
- Book consultations
- View purchase history

**partner**
- All client permissions
- Submit business to perk directory
- Access partner dashboard (future)

**accountant**
- View assigned consultations
- Submit consultation notes
- Track earnings

**admin**
- Approve/reject partner submissions
- Approve/reject accountant applications
- Assign consultations to accountants
- Manage payouts
- View all platform data

---

## Deployment

**Frontend:** Netlify (auto-deploy from main branch)
- Build command: `npm run build`
- Publish directory: `dist`

**Backend:** Supabase (hosted PostgreSQL + Edge Functions)
- Database migrations applied via Supabase CLI or dashboard
- Edge Functions deployed via MCP tools

**DNS & Routing:**
- All routes handled by React Router (SPA)
- `_redirects` file for Netlify SPA support

---

## Third-Party Integrations

**Stripe**
- Purpose: Payment processing
- Webhook: `supabase/functions/stripe-webhook`
- Events: checkout.session.completed, payment_intent.succeeded

**Make.com**
- Purpose: Send consultation confirmation emails
- Trigger: After successful payment
- Data: Client email, consultation type, booking details

**Cal.com** (future integration)
- Purpose: Video consultation scheduling
- Webhook: `supabase/functions/calcom-webhook`

---

## Security Considerations

1. **Environment Variables:** Never commit .env file
2. **RLS Policies:** All tables have strict access control
3. **API Keys:** Use anon key on frontend, service role only in Edge Functions
4. **Passwords:** Hashed by Supabase Auth (bcrypt)
5. **CORS:** Edge Functions allow all origins (production should restrict)
6. **Data Validation:** TypeScript + Zod schema validation in forms

---

## Common Tasks

### Add a New Product
1. Create product in Stripe Dashboard → get Price ID
2. Add to `stripe-config.ts` STRIPE_PRODUCTS
3. Update payment forms to include new product
4. Test checkout flow

### Add a New Database Table
1. Create migration file: `supabase/migrations/YYYYMMDD_description.sql`
2. Define table structure, RLS policies, indexes
3. Add TypeScript types to `src/types/`
4. Create API functions in `src/lib/`

### Deploy Edge Function Changes
1. Modify function in `supabase/functions/[name]/`
2. Use MCP tools to deploy: `mcp__supabase__deploy_edge_function`
3. Test with Stripe webhook or API calls

### Update Accountant Default Password
1. Change value in `.env` file
2. Update environment variable in production
3. Password used only for new accountant accounts

---

## Troubleshooting

**Build Warnings:**
- Run `npx update-browserslist-db@latest` to update browser compatibility data

**Authentication Issues:**
- Check Supabase dashboard for user records
- Verify .env variables are loaded
- Clear browser localStorage and retry

**Payment Not Processing:**
- Check Stripe webhook logs in Supabase dashboard
- Verify webhook secret matches Stripe dashboard
- Check stripe_orders table for order creation

**RLS Errors:**
- Verify user is authenticated
- Check RLS policies in Supabase SQL editor
- Ensure user_id matches auth.uid()

---

## Future Enhancements

- [ ] Automated email notifications (SendGrid integration)
- [ ] Partner dashboard for tracking perk performance
- [ ] Accountant calendar sync with Cal.com
- [ ] Multi-language support (PT/EN)
- [ ] Mobile app (React Native)
- [ ] Review and rating system
- [ ] Advanced search and filtering
- [ ] Analytics dashboard for admins
- [ ] Automated payout processing
- [ ] Subscription plans for partners

---

## Getting Help

When asking AI tools (Claude, bolt.new) for help:
1. Reference this architecture document
2. Specify which feature you're working on
3. Mention the relevant files from the structure above
4. Include any error messages or logs

For database questions, provide:
- Table name
- RLS policy intent
- User role context

For payment issues, provide:
- Stripe webhook logs
- stripe_orders table data
- User's purchase history
