# Worktugal App — Claude Context

Compliance risk detection platform for remote professionals and expats in Portugal. Diagnostic engine surfaces hidden tax, visa, and social security traps before they become penalties.

Full VanOS context in `~/.claude/CLAUDE.md` and `/home/vandevo/CLAUDE.md`. Do not repeat identity or core laws here.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + clsx + tailwind-merge |
| Routing | React Router DOM |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Auth + DB | Supabase (Google OAuth, PostgreSQL) |
| Payments | Stripe (live: €29/mo Founding Member subscription wired) |
| Hosting | Cloudflare Pages |
| Email | Resend (transactional) + Listmonk (campaigns) |

## Source Structure

```
src/
  components/
    compliance/   B2B compliance intelligence landing page
    diagnostic/   compliance risk diagnostic form + results
    accounting/   accountant application + consult booking
    admin/        admin management UI
  pages/        route-level components (includes LoginPage)
  hooks/        custom React hooks
  lib/          supabase client, stripe checkout utility
  contexts/     auth context
  types/        TypeScript types
  utils/        helpers
supabase/
  migrations/   DB schema history
  functions/    edge functions (stripe-checkout, stripe-webhook)
```

---

## Product Status

| Product | Status | Notes |
|---|---|---|
| Compliance Risk Diagnostic | Live `/diagnostic` | 13-question free tool, lead gen |
| My Account Dashboard | Live `/dashboard` | Signed-in users only |
| Google Sign-In | Live | Supabase OAuth |
| B2B Compliance Intelligence | Live `/compliance` | Landing page + Founding Member outreach |
| Portugal Clarity Call (149 EUR) | Paused | Cal.com not wired |
| Paid Risk Scan (29 EUR) | Deferred | Stripe not wired yet |
| B2B Founding Member (€29/mo) | Wired | Stripe checkout live on `/compliance`, awaiting validation |
| AI Blog | Planned | `/blog` shows coming soon |

---

## Project Rules

- Always use Context7 before touching Supabase, Stripe, or Vite config.
- Design system: Emerald Zenith theme (`prompts/knowledge/emerald-zenith-theme.md` via vault).
- No WordPress. No over-engineering. Ship the single-feature MVP first.
- DB migrations go in `supabase/migrations/` — never raw SQL in production.
- `.env` is never committed. Use `.env.example` as the reference.
