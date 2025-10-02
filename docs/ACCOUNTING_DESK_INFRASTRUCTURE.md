# Accounting Desk Infrastructure - Complete Framework

## Overview

The accounting desk platform now has a comprehensive infrastructure supporting the full consultation lifecycle from booking through payment to accountant payouts. This framework is designed for low-risk, commission-based contractor relationships with Cal.com integration for scheduling.

## Database Schema

### Core Tables Created

#### 1. `accountant_profiles`
Stores accountant information with commission rates, bank details, and performance metrics.

**Key Fields:**
- Basic info: full_name, email, phone, bio
- Professional: specializations, certifications, languages
- Financial: commission_rate (default 65%), bank details (IBAN, BIC), tax_id
- Integration: cal_link, cal_api_key for Cal.com booking
- Stats: total_consultations, total_earnings, average_rating
- Status: active, inactive, pending_approval, suspended

**RLS Policies:**
- Accountants can view/update their own profile
- Admins can manage all profiles
- Clients can view active accountant profiles (public info only)

#### 2. `appointments`
Tracks all scheduled and completed consultations.

**Key Fields:**
- Relationships: client_id, accountant_id, submission_id
- Scheduling: cal_event_id, scheduled_date, duration_minutes
- Status: scheduled, completed, cancelled, no_show, rescheduled
- Consultation: meeting_url, meeting_notes, outcome_document_url
- Escrow: outcome_submitted_at, escrow_hold_until (48 hours), client_approved_at
- Financial: accountant_payout_amount, platform_fee_amount
- Feedback: client_rating (1-5), client_feedback

**48-Hour Escrow Flow:**
1. Accountant submits outcome document → `outcome_submitted_at` set
2. System sets `escrow_hold_until` = now + 48 hours
3. Client has 48 hours to dispute
4. After 48 hours, auto-approve → `client_approved_at` set
5. Admin can then process payout

**RLS Policies:**
- Clients see their appointments
- Accountants see their assigned appointments
- Admins see all appointments

#### 3. `payouts`
Tracks payments made to accountants for completed consultations.

**Key Fields:**
- References: accountant_id, appointment_id
- Payment: amount, currency (EUR), payout_method (wise/revolut/stripe/sepa)
- Status: pending, processing, completed, failed
- Tracking: payout_reference (transaction ID), bank_details_snapshot
- Audit: initiated_by, initiated_at, completed_at, failed_at

**Manual Payout Flow (Phase 1):**
1. Admin reviews appointments where escrow_hold_until has passed
2. Admin creates payout record (status: pending)
3. Admin manually transfers via Wise/Revolut/SEPA
4. Admin marks payout as completed with transaction reference

**RLS Policies:**
- Accountants see their own payouts
- Admins can create and manage all payouts

#### 4. `disputes`
Handles client disputes during 48-hour escrow period.

**Key Fields:**
- References: appointment_id, client_id, accountant_id
- Dispute: reason, status (open/investigating/resolved_refund/resolved_no_refund/closed)
- Resolution: resolution_notes, refund_amount, resolved_by, resolved_at

**RLS Policies:**
- Clients can create and view their disputes
- Accountants can view disputes about them
- Admins can manage all disputes

#### 5. `accountant_applications`
Stores applications from accountants wanting to join the platform.

**Key Fields:**
- Personal: full_name, email, phone
- Professional: experience_years, specializations, certifications
- Documents: resume_url, linkedin_url
- Application: status (pending/reviewing/interview_scheduled/accepted/rejected)
- Review: admin_notes, reviewed_by, reviewed_at

**RLS Policies:**
- Anyone (even unauthenticated) can submit application
- Only admins can view and manage applications

## TypeScript Types

All types defined in `/src/types/accountant.ts`:

```typescript
- AccountantProfile
- Appointment
- Payout
- Dispute
- AccountantApplication
- Various status enums and helper types
```

## Library Functions

### `/src/lib/accountants.ts`
- `getAccountantProfile()` - Get accountant by ID
- `getAllActiveAccountants()` - List active accountants
- `updateAccountantProfile()` - Update accountant info
- `createAccountantProfile()` - Create new accountant
- `submitAccountantApplication()` - Public application submission
- `getAllApplications()` - Admin: view all applications
- `updateApplicationStatus()` - Admin: review applications
- `getAccountantStats()` - Calculate earnings and ratings
- `updateAccountantStats()` - Refresh accountant metrics

### `/src/lib/appointments.ts`
- `createAppointment()` - Create new appointment (from booking)
- `getAppointment()` - Get appointment by ID
- `getClientAppointments()` - Client's appointment list
- `getAccountantAppointments()` - Accountant's appointment list
- `getAllAppointments()` - Admin: all appointments
- `updateAppointment()` - Update appointment details
- `markAppointmentCompleted()` - Mark consultation as done
- `submitOutcomeDocument()` - Accountant uploads outcome (starts escrow)
- `approveAppointment()` - Manual approval (ends escrow early)
- `getAppointmentsReadyForPayout()` - List where escrow period ended
- `assignAccountant()` - Admin assigns accountant to booking
- `rateAppointment()` - Client rates consultation
- `createDispute()` - Client disputes outcome
- `getDisputesByAppointment()` - View disputes for appointment
- `getAllDisputes()` - Admin: all disputes
- `resolveDispute()` - Admin resolves dispute

### `/src/lib/payouts.ts`
- `createPayout()` - Admin initiates payout
- `getAccountantPayouts()` - Accountant's payout history
- `getAllPayouts()` - Admin: all payouts
- `getPendingPayouts()` - Admin: payouts awaiting processing
- `updatePayoutStatus()` - Update payout status
- `markPayoutCompleted()` - Mark payout as paid
- `markPayoutFailed()` - Handle failed payout
- `getAccountantPendingEarnings()` - Amount in escrow
- `getAccountantCompletedEarnings()` - Total paid to date
- `calculatePayoutSplit()` - Split amount by commission rate
- `getPayoutsByDateRange()` - Filter payouts by date
- `getTotalPayoutsByStatus()` - Aggregate payout totals
- `addPayoutNotes()` - Add admin notes to payout

## User Interface Components

### Client-Facing

#### `/src/components/client/ClientDashboard.tsx`
Client dashboard showing:
- Quick actions (book consultation, view FAQ, see pricing)
- Resources (Portal das Finanças, Segurança Social links)
- Support contact information
- Case tracker (reuses existing CaseTracker component)

**Route:** `/dashboard`

### Accountant-Facing

#### `/src/components/accountant/AccountantApplicationPage.tsx`
Public application form for accountants to join the platform.

**Features:**
- 2-step application process
- Basic info: name, email, phone, experience, bio
- Expertise: specializations (multi-select), certifications (add multiple)
- Resume and LinkedIn URL fields
- Saves to `accountant_applications` table

**Route:** `/join-accountant`

#### `/src/components/accountant/AccountantDashboard.tsx`
Accountant's main workspace.

**Features:**
- Earnings summary: pending (in escrow), completed payouts
- Upcoming consultations with meeting links
- Recent completed consultations with ratings
- Statistics: total consultations, average rating
- Direct access to Cal.com for scheduling

**Route:** `/accountant/dashboard`

### Admin-Facing

#### `/src/components/admin/AdminDashboard.tsx`
Admin control panel for platform management.

**Features:**
- Key metrics: scheduled consultations, platform revenue, pending payouts, pending applications
- Recent appointments list with status
- Pending actions widget highlighting:
  - Payouts awaiting processing
  - Accountant applications to review
- Quick navigation to detailed management pages

**Route:** `/admin`

## Routes Added to App.tsx

```typescript
/join-accountant          → AccountantApplicationPage (public)
/accountant/dashboard     → AccountantDashboard (accountant role)
/dashboard                → ClientDashboard (authenticated clients)
/admin                    → AdminDashboard (admin role)
```

## Commission-Based Payment Model

### Structure
- **Accountant receives:** 60-65% (configurable per accountant)
- **Platform keeps:** 35-40%
- **Payment method:** Manual (Wise, Revolut, SEPA, Stripe) in Phase 1

### Example Calculation
```
Triage Consult: €59
- Accountant (65%): €38.35
- Platform (35%): €20.65

Start Pack: €349
- Accountant (65%): €226.85
- Platform (35%): €122.15
```

### Risk Mitigation
- **No-show protection:** Auto-refund if accountant doesn't attend
- **Quality protection:** 48-hour dispute window for clients
- **Accountant protection:** Guaranteed payment after 48 hours if no valid dispute
- **Platform protection:** Funds held in your Stripe account until approved

## Cal.com Integration Strategy

### Setup (via Make.com)
1. Each accountant gets their own Cal.com booking page
2. Store `cal_link` in accountant profile
3. When client books, Cal.com webhook fires
4. Make.com catches webhook and creates appointment record in Supabase
5. Store `cal_event_id` for linking

### Webhook Payload to Store
```json
{
  "cal_event_id": "evt_abc123",
  "scheduled_date": "2025-10-15T10:00:00Z",
  "duration_minutes": 30,
  "meeting_url": "https://cal.com/meet/xyz",
  "client_email": "client@example.com"
}
```

### Make.com Scenarios Needed
1. **Cal.com → Create Appointment**
   - Trigger: Cal.com booking webhook
   - Action: Insert into appointments table
   - Data: Map cal_event_id, scheduled_date, meeting_url

2. **Escrow Timer**
   - Trigger: Outcome document uploaded
   - Wait: 48 hours
   - Action: Set client_approved_at if no dispute

3. **Reminder Emails**
   - Trigger: 24 hours before appointment
   - Action: Email client and accountant

## Next Steps for Implementation

### Immediate (This Week)
1. **Cal.com Setup**
   - Create Cal.com account for first accountant
   - Set up webhook to trigger Make.com
   - Test appointment creation flow

2. **Make.com Scenarios**
   - Build Cal.com webhook → Supabase integration
   - Create automated email reminders
   - Set up escrow timer automation

3. **First Accountant Onboarding**
   - Use admin panel to create accountant profile
   - Set commission rate (start with 65%)
   - Add their Cal.com link
   - Test end-to-end booking flow

### Phase 1 (Months 1-3) - Manual Operations
- Manually assign accountants to bookings
- Manually process payouts via Wise/Revolut
- Handle disputes manually through admin panel
- Track everything in Supabase for later automation

### Phase 2 (Months 3-6) - Semi-Automation
- Auto-assign accountants based on availability
- Use Stripe Payouts API for automatic transfers
- One-click payout approval in admin panel
- Automated dispute escalation emails

### Phase 3 (Month 6+) - Full Automation
- Migrate to Stripe Connect for instant payouts
- Automatic split payments (you get 35%, they get 65%)
- AI-powered accountant matching
- Mobile app for accountants

## Security Considerations

### Row Level Security (RLS)
All tables have comprehensive RLS policies ensuring:
- Clients only see their own appointments and disputes
- Accountants only see their assigned appointments and payouts
- Admins have full access to manage the platform
- Public can apply to be accountants but not view applications

### Sensitive Data
- Bank details (IBAN, BIC) stored in accountant profiles
- NIF numbers stored in consultation intake forms
- All data encrypted at rest by Supabase
- Cal.com API keys stored securely per accountant

### Payment Security
- Funds held in your Stripe account (you're the merchant of record)
- Payouts tracked with transaction references for audit trail
- Bank details snapshot taken at time of payout (immutable record)

## Testing Checklist

Before going live:
- [ ] Test accountant application submission
- [ ] Test Cal.com webhook creating appointment
- [ ] Test outcome document upload starting escrow timer
- [ ] Test 48-hour auto-approval after escrow
- [ ] Test dispute creation and resolution
- [ ] Test manual payout creation and completion
- [ ] Test client dashboard showing appointments
- [ ] Test accountant dashboard showing earnings
- [ ] Test admin dashboard showing all data
- [ ] Verify RLS policies prevent unauthorized access

## Maintenance & Monitoring

### Daily
- Check pending payouts and process within 24 hours
- Monitor dispute queue for new issues
- Review new accountant applications

### Weekly
- Reconcile payouts with bank transfers
- Review accountant performance metrics
- Analyze consultation completion rates

### Monthly
- Calculate platform revenue
- Review commission rates for adjustments
- Plan accountant recruitment if demand exceeds capacity

## Documentation for Your Team

### For Accountants
Create onboarding guide covering:
- How to set up Cal.com calendar
- How to access dashboard at /accountant/dashboard
- How to upload outcome documents
- How to track earnings and payouts
- Payment timeline (48 hours + processing time)

### For Admins
Create operations manual covering:
- How to review and approve accountant applications
- How to assign accountants to bookings
- How to process payouts manually
- How to handle disputes
- How to monitor platform health

### For Clients
Update FAQ with:
- How consultations are scheduled via Cal.com
- What happens during 48-hour escrow period
- How to dispute a consultation outcome
- How to rate and provide feedback

## Support & Troubleshooting

### Common Issues

**Accountant doesn't receive payout:**
- Check payout status in admin dashboard
- Verify bank details are correct in accountant profile
- Confirm transaction reference from Wise/Revolut
- Update payout status to 'completed' once confirmed

**Cal.com webhook not creating appointment:**
- Check Make.com scenario execution log
- Verify webhook URL is correct in Cal.com settings
- Test manually with sample payload
- Check Supabase logs for insert errors

**Client can't see consultation:**
- Verify appointment.client_id matches user.id
- Check RLS policies are enabled
- Test query directly in Supabase SQL editor
- Check authentication token is valid

## Resources

- Cal.com API Documentation: https://cal.com/docs/api-reference
- Make.com Webhook Triggers: https://www.make.com/en/help/tools/webhooks
- Supabase RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
- Stripe Payouts API: https://stripe.com/docs/payouts

---

**Built with:** Supabase PostgreSQL, React, TypeScript, Tailwind CSS
**Last Updated:** October 2025
