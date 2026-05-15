# Job Review Queue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Job Review Queue where employer submissions create inactive (`is_active: false`) jobs for manual review.

**Architecture:**
- **Frontend:** Expand `/jobs/post` to collect 7 fields (Company, Title, Location, RemoteType, EmploymentType, Salary, ApplyUrl).
- **Edge Function (`create-job-posting-checkout`):** Pass these fields into Stripe session metadata.
- **Webhook Function (`stripe-webhook`):** Update webhook to map these 7 fields from Stripe metadata to Supabase and force `is_active: false`.
- **Review:** Admin uses Supabase Dashboard to toggle `is_active: true`.

**Tech Stack:** React, TypeScript, Vite, Supabase Edge Functions, Stripe Checkout.

---

### Task 1: Update Edge Function (`create-job-posting-checkout`)

**Files:**
- Modify: `supabase/functions/create-job-posting-checkout/index.ts`

- [ ] **Step 1: Read Edge Function**
  - `read` `/home/vandevo/projects/worktugal-app/worktugal-app/supabase/functions/create-job-posting-checkout/index.ts`

- [ ] **Step 2: Update Stripe Metadata**
  - Add mapping for new fields in `stripe.checkout.sessions.create` metadata.

- [ ] **Step 3: Commit**
  - `git add supabase/functions/create-job-posting-checkout/index.ts`
  - `git commit -m "feat: edge function passes 7 fields to stripe metadata"`

---

### Task 2: Update Webhook Functions (`stripe-webhook` variants)

**Files:**
- Modify: `supabase/functions/stripe-webhook/index.ts`
- Modify: `supabase/functions/stripe-webhook-live/index.ts`
- Modify: `supabase/functions/stripe-webhook-test/index.ts`

- [ ] **Step 1: Read Webhook**
  - `read` `/home/vandevo/projects/worktugal-app/worktugal-app/supabase/functions/stripe-webhook/index.ts`

- [ ] **Step 2: Update Supabase Insert**
  - Map new fields from `session.metadata` to `ai_jobs` table insert.
  - Set `is_active: false`.

- [ ] **Step 3: Apply to all variants**
  - Repeat for `stripe-webhook-live` and `stripe-webhook-test`.

- [ ] **Step 4: Commit**
  - `git add supabase/functions/stripe-webhook*`
  - `git commit -m "feat: webhook function maps 7 fields and sets is_active: false"`

---

### Task 3: Update Frontend Form (`JobPostPage.tsx`)

**Files:**
- Modify: `src/pages/JobPostPage.tsx`

- [ ] **Step 1: Read Frontend Form**
  - `read` `/home/vandevo/projects/worktugal-app/worktugal-app/src/pages/JobPostPage.tsx`

- [ ] **Step 2: Add Form Fields**
  - Add inputs/selects for: Remote type (Select), Employment type (Select), Salary min/max (Number/Currency).
  - Update `handleSubmit` to send new state to `create-job-posting-checkout`.

- [ ] **Step 3: Build & Commit**
  - `npm run build`
  - `git add src/pages/JobPostPage.tsx`
  - `git commit -m "feat: expand job posting form to 7 fields"`
  - `git push origin main`

---

### Task 4: Verification

- [ ] **Step 1: End-to-end Test**
  - Submit a test job via `/jobs/post`.
  - Verify in Supabase table that `is_active` is `false`.
  - Flip `is_active` to `true` in Supabase dashboard.
  - Verify job appears on `/jobs`.
