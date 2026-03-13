# Claude Cowork Handoff

Use this as the copy/paste prompt for Claude/Cowork in Chrome.

## Mission

Take the local project at:

`/Users/johnconstantine/Documents/New project/personal-financial-planning`

and turn it into a standalone production app with:

- its own GitHub repository
- a Supabase project and schema
- Vercel deployment
- environment variables configured
- authentication and persistence wired to Supabase
- updated docs for local development and deployment

The product is no longer an estate-planning calculator. It is now a lifecycle-planning application called **Legacy Life Cycle Studio** that helps people think through life seasons and difficult transitions using:

- season of life
- worldview
- work/livelihood
- passions
- future vision
- important life background
- scenario-based prompts such as:
  - "I don't know when to retire"
  - "I don't know what I need to do with my spare time"
  - "My spouse just died, what should be my focus now?"

## Context

This repo is already a functional Vite/React/TypeScript app. The new UX and logic are already implemented locally.

Important files:

- `src/pages/Index.tsx`
- `src/pages/Blueprint.tsx`
- `src/pages/Assessment.tsx`
- `src/pages/Recommendations.tsx`
- `src/data/lifecycle.ts`
- `src/lib/lifecycleEngine.ts`
- `src/lib/lifecycleProfile.ts`
- `src/components/LifecycleVisualizer.tsx`
- `src/components/PdfLibrary.tsx`
- `public/legacy-lifecycle/*`

There is also an older Supabase integration and migration from the previous concept:

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `supabase/config.toml`
- `supabase/migrations/20260210122021_ebd6e295-4633-4fe1-a640-ad4e5fc7ca73.sql`

Do not treat the old assessment schema as the final model. It can be left in place if needed, but the deployed app should support the new lifecycle product.

## What To Do

### 1. Create a standalone GitHub repo

- Create a new GitHub repository for this app.
- Good default repo name: `legacy-life-cycle-studio`
- Push the current local codebase into that repository.
- Make the repo clean and standalone:
  - update `README.md`
  - remove Lovable-specific placeholder language
  - document local setup, env vars, build, test, deploy
  - include `.env.example`

### 2. Create and wire a Supabase project

- Create a new Supabase project for this app.
- Use email/password auth.
- Configure site URL and redirect URL for the eventual Vercel domain.
- Create an additive migration for the new product model.

Recommended schema:

#### `public.profiles`

Keep as the auth-linked user profile table, but make sure it supports:

- `id uuid primary key references auth.users(id)`
- `full_name text`
- `phone text`
- `email text`
- timestamps

#### `public.lifecycle_profiles`

One saved lifecycle profile per user, with support for multiple profiles later.

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `label text default 'Primary profile'`
- `age integer not null`
- `worldview text not null`
- `preferred_layout text not null`
- `background_summary text`
- `occupation text`
- `passions text`
- `future_vision text`
- `energy integer not null default 3`
- `transition_confidence integer not null default 3`
- `priorities text[] not null default '{}'`
- `selected_domains text[] not null default '{}'`
- `horizon text not null`
- `notes text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `public.scenario_sessions`

Persist scenario runs for later review.

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `lifecycle_profile_id uuid references public.lifecycle_profiles(id) on delete cascade`
- `title text`
- `scenario text not null`
- `guidance jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### 3. Apply RLS correctly

For every user-owned table:

- enable row level security
- allow users to select/insert/update/delete only their own rows
- keep helper functions only if needed

### 4. Regenerate Supabase client types

Update:

- `src/integrations/supabase/types.ts`

so the frontend matches the actual schema.

### 5. Replace localStorage-only persistence with Supabase-backed persistence

The app currently stores profile data locally. Change that so:

- authenticated users can save and load their lifecycle profile
- authenticated users can save scenario sessions
- unauthenticated users can still explore locally if that is simpler, but the saved mode should work once signed in

Minimum product behavior:

- sign up / sign in works
- a signed-in user can save their lifecycle profile
- a signed-in user can revisit and load their saved data
- a signed-in user can save at least one scenario session

### 6. Keep Vercel deployment simple

- Frontend-only Vite deployment on Vercel
- set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- production build must pass on Vercel

### 7. Improve repo readiness

Add or update:

- `README.md`
- `.env.example`
- deployment notes
- app name/title metadata if needed
- any required auth redirect documentation

### 8. Final verification before calling it done

Run locally:

- `npm install`
- `npm run lint`
- `npm run test`
- `npm run build`

Then verify the deployed Vercel app manually in browser.

## Product Acceptance Criteria

The app is only done if all of the following are true:

1. The code is in a standalone GitHub repository.
2. The app is deployed on Vercel and reachable with a live URL.
3. Supabase auth works.
4. Supabase persistence works for lifecycle profiles.
5. Supabase persistence works for scenario sessions.
6. The current lifecycle UX remains intact.
7. The PDF assets still load.
8. The repo includes a clear README and `.env.example`.
9. No placeholder branding remains from the old estate-planning concept.

## Implementation Guidance

- Prefer additive migrations over destructive changes unless absolutely necessary.
- If old tables remain, make sure the new app is clearly built around `lifecycle_profiles` and `scenario_sessions`.
- Keep the current styling and UX direction unless a change is necessary for data persistence or auth flow.
- If you need to add protected routes or save/load states, do it cleanly and minimally.
- Keep the app deployable as a static frontend that talks directly to Supabase.

## Expected Deliverables Back To Me

When finished, return:

1. GitHub repository URL
2. Vercel production URL
3. Supabase project URL
4. The exact env vars used by the frontend, with secret values redacted if needed
5. A short summary of schema changes
6. A short summary of frontend persistence/auth changes
7. Any known limitations

## QA Handoff For Codex

After deployment is finished, give Codex:

1. The live Vercel URL
2. A test account email/password, or explicit instructions for how sign-in should be tested
3. A list of the key flows expected to work

Codex will then perform QA against the deployed system.

## Exact Task Prompt

Copy everything below into Claude if you want a compact operator prompt instead of the full brief:

---

Take the local project at `/Users/johnconstantine/Documents/New project/personal-financial-planning` and turn it into a standalone production app called **Legacy Life Cycle Studio**. Create a new GitHub repo, create a new Supabase project, create and apply a new migration for the lifecycle product, wire auth and persistence into the existing React app, deploy it to Vercel, configure frontend env vars, update the README and `.env.example`, and verify the deployed app.

The current frontend already implements the product UX. Key files are `src/pages/Index.tsx`, `src/pages/Blueprint.tsx`, `src/pages/Assessment.tsx`, `src/pages/Recommendations.tsx`, `src/data/lifecycle.ts`, `src/lib/lifecycleEngine.ts`, and `src/components/*`.

Use Supabase for:

- auth
- saving lifecycle profiles
- saving scenario sessions

Recommended new tables:

- `public.lifecycle_profiles`
- `public.scenario_sessions`

Keep proper RLS so users can only access their own data.

The app must support storing:

- age
- worldview
- preferred layout
- background summary
- occupation
- passions
- future vision
- energy
- transition confidence
- priorities
- selected domains
- horizon
- notes
- scenario text

When done, return:

1. GitHub repo URL
2. Vercel URL
3. Supabase URL
4. summary of schema changes
5. summary of frontend auth/persistence changes
6. test credentials or sign-in instructions

Do not stop at partial setup. Finish the full deployment path and verify it works.

---
