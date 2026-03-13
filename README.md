# Legacy Life Cycle Studio

A lifecycle-planning application that helps people think through life seasons and difficult transitions using season of life, worldview, work, passions, future vision, and scenario-based prompts.

## What it does

The app guides users through a lifecycle profiler that captures their age, worldview, occupation, passions, future vision, background, energy, priorities, and a real-life situation they are navigating. It then generates a personalized roadmap with focus areas, reflection prompts, and scenario-specific guidance for situations like retirement, grief, caregiving, purpose, and reinvention.

## Tech stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (auth, database, RLS)
- **Deployment**: Vercel

## Local development

```bash
# Clone the repository
git clone https://github.com/jconstantine618/legacy-life-cycle-studio.git
cd legacy-life-cycle-studio

# Install dependencies
npm install

# Copy env vars and fill in your Supabase credentials
cp .env.example .env

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run preview` | Preview production build locally |

## Supabase schema

The app uses three main tables:

- **`profiles`** — Auth-linked user profile (auto-created on signup)
- **`lifecycle_profiles`** — Saved lifecycle profile data (age, worldview, priorities, domains, scenario, etc.)
- **`scenario_sessions`** — Persisted scenario runs for later review

All tables use Row Level Security so users can only access their own data.

## Deployment

The app deploys as a static Vite frontend on Vercel. Set the two environment variables in your Vercel project settings, and Vercel will build and deploy automatically on push to `main`.

### Supabase configuration

After creating your Supabase project:

1. Run the migrations in `supabase/migrations/` against your project
2. Enable email/password auth in Authentication > Providers
3. Set the Site URL and Redirect URLs in Authentication > URL Configuration to include your Vercel domain

## Project structure

```
src/
  components/    # UI components (Layout, LifecycleVisualizer, PdfLibrary, etc.)
  contexts/      # AuthContext
  data/          # Lifecycle data model, seasons, domains, scenarios
  hooks/         # Custom React hooks (useLifecycleProfile, useScenarioSessions)
  integrations/  # Supabase client and types
  lib/           # Lifecycle engine, profile persistence
  pages/         # Route pages (Index, Blueprint, Assessment, Recommendations, Auth)
public/
  legacy-lifecycle/  # PDF reference assets
supabase/
  migrations/        # SQL migrations
```
