# Accountant Application System - Complete Documentation

**Last Updated:** December 5, 2025
**Route:** `/join-accountants`
**Purpose:** Enable bilingual, OCC-certified accountants to apply to join Worktugal's partner network

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Context](#business-context)
3. [User Journey](#user-journey)
4. [Application Routes](#application-routes)
5. [Form Structure](#form-structure)
6. [Data Schema](#data-schema)
7. [Database Architecture](#database-architecture)
8. [Validation Rules](#validation-rules)
9. [File Upload System](#file-upload-system)
10. [UI/UX Content](#uiux-content)
11. [Technical Implementation](#technical-implementation)
12. [Admin Review Process](#admin-review-process)
13. [Future Considerations](#future-considerations)

---

## Executive Summary

The Accountant Application System allows qualified tax professionals to apply to join Worktugal's partner network. The system is designed to:

- **Attract bilingual accountants** fluent in English and Portuguese
- **Screen for OCC certification** (Ordem dos Contabilistas Certificados) but remain flexible for exceptional candidates
- **Capture comprehensive professional data** without revealing pricing structures or commission terms upfront
- **Enable asynchronous review** by the admin team with dedicated dashboard
- **Support unauthenticated submissions** to reduce friction for applicants

**Key Design Philosophy:**
- Low-friction application process (no account creation required)
- Transparent about "founding partner" opportunity without promising specific terms
- Flexible on OCC requirement to attract borderline qualified candidates
- Focus on values alignment ("Why Worktugal?") as much as technical qualifications

---

## Business Context

### Problem Being Solved
Portugal's growing expat and digital nomad population needs bilingual tax professionals who understand cross-border taxation. Most Portuguese accountants:
- Don't speak English fluently
- Aren't familiar with international client needs
- Don't market themselves online effectively

### Target Accountants
1. **Primary:** OCC-certified accountants with 2-5+ years experience
2. **Secondary:** Near-certification candidates pursuing OCC
3. **Language:** English fluent (B2-C2), Portuguese native/fluent
4. **Specializations:** Freelancer taxation (Categoria B), NHR applications, cross-border tax
5. **Availability:** Part-time (5-20 hours/week) to full-time

### Value Proposition to Accountants
- Pre-qualified client leads (no cold outreach needed)
- Set your own schedule and rates
- Transparent revenue sharing model (details shared post-approval)
- Focus on consulting, Worktugal handles marketing/ops
- "Founding partner" status = early mover advantage

### What We DON'T Disclose Yet
- Specific commission rates
- Platform fee structure
- Client pricing (they only ask "typical hourly rate" for market research)
- Revenue projections

---

## User Journey

### Entry Points
1. **Direct URL:** User navigates to `/join-accountants`
2. **Future:** Recruitment banner on main site (not yet implemented)
3. **Future:** Outreach campaigns to OCC-certified professionals

### Flow Stages

```
Landing on Form Page
        ↓
Review "Founding Partner" Value Props
        ↓
Fill 5-Section Application Form
        ↓
Upload Resume (PDF/DOC/DOCX)
        ↓
Agree to Professional Standards
        ↓
Submit (No Account Required)
        ↓
Success Page → Email Confirmation
        ↓
Admin Review (5 business days)
        ↓
Video Interview Invitation (if qualified)
        ↓
Onboarding & Profile Setup
```

### Time Investment
- **Form Completion:** ~10-15 minutes
- **Admin Review:** 5 business days (stated in UI)
- **Interview:** 15 minutes (video call)

---

## Application Routes

### Public Routes

| Route | Component | Auth Required | Purpose |
|-------|-----------|---------------|---------|
| `/join-accountants` | `AccountantApplicationForm` | No | Main application form |
| `/join-accountants/success` | `AccountantApplicationSuccess` | No | Post-submission confirmation |

### Admin Routes

| Route | Component | Auth Required | Role Required |
|-------|-----------|---------------|---------------|
| `/admin/accountant-applications` | `AccountantApplicationReview` | Yes | Admin |

### Navigation Links
- **Home Page:** (Future) Banner/CTA
- **Success Page → Home:** "Back to Home" button
- **Success Page → Tax Checkup:** "Try Tax Checkup" CTA

---

## Form Structure

### Section 1: Basic Information

**Visual:** Blue badge (number 1), "Basic Information" title

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Full Name | Text | Yes | Non-empty | "Your full name" |
| Email | Email | Yes | Valid email format | "your@email.com" |
| Phone | Tel | No | None | "+351 912 345 678" |
| LinkedIn Profile | URL | No | Valid URL format | "https://linkedin.com/in/yourprofile" |
| Website or Portfolio | URL | No | Valid URL format | "https://yourwebsite.com" |

**Helper Text:**
- LinkedIn: "Helps us understand your professional background"

---

### Section 2: Professional Credentials

**Visual:** Green badge (number 2), "Professional Credentials" title

| Field Name | Type | Required | Validation | Options/Notes |
|------------|------|----------|------------|---------------|
| Has OCC Certification | Checkbox | No (defaults to true) | None | Checked by default |
| OCC Number | Text | Conditional* | None | Only shown if "Has OCC" is checked |
| Experience Years | Select | Yes | Must select option | "Less than 1 year", "1-2 years", "2-5 years", "5-10 years", "10+ years" |
| English Proficiency | Select | Yes | Default: "fluent" | "Fluent (C1-C2)", "Advanced (B2)", "Intermediate (B1)", "Basic (A1-A2)" |
| Portuguese Proficiency | Select | No | Default: "native" | "Native", "Fluent (C1-C2)", "Advanced (B2)", "Intermediate (B1)" |
| Resume / CV | File Upload | Yes | PDF/DOC/DOCX, max 5MB | Dedicated upload component |

**Conditional Logic:**
- If OCC unchecked → Show warning: "OCC certification is preferred. We may consider exceptional candidates pursuing certification. Please explain your situation in the 'Why Worktugal?' section below."

---

### Section 3: Expertise & Services

**Visual:** Purple badge (number 3), "Expertise & Services" title

#### Specializations (Multi-Select Checkboxes)

**Label:** "Services You Provide" (Required, must select at least 1)

Options:
1. Freelancer/Self-employed taxation (Categoria B)
2. NHR (Non-Habitual Resident) applications
3. Corporate tax & company formation
4. VAT compliance & registration
5. Social Security (NISS) matters
6. Annual tax returns (IRS)
7. Cross-border taxation
8. Crypto & investment income
9. Rental property income
10. Tax optimization strategies

**UI Behavior:**
- Selected items: Blue background (`bg-blue-500/10`), blue border
- Unselected: Subtle border, hover effect

#### Bio Field

| Field Name | Type | Required | Validation | Rows |
|------------|------|----------|------------|------|
| About You & Your Experience | Textarea | No | None | 4 |

**Placeholder:** "Tell us about your professional background, areas of expertise, and what makes you a great fit for working with independent professionals..."

---

### Section 4: Availability & Pricing

**Visual:** Orange badge (number 4), "Availability & Pricing" title

| Field Name | Type | Required | Validation | Options/Notes |
|------------|------|----------|------------|---------------|
| Weekly Availability | Select | Yes | Must select | "5-10 hours per week", "10-20 hours per week", "20+ hours (part-time)", "Full-time availability" |
| Typical Hourly Rate | Number | No | Numeric | "€150" placeholder |

**Helper Text for Rate:**
"This helps us understand market rates and structure services appropriately"

**Important Note:** This field is for market research, NOT a commitment to specific pricing.

---

### Section 5: Why Worktugal?

**Visual:** Pink badge (number 5), "Why Worktugal?" title

| Field Name | Type | Required | Validation | Rows |
|------------|------|----------|------------|------|
| Why do you want to join? | Textarea | Yes | Min 50 characters | 5 |

**Placeholder:** "Share your motivation for joining, what you hope to achieve, and what makes you a great fit for our community of professionals..."

**Character Counter:** Shows live count: "Minimum 50 characters • {X} characters"

---

### Section 6: Professional Standards & Terms

**Visual:** Blue info box with CheckCircle icon

#### Standards Agreement Box

**Content:**
"By submitting this application, you confirm:"

- You hold necessary certifications and licenses to practice accounting in Portugal (or are actively pursuing them)
- You carry professional liability insurance covering your services
- You will comply with Portuguese tax law, GDPR, and professional standards
- You understand Worktugal facilitates client connections but does not employ accountants - you operate as an independent professional
- The information provided in this application is accurate and complete

**Warning:** "Note: False information may result in application rejection or termination of partnership."

#### Final Checkbox

| Field Name | Type | Required | Label |
|------------|------|----------|-------|
| Agree to Terms | Checkbox | Yes | "I have read and agree to the above professional standards and confirm that all information provided is accurate. *" |

---

### Submit Button

**Text:** "Submit Application"
**Loading State:** "Submitting Application..." with spinner
**Style:** Full-width, blue gradient, large text

**Post-Submit Message:**
"We review applications within 5 business days. Qualified candidates will be invited for a brief video interview."

---

## Data Schema

### TypeScript Interface (Frontend)

```typescript
interface AccountantApplicationData {
  full_name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  occ_number: string | null;
  has_occ: boolean;
  experience_years: string; // "1-2", "5-10", etc.
  english_fluency: string; // "fluent", "advanced", etc.
  portuguese_fluency: string; // "native", "fluent", etc.
  specializations: string[]; // Array of selected services
  bio: string;
  typical_hourly_rate: string | null;
  availability: string; // "5-10", "10-20", etc.
  why_worktugal: string;
  resume_file: File | null;
}
```

### Database Schema (PostgreSQL + Supabase)

```sql
CREATE TABLE accountant_applications (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

  -- Contact Info
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  linkedin_url text,
  website_url text,

  -- Professional Info
  bio text, -- Combines: bio + languages + availability + rate + why_worktugal
  experience_years integer,
  specializations text[] DEFAULT '{}',
  certifications jsonb DEFAULT '[]'::jsonb,

  -- Documents
  resume_url text,
  resume_path text,

  -- Application Status
  status application_status DEFAULT 'pending' NOT NULL,
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,

  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
```

### Application Status Enum

```sql
CREATE TYPE application_status AS ENUM (
  'pending',
  'reviewing',
  'interview_scheduled',
  'accepted',
  'rejected'
);
```

### Certifications JSONB Structure

```json
[
  {
    "name": "OCC",
    "number": "12345",
    "expiry": null
  }
]
```

### Bio Field Composition

The `bio` database field is a **composite string** that combines multiple form inputs:

```
{bio_text}

---
Languages: English ({english_fluency}), Portuguese ({portuguese_fluency})
Availability: {availability}
Typical Rate: €{typical_hourly_rate}/hour

---
Why Worktugal:
{why_worktugal}
```

**Example:**
```
I have 5 years of experience helping freelancers with Categoria B taxation...

---
Languages: English (fluent), Portuguese (native)
Availability: 10-20 hours per week
Typical Rate: €150/hour

---
Why Worktugal:
I want to help international professionals succeed in Portugal while growing my practice...
```

---

## Database Architecture

### Indexes

```sql
CREATE INDEX idx_applications_status ON accountant_applications(status);
CREATE INDEX idx_applications_email ON accountant_applications(email);
CREATE INDEX idx_applications_created_at ON accountant_applications(created_at DESC);
```

### Row Level Security (RLS)

**Enabled:** Yes

#### Policy 1: Public Application Submission
```sql
CREATE POLICY "Anyone can submit accountant application"
  ON accountant_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

**Purpose:** Allow unauthenticated applicants to submit (no friction)

#### Policy 2: Admin View Access
```sql
CREATE POLICY "Admins can view all applications"
  ON accountant_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
```

#### Policy 3: Admin Update Access
```sql
CREATE POLICY "Admins can update applications"
  ON accountant_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
```

### Storage Buckets

**Bucket Name:** `resumes`
**Path Structure:** `accountant_resumes/{sanitized_email}_{timestamp}_{filename}`
**Accepted Formats:** PDF, DOC, DOCX
**Max Size:** 5MB

**Example Path:**
```
accountant_resumes/john_doe_example_com_1733423456789_resume.pdf
```

---

## Validation Rules

### Client-Side Validation (Form Level)

| Field | Rule | Error Message |
|-------|------|---------------|
| Full Name | Non-empty string | "Full name is required" |
| Email | Non-empty + contains "@" | "Valid email is required" |
| Experience Years | Must select option | "Experience level is required" |
| Availability | Must select option | "Availability is required" |
| Specializations | At least 1 selected | "Please select at least one specialization" |
| Why Worktugal | Non-empty + min 50 chars | "Please provide more detail (minimum 50 characters)" |
| Agree to Terms | Must be checked | "You must agree to the terms" |

### Database Validation

- Email stored as **lowercase** and **trimmed**
- Experience years converted from string to integer (e.g., "5-10" → 10, "10+" → 10)
- Certifications array defaults to empty `[]` if no OCC number provided
- Timestamps automatically set via `DEFAULT now()`

---

## File Upload System

### Upload Flow

```
User selects file
       ↓
FileUpload component validates (size, format)
       ↓
File stored in form state
       ↓
On form submit → Upload to Supabase Storage
       ↓
Generate public URL
       ↓
Store both path & URL in database
       ↓
Complete application submission
```

### Technical Details

**Function:** `uploadFile()` from `src/lib/storage.ts`
**Target Bucket:** `resumes`
**Naming Convention:**
```typescript
const fileName = `accountant_resumes/${sanitizedEmail}_${timestamp}_${originalFilename}`;
```

**Return Values:**
```typescript
{
  data: {
    path: string,      // Storage path
    publicUrl: string  // Direct download URL
  },
  error: string | null
}
```

**Error Handling:**
- If upload fails → Show error, block submission
- Resume URL stored as `null` if upload unsuccessful

---

## UI/UX Content

### Hero Section

**Badge Text:** "Founding Partner Opportunity" (blue badge with Award icon)

**Headline:**
"Join Worktugal's Partner Network"

**Subheadline:**
"Help freelancers and independent professionals navigate Portuguese taxation while growing your practice."

**Description:**
"We're building a curated network of Portugal's best bilingual tax professionals. As a founding partner, you'll receive pre-qualified clients, set your own schedule, and earn competitive fees with transparent revenue sharing."

### Value Proposition Cards (3 Cards)

#### Card 1 - Pre-qualified Clients
- **Icon:** Briefcase (blue)
- **Title:** "Pre-qualified Clients"
- **Description:** "We handle lead generation and qualification"

#### Card 2 - Your Schedule
- **Icon:** Clock (green)
- **Title:** "Your Schedule"
- **Description:** "Set your own availability and rates"

#### Card 3 - Grow Your Practice
- **Icon:** Globe (purple)
- **Title:** "Grow Your Practice"
- **Description:** "Focus on clients, we handle the rest"

---

### Success Page Content

**Icon:** Large green CheckCircle with spring animation

**Headline:** "Application Received!"

**Subheadline:** "Thank you for your interest in joining Worktugal's partner network."

#### "What happens next?" Section

##### Step 1: Application Review
"Our team will review your application within 5 business days. We'll verify your credentials and assess your fit for our network."

##### Step 2: Interview Invitation
"If your application meets our criteria, we'll invite you for a brief 15-minute video interview to discuss the partnership opportunity."

##### Step 3: Onboarding & Activation
"Once approved, we'll guide you through onboarding, set up your profile, and connect you with your first clients."

#### Info Icons
- **Mail:** "Check your email for confirmation"
- **Calendar:** "Response within 5 business days"

#### CTAs
1. "Back to Home" (outline button)
2. "Try Tax Checkup" (blue gradient button)

#### Footer
"Questions? Contact us at partners@worktugal.com"

---

## Technical Implementation

### Component Architecture

```
AccountantApplicationForm.tsx (main form)
├── UI Components
│   ├── Button
│   ├── Input
│   ├── Alert
│   └── FileUpload
├── Data Layer
│   ├── submitAccountantApplication() from lib/accountantApplications.ts
│   └── uploadFile() from lib/storage.ts
└── Navigation
    └── useNavigate() to /join-accountants/success
```

### State Management

**Form State:** Local React state (`useState`)

```typescript
const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  phone: '',
  // ... all fields
  resumeFile: null as File | null,
  agreeToTerms: false,
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Form Submission Logic

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  // 1. Validate form
  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  setLoading(true);

  try {
    // 2. Submit application (includes file upload)
    const result = await submitAccountantApplication({
      full_name: formData.fullName,
      email: formData.email,
      // ... all fields
      resume_file: formData.resumeFile,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    // 3. Navigate to success page
    navigate('/join-accountants/success');
  } catch (err: any) {
    console.error('Error submitting application:', err);
    setError(err.message || 'Failed to submit application. Please try again.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    setLoading(false);
  }
};
```

### Animation Library

**Library:** Framer Motion

**Animation Effects:**
- Hero section: Fade in + slide up (`opacity: 0 → 1`, `y: 20 → 0`)
- Form sections: Staggered entrance
- Success page: CheckCircle spring animation
- Hover effects on specialization cards

---

## Admin Review Process

### Admin Dashboard Access

**Route:** `/admin/accountant-applications`
**Component:** `AccountantApplicationReview`
**Auth:** Admin role required

### Review Actions

1. **View Application Details**
   - Full name, email, contact info
   - Resume download link
   - LinkedIn/website links
   - Specializations and experience
   - Bio compilation (languages, rate, motivation)

2. **Change Status**
   - Pending → Reviewing
   - Reviewing → Interview Scheduled
   - Interview Scheduled → Accepted / Rejected

3. **Add Admin Notes**
   - Internal notes visible only to admins
   - Track follow-ups, concerns, interview outcomes

4. **Mark Reviewer**
   - Automatically stamps `reviewed_by` (admin user ID)
   - Timestamp `reviewed_at`

### Future Enhancements (Not Yet Built)

- Email notification triggers on status changes
- Calendar integration for interview scheduling
- Automated reference checks
- OCC number verification API
- Interview scorecard system

---

## Future Considerations

### Phase 2: Onboarding Flow

Once application is **accepted**, accountant needs:
1. **Profile Setup**
   - Professional photo
   - Detailed bio for client-facing profile
   - Service offerings & pricing
   - Availability calendar

2. **Banking Details**
   - IBAN, BIC, Tax ID
   - Payout preferences (SEPA, Wise, Revolut)

3. **Legal Agreements**
   - Partnership terms
   - Commission structure disclosure
   - GDPR compliance
   - Professional liability insurance proof

4. **Platform Training**
   - How client matching works
   - Using the appointment system
   - Document submission workflow
   - Dispute handling

### Phase 3: Accountant Portal

Approved accountants get access to:
- **Dashboard:** Upcoming appointments, earnings, client list
- **Calendar Integration:** Sync with Cal.com
- **Outcome Submissions:** Upload consultation reports
- **Payouts:** Track earnings and request payouts
- **Profile Management:** Update bio, specializations, availability

### Integration Points

| System | Purpose | Status |
|--------|---------|--------|
| Cal.com | Interview scheduling + client appointments | Webhooks configured |
| Make.com | Lead routing to Airtable | Configured for other flows |
| Email (Amazon SES) | Application confirmations, status updates | Needs setup for accountants |
| Stripe | Future: Accountant payout automation | Not yet implemented |

### Content Improvements

1. **Add FAQ Section**
   - "Do I need OCC certification?"
   - "What's the commission structure?"
   - "How are clients matched to accountants?"
   - "Can I work with my existing clients?"

2. **Success Stories**
   - Testimonials from early partners
   - Case studies of accountant success

3. **Recruitment Landing Page**
   - Separate from application form
   - More detailed benefits explanation
   - Video from founder

### Technical Debt

1. **Email Confirmations**
   - Currently no automated email sent on submission
   - Needs Amazon SES edge function

2. **Resume Virus Scanning**
   - No antivirus check on uploaded files
   - Consider ClamAV integration

3. **Duplicate Detection**
   - No check if email already applied
   - Should warn/block duplicate submissions

4. **Application Editing**
   - No way for applicant to update after submission
   - Consider magic link for edits

---

## Key Design Decisions

### Why No OCC Hard Requirement?

**Decision:** OCC checkbox defaults to "checked" but can be unchecked.

**Reasoning:**
- Portugal has excellent accountants without OCC pursuing certification
- English-fluent + tax experience is rarer than OCC certification
- Warning message sets expectation without blocking
- Exceptional candidates can explain in "Why Worktugal?" section

**Trade-off:** May get unqualified applicants, but worth it to avoid losing good borderline candidates.

---

### Why No Pricing Disclosure?

**Decision:** Don't reveal commission rates or client pricing in application.

**Reasoning:**
- Commission negotiable based on experience/volume
- Client pricing still being validated
- Prevents candidates from self-selecting out before interview
- "Typical hourly rate" question gathers market data without commitment

**Trade-off:** Some qualified candidates may drop off wanting transparency upfront.

---

### Why Unauthenticated Submissions?

**Decision:** Allow anonymous submissions (no Worktugal account required).

**Reasoning:**
- Reduces friction massively
- Accountants won't use platform until approved anyway
- Account creation can happen during onboarding
- Email is sufficient identifier

**Trade-off:** No built-in spam protection, potential for duplicate emails.

---

### Why Composite Bio Field?

**Decision:** Store multiple form fields in one database `bio` text column.

**Reasoning:**
- Simplifies initial schema (fewer columns)
- All narrative content in one place for admin review
- Reduces query complexity for admin dashboard
- Can be parsed/split later if needed

**Trade-off:** Harder to filter by individual sub-fields (e.g., "show only full-time available").

---

## Appendix: Field Mapping Reference

| Form Field | Database Column | Type | Transformation |
|------------|----------------|------|----------------|
| fullName | full_name | text | Direct |
| email | email | text | Lowercase + trim |
| phone | phone | text | Direct (nullable) |
| linkedinUrl | linkedin_url | text | Direct (nullable) |
| websiteUrl | website_url | text | Direct (nullable) |
| occNumber | certifications | jsonb | Wrapped in `{name: "OCC", number: X}` |
| hasOCC | certifications | jsonb | Determines if OCC object added |
| experienceYears | experience_years | integer | Parse string to int |
| englishFluency | bio | text | Embedded in bio composite |
| portugueseFluency | bio | text | Embedded in bio composite |
| specializations | specializations | text[] | Direct array |
| bio | bio | text | First section of composite |
| typicalHourlyRate | bio | text | Embedded in bio composite |
| availability | bio | text | Embedded in bio composite |
| whyWorktugal | bio | text | Final section of composite |
| resumeFile | resume_url, resume_path | text | Upload first, store URLs |
| agreeToTerms | N/A | N/A | Validation only, not stored |

---

## Contact & Maintenance

**Feature Owner:** Worktugal Core Team
**Admin Dashboard:** `/admin/accountant-applications`
**Support Email:** partners@worktugal.com

**Related Documentation:**
- [Accounting Desk Infrastructure](/docs/ACCOUNTING_DESK_INFRASTRUCTURE.md)
- [Accounting Desk Content Guide](/docs/ACCOUNTING_DESK_CONTENT_v1.0_LIVE_BOOKING.md)
- [Appointment Management System](/docs/SIGNUP_WEBHOOK_INTEGRATION.md)

---

**End of Documentation**
