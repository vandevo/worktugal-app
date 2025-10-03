# Worktugal - Quick Start Guide

## For Non-Developers

This guide helps you understand your platform and work effectively with AI tools.

---

## Your Platform in Simple Terms

**Worktugal has two main parts:**

### 1. Perk Marketplace 🎫
Local Portuguese businesses offer discounts to your users. Businesses pay €49 to be listed forever.

**Flow:**
- Business submits their info → Pays €49 → You approve → Appears in directory

### 2. Accounting Desk 💼
Portuguese accountants help expats with taxes. Clients pay for consultations (€59-€349).

**Flow:**
- Client books consultation → Pays → Gets matched with accountant → Has video call → Accountant gets paid (you keep 30%)

---

## Important Files to Know

### Documentation (Read These First!)
- **ARCHITECTURE.md** - How everything works (read this!)
- **PHASE1_IMPROVEMENTS.md** - Recent code improvements
- **README.md** - Project setup instructions
- **This file (QUICK_START.md)** - You are here!

### Configuration Files
- **.env** - Secret keys and settings (NEVER commit to GitHub!)
- **.env.example** - Template showing what .env needs
- **src/stripe-config.ts** - Product prices and Stripe IDs

### Where Features Live
```
src/
├── components/
│   ├── accounting/        ← Accounting Desk (consultations)
│   ├── accountant/        ← Accountant portal
│   ├── admin/             ← Your admin dashboard
│   ├── auth/              ← Login, signup, password reset
│   └── forms/             ← Partner submission forms
├── lib/                   ← Business logic (how things work)
├── types/                 ← TypeScript definitions
└── hooks/                 ← Reusable React logic
```

---

## Working with AI (Claude, bolt.new)

### Best Practices

**✅ DO:**
- Reference ARCHITECTURE.md: "Check the Payment Flow section in ARCHITECTURE.md"
- Be specific: "In the Accounting Desk booking form..."
- Mention files: "Update src/components/accounting/ConsultBookingForm.tsx"
- Ask for explanations: "Explain how the perk approval process works"

**❌ DON'T:**
- Say "fix the code" without context
- Assume AI knows your business rules
- Skip reading ARCHITECTURE.md first
- Make changes without understanding

### Example Good Prompts

```
"Look at ARCHITECTURE.md to understand the partner submission flow.
I want to add a new field for 'business hours' to the partner form."
```

```
"The Accounting Desk consultation booking is in
src/components/accounting/ConsultBookingForm.tsx.
I want to add a dropdown for preferred consultation language (English/Portuguese)."
```

```
"Read the Database Schema section in ARCHITECTURE.md.
I need a report showing all consultations from the past month."
```

---

## Environment Variables (.env)

**CRITICAL:** Never share your .env file or commit it to GitHub!

Your `.env` file should have:
```bash
# Supabase (database & backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Stripe Product IDs (from Stripe Dashboard)
VITE_STRIPE_PRICE_TRIAGE=price_xxxxx
VITE_STRIPE_PRICE_START_PACK=price_xxxxx
VITE_STRIPE_PRICE_ANNUAL_RETURN=price_xxxxx

# Accountant default password
VITE_ACCOUNTANT_DEFAULT_PASSWORD=Worktugal2025!
```

**Where to find these:**
- Supabase: https://app.supabase.com → Your Project → Settings → API
- Stripe: https://dashboard.stripe.com → Developers → API Keys
- Price IDs: https://dashboard.stripe.com → Products → Copy Price ID

---

## Common Tasks

### Add a New Consultation Service

1. **Create in Stripe:**
   - Go to Stripe Dashboard → Products → Create Product
   - Set price and copy the Price ID

2. **Update Code:**
   - Add to `src/stripe-config.ts`:
   ```typescript
   'New Service Name': {
     id: 'prod_xxxxx',
     priceId: 'price_xxxxx',  // From Stripe
     description: 'What this service does',
     price: 99.00,
     currency: 'eur',
     mode: 'payment'
   }
   ```

3. **Update Forms:**
   - Tell AI: "Add 'New Service Name' to the consultation booking form"

4. **Test:**
   - Try booking the new service
   - Complete payment
   - Check it appears in admin dashboard

### Change Consultation Prices

1. **In Stripe Dashboard:**
   - Products → Your Product → Add New Price
   - Archive old price
   - Copy new Price ID

2. **In Code:**
   - Update `src/stripe-config.ts`
   - Change `priceId` and `price` values

3. **In Environment:**
   - Update `.env` with new price ID
   - Deploy changes

### Approve a Partner Submission

1. Go to: https://yoursite.com/admin (when built)
2. Review submission details
3. Click "Approve" or "Reject"
4. If approved, perk appears in public directory immediately

### Create a New Accountant Account

1. Review application in admin dashboard
2. Click "Approve"
3. System creates account automatically with standard password
4. Copy credentials and send to accountant
5. Accountant logs in and changes password

---

## Understanding Your Dashboard

### Admin Dashboard Shows:
- **Consultations:** Scheduled vs completed
- **Revenue:** Platform earnings (30% of each consultation)
- **Pending Payouts:** Money owed to accountants
- **Applications:** New accountant applications to review

### Partner Dashboard (Future):
- Perk views
- Redemptions tracked
- Customer engagement

### Accountant Dashboard Shows:
- Assigned consultations
- Upcoming appointments
- Earnings history
- Client notes

---

## Database (Supabase)

Your data lives in Supabase PostgreSQL tables:

**Main Tables:**
- `user_profiles` - All users (clients, partners, accountants)
- `partner_submissions` - Business perk submissions
- `consult_bookings` - Consultation booking requests
- `appointments` - Scheduled consultations
- `accountant_profiles` - Accountant details
- `payouts` - Payment records

**To view data:**
1. Go to https://app.supabase.com
2. Select your project
3. Click "Table Editor"
4. Browse tables

**Security:** Row Level Security (RLS) ensures users only see their own data.

---

## Payments (Stripe)

### How Money Flows

**Partner Listing (€49):**
1. Partner pays €49
2. Stripe takes ~2%
3. You keep ~€48
4. Partner gets lifetime listing

**Consultation (e.g., €59):**
1. Client pays €59
2. Stripe takes ~2% (€1.18)
3. Platform keeps 30% (€17.70)
4. Accountant gets 70% (€41.30)
5. You manually pay accountant after consultation

### Webhook Setup

Stripe sends payment confirmations to:
`https://your-supabase-url/functions/v1/stripe-webhook`

**To configure:**
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint with your Supabase function URL
3. Select events: `checkout.session.completed`
4. Copy webhook secret to Supabase environment

---

## Troubleshooting

### "Build failed"
- Run: `npm install`
- Check for typos in recent code changes
- Ask AI: "The build is failing with error [paste error]"

### "Payment not processing"
- Check Stripe webhook logs in Supabase
- Verify Stripe secret key in Supabase environment
- Check stripe_orders table in database

### "User can't log in"
- Check Supabase Auth logs
- Verify user exists in user_profiles table
- Check browser console for errors

### "Perk not showing in directory"
- Verify status is 'approved' in partner_submissions table
- Check browser console for errors
- Clear cache and refresh

### "Lost or confused?"
- Read ARCHITECTURE.md
- Check this file (QUICK_START.md)
- Ask AI with specific details: file names, error messages, what you were trying to do

---

## Deployment

**When code is ready:**
1. Commit to GitHub (main branch)
2. Netlify auto-builds and deploys
3. Takes ~3-5 minutes
4. Check https://yoursite.com

**If something breaks:**
1. Check Netlify deploy logs
2. Rollback in Netlify dashboard
3. Fix issue locally
4. Redeploy

---

## Getting Help from AI

### Include This Context:
1. What you're trying to do
2. Relevant files (from structure above)
3. Any error messages
4. Reference to ARCHITECTURE.md section

### Example:
```
"I'm trying to add a 'business description' field to the partner submission form.
The form is in src/components/forms/BusinessForm.tsx.
Check the Partner Marketplace section in ARCHITECTURE.md for context.
I need it to be required and max 500 characters."
```

---

## Key Concepts

**Supabase** = Your database + backend (like AWS but easier)
**Stripe** = Payment processing (like PayPal but for businesses)
**Edge Functions** = Serverless code that runs on Supabase
**RLS** = Row Level Security (users can only see their data)
**Webhook** = Automated notification when something happens (e.g., payment)
**TypeScript** = JavaScript with type checking (catches bugs early)

---

## Resources

### Your Documentation:
- ARCHITECTURE.md - Complete platform guide
- PHASE1_IMPROVEMENTS.md - Recent changes
- .env.example - Environment setup template

### External:
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- React Docs: https://react.dev

### Support:
- Ask AI with context from ARCHITECTURE.md
- Check Supabase dashboard for errors
- Review Stripe dashboard for payment issues
- Check browser console for frontend errors (F12)

---

## Remember

✅ Always read ARCHITECTURE.md when working on new features
✅ Test changes locally before deploying
✅ Never commit .env file
✅ Ask AI specific questions with file references
✅ Keep backups before major changes

❌ Don't change database directly without migrations
❌ Don't hardcode secrets in code
❌ Don't deploy without testing
❌ Don't skip reading documentation

---

**You're all set!** Start with ARCHITECTURE.md to understand your platform, then use this guide for day-to-day tasks.
