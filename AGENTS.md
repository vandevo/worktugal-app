# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Worktugal is a React 18 + TypeScript SPA (Vite 5) for freelancer tax compliance in Portugal. The entire backend is **Supabase Cloud** (managed PostgreSQL + Edge Functions) — there is no local backend to run.

### Running the app

- **Dev server**: `npm run dev` (Vite, default port 5173)
- **Build**: `npm run build` (output in `dist/`)
- **Lint**: `npm run lint` (ESLint; pre-existing warnings/errors are expected — do not fix them unless the user requests it)

### Environment variables

A `.env` file is required in the project root with at least:

```
VITE_SUPABASE_URL=https://jbmfneyofhqlwnnfuqbd.supabase.co
VITE_SUPABASE_ANON_KEY=<real anon key>
```

Without the real `VITE_SUPABASE_ANON_KEY`, the frontend renders but any Supabase-dependent features (form submissions, auth, data fetching) will fail at runtime. The Supabase URL is public and documented in the README.

### Gotchas

- `src/lib/supabase.ts` throws at module load if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are empty/undefined. A placeholder value prevents the throw but API calls will return 401.
- The lint target (`npm run lint`) exits with a non-zero code due to ~200 pre-existing issues (mostly `no-unused-vars` and `no-explicit-any`). This is normal for this codebase.
- Edge Functions under `supabase/functions/` are Deno-based and deployed to Supabase Cloud. They are not runnable locally without the Supabase CLI and project secrets.
- There are no automated tests (no test framework or test files).
- The `prompts/` directory is a git submodule (`vandevo/prompt-secret-vault`). It is optional and not needed for the app to run.
