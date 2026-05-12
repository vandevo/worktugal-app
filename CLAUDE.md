# Worktugal App — Claude Context

AI jobs board for remote professionals and expats in Europe. Compliance risk diagnostic as a secondary free lead magnet. Jobs board is the primary revenue engine (EUR 49 per listing from employers).

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
| Payments | Stripe (live: €29/mo Founding Member subscription wired, EUR 49 job posting checkout wired) |
| Hosting | Cloudflare Pages |
| Email | Resend (transactional) + Listmonk (campaigns) |

## Source Structure

```
src/
  components/
    compliance/   B2B compliance intelligence landing page
    diagnostic/   compliance risk diagnostic form + results
    jobs/         JobCard component (logo via Logokit, seniority badges)
    radar/        B2C compliance radar landing page (email capture + Google OAuth)
    accounting/   accountant application + consult booking
    admin/        admin management UI
  pages/        route-level components (JobsPage, LoginPage)
  hooks/        custom React hooks
  lib/          supabase client, stripe checkout utility
  contexts/     auth context
  types/        TypeScript types
  utils/        helpers
supabase/
  migrations/   DB schema history
  functions/    edge functions (stripe-checkout, stripe-webhook, ghost-member-webhook)
```

---

## Product Status

| Product | Status | Notes |
|---|---|---|---|
| AI Jobs Board | Live `/jobs` | Primary revenue engine. 545+ EU-eligible jobs. EUR 49 self-serve checkout at `/jobs/post`. 12 AI companies. JobBoard mode design (Ashby-style). |
| Compliance Risk Diagnostic | Live `/diagnostic` | 13-question free tool, lead gen |
| My Account Dashboard | Live `/dashboard` | Signed-in users only |
| Google Sign-In | Live | Supabase OAuth |
| Portugal Radar | Live `/radar` | Maintained, no active development. EUR 5/mo. |
| Compliance Monitor (Parallel AI) | Live | 2 daily monitors → n8n → Supabase → Telegram + email + weekly digest |
| AI Blog | Live | Ghost CMS at blog.worktugal.com. Content API public (read-only). |

---

## Vault Context

**Session index (load this first):** `prompt-secret-vault/prompts/knowledge/worktugal-session-index.md`

The session index lists every relevant strategy, research, feature, and design file with one-line descriptions and a loading guide by task. Load it at session start instead of hunting across the vault individually.

| Task | Load from vault |
|---|---|
| UI / frontend | `emerald-zenith-theme.md` |
| New feature | `worktugal-app-features.md` + `worktugal-platform-strategy.md` |
| Strategy / product | `worktugal-platform-strategy.md` + `worktugal-strategy-2026.md` + `worktugal-focus-rails.md` |
| Phase 0 execution | `worktugal-phase0-plan.md` |
| Email flows | `resend-email-system.md` |
| Secrets | `api-secrets-os.md` |
| n8n workflows | `n8n-agent-manual.md` (vault) — workflow IDs, secrets locations, sandbox limits |
| Research | `resources/research/INDEX.md` |

---

## Project Rules

- Always use Context7 before touching Supabase, Stripe, or Vite config.
| Design system: | Emerald Zenith v1.2 — Plus Jakarta Sans headlines, Inter body, font-bold (700) headings, forest green (#0F3D2E) primary, emerald (#10B981) accent |
- No WordPress. No over-engineering. Ship the single-feature MVP first.
- DB migrations go in `supabase/migrations/` — never raw SQL in production.
- `.env` is never committed. Use `.env.example` as the reference.
- **Changelog:** After shipping a major feature, redesign, or pivot, insert a new entry into `project_changelog` (via Supabase SQL or the MCP tool). Keep titles and details user-facing — no internal tech names, services, or stack details. Version format: `v{major}.{minor}`. Entries show on `/changelog`.
