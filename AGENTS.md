# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Worktugal is a React 18 + TypeScript SPA (Vite) for tax compliance readiness for foreign freelancers in Portugal. No backend server runs locally — the frontend talks directly to **Supabase Cloud** and **Stripe**. See `README.md` for the full product description and tech stack.

### Running the app

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint (note: codebase has ~188 pre-existing lint errors, mostly `no-unused-vars` and `no-explicit-any`) |
| `npm run preview` | Preview production build |

### Environment variables

A `.env` file is required at the repo root with at least:
- `VITE_SUPABASE_URL` — Supabase project URL (project ID: `jbmfneyofhqlwnnfuqbd`)
- `VITE_SUPABASE_ANON_KEY` — Supabase public anon key

Without valid Supabase credentials, the app UI renders but all data-fetching and auth calls will fail. The Supabase client (`src/lib/supabase.ts`) throws at import time if these env vars are empty strings.

### Key caveats

- **No automated tests exist** in this repository. There are no test frameworks configured and no test files.
- **No Docker or docker-compose** — everything runs via `npm` commands.
- **Edge Functions** (`supabase/functions/`) are Deno-based and deployed to Supabase Cloud — they are not run locally.
- **Git submodule** `prompts/` (public repo) is optional; update via `npm run update:prompts`.
- **Lint has pre-existing errors** (~188 errors, 12 warnings) that are part of the existing codebase.
