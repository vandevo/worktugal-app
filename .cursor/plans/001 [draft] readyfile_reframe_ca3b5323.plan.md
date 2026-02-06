---
name: Readyfile Reframe
overview: Reframe the paid compliance flow into Readyfile with copy updates and a simple Ready/Blocked/Escalate status summary UI, while keeping Stripe, Supabase, and Make.com flows unchanged.
todos:
  - id: readyfile-copy
    content: Update paid flow copy to Readyfile language
    status: pending
  - id: readyfile-status-ui
    content: Add Ready/Blocked/Escalate status summary UI
    status: pending
  - id: readyfile-home-cta
    content: Update Home page CTA wording to Readyfile
    status: pending
isProject: false
---

## Plan: Readyfile Reframe (Copy + Status UI)

### Goals

- Reframe all paid-flow copy to Readyfile language without changing Stripe, Supabase, or Make.com integrations.
- Add a lightweight Ready/Blocked/Escalate status summary UI based on existing intake data (no DB schema changes).
- Keep the current €49 checkout and flows intact.

### Scope and Safety

- **Safe for current stack:** changes are front-end copy and UI only. No backend, Stripe, Supabase, or Make.com changes.
- **No schema changes:** use existing `paid_compliance_reviews` data and existing client-side calculations for status.

### Files to Update

- [c:\Worktugal apps\worktugal-app\src\components\accounting\PaidReviewLanding.tsx](c:\Worktugal apps\worktugal-app\src\components\accounting\PaidReviewLanding.tsx)
- [c:\Worktugal apps\worktugal-app\src\components\accounting\PaidReviewIntakeForm.tsx](c:\Worktugal apps\worktugal-app\src\components\accounting\PaidReviewIntakeForm.tsx)
- [c:\Worktugal apps\worktugal-app\src\components\accounting\PaidReviewSuccess.tsx](c:\Worktugal apps\worktugal-app\src\components\accounting\PaidReviewSuccess.tsx)
- [c:\Worktugal apps\worktugal-app\src\components\HomePage.tsx](c:\Worktugal apps\worktugal-app\src\components\HomePage.tsx)
- Optional: any shared UI copy in paid-flow components if discovered during edits.

### Implementation Steps

1. **Landing page copy reframe**
  - Update `PaidReviewLanding` titles, subtitles, feature bullets, FAQ, and CTA text to Readyfile terminology.
  - Keep pricing, Stripe checkout, and routes unchanged.
2. **Paid intake copy reframe + status summary UI**
  - Rename intake labels and section language from “review” to “Readyfile.”
  - Add a small status summary panel (Ready/Blocked/Escalate) using existing `calculateEscalationFlags` and `calculateAmbiguityScore` results. This is a UI-only status derived from current form data.
3. **Success screen copy reframe**
  - Update confirmation copy to “Readyfile submitted” and adjust “what happens next” language.
4. **Home page CTA language**
  - Replace “compliance review” messaging with “Readyfile” messaging, keeping routing to `/compliance-review` unchanged.
5. **Verify no integration impact**
  - Confirm Stripe product ID lookup remains unchanged (no name-based breaking changes).
  - Confirm Make.com and Supabase endpoints are untouched.

### Testing

- Smoke test UI routes:
  - `/` (Home)
  - `/compliance-review` landing
  - Paid flow intake steps
  - Success page
- Ensure checkout still starts normally.

### Rollback

- Revert copy and UI changes in the same files if needed. No data migrations or config changes involved.

### Notes on Safety

- This is safe and reversible because it is front-end copy plus a derived status UI only. No backend, schema, or automation changes.

