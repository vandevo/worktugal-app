---
name: Ship v2.6 Full Free Results
overview: Remove the paywall on the results page so all triggered traps are visible for free (including legal basis, penalty ranges, and source citations). Reposition the clarity call CTA as "personalized action plan" not "content unlock". Then push to production.
todos:
  - id: remove-paywall
    content: "In DiagnosticResults.tsx: remove FREE_TRAP_LIMIT, show all traps free including legal basis, penalty ranges, source citations. Remove the locked blur teaser section."
    status: completed
  - id: update-cta-copy
    content: "Update clarity call CTA copy: headline and 'what you get' list to reflect call = action plan, not content unlock. Remove the 'full trap breakdown' bullet since that is now free."
    status: completed
  - id: archive-plan
    content: "Update diagnostic_engine_v2_rebuild.plan.md: bump version to 2.6, mark relevant todos complete, note paywall removal decision."
    status: completed
  - id: push-production
    content: git push origin main after Van confirms Cloudflare env var and Cal.com payment are set.
    status: in_progress
isProject: false
---

# Ship v2.6: Full Free Results + Deploy

## What is actually changing

The results page already has the clarity call CTA built and wired (lines 358-443 of `DiagnosticResults.tsx`). The only blocker to shipping is:

1. The free tier only shows 2 traps (`FREE_TRAP_LIMIT = 2`, line 49) -- all others are locked behind a blur wall
2. The locked traps tease a "pay to unlock" model that contradicts the 149 EUR call (users think the call is to see the rest, not to act on what they see)
3. The call CTA copy says "walk through your risks with an expert" which is vague -- it should say "tell you exactly what to do about your specific situation"
4. The `VITE_CLARITY_CALL_URL` needs to be set in Cloudflare Pages env vars before push

## Changes

### 1. `src/components/diagnostic/DiagnosticResults.tsx`

- Remove `FREE_TRAP_LIMIT = 2` and the `isPaid` gate on trap visibility
- Show all traps to all users, including legal basis, penalty range, and source citations (currently only shown when `isPaid`)
- Remove the locked traps blur teaser section (lines 321-337)
- Remove the `isPaid` condition on the "Showing X of Y" subtitle text
- Update call CTA headline from "Walk Through Your Risks With an Expert" to something that makes clear the call is about action, not information
- Update the "What you get" list item "Full trap breakdown with legal citations" -- that is now free, replace with "Referral to vetted tax advisor or immigration lawyer if needed" or "Post-call follow-up with your personal action checklist"
- Keep the sticky bottom bar exactly as is -- it works

### 2. No other code changes

The Make.com webhook, the questions, the engine, the form, the homepage -- nothing else changes. The plan constraint is explicit: no new features before deploy.

## What stays deferred

- 29 EUR Stripe scan (Layer 2, after 5+ calls)
- Admin panel
- Parallel.ai monitors
- Content / SEO
- Gulf corridor positioning

## Deploy sequence (manual steps Van must do first)

Before pushing:

- Cloudflare Pages dashboard: add `VITE_CLARITY_CALL_URL=https://cal.com/worktugal/clarity-call` to production env vars
- Cal.com: enable 149 EUR Stripe payment on the event type, update description with the copy from the v2.5 handover

After push:

- Submit one test diagnostic on production, verify Make.com fires
- Redetermine webhook data structure in Make.com scenario 7985938 Module 1
- Send Luma email to 1,253 subs

## Files changing

- `[src/components/diagnostic/DiagnosticResults.tsx](src/components/diagnostic/DiagnosticResults.tsx)` -- the only file

## Why this is the right move

The current model asks users to trust you with 149 EUR before they have seen their full results. Reversing that -- show everything, then offer the call for the action plan -- is the trust-first conversion model. The research confirms it: "Expats spend money only when fear spikes." A user who sees all 4 of their triggered traps, with penalty ranges, is more scared and more likely to book than a user who sees 2 traps and a blur wall.