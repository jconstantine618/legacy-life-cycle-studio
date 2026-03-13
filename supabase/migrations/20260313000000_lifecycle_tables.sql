-- Lifecycle profiles table
CREATE TABLE IF NOT EXISTS public.lifecycle_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Primary profile',
  age INTEGER NOT NULL,
  worldview TEXT NOT NULL,
  preferred_layout TEXT NOT NULL,
  background_summary TEXT,
  occupation TEXT,
  passions TEXT,
  future_vision TEXT,
  energy INTEGER NOT NULL DEFAULT 3,
  transition_confidence INTEGER NOT NULL DEFAULT 3,
  priorities TEXT[] NOT NULL DEFAULT '{}',
  selected_domains TEXT[] NOT NULL DEFAULT '{}',
  horizon TEXT NOT NULL,
  notes TEXT,
  scenario TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lifecycle_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lifecycle profiles"
  ON public.lifecycle_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lifecycle profiles"
  ON public.lifecycle_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lifecycle profiles"
  ON public.lifecycle_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lifecycle profiles"
  ON public.lifecycle_profiles FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_lifecycle_profiles_updated_at
  BEFORE UPDATE ON public.lifecycle_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Scenario sessions table
CREATE TABLE IF NOT EXISTS public.scenario_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lifecycle_profile_id UUID REFERENCES public.lifecycle_profiles(id) ON DELETE CASCADE,
  title TEXT,
  scenario TEXT NOT NULL,
  guidance JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scenario_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scenario sessions"
  ON public.scenario_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scenario sessions"
  ON public.scenario_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scenario sessions"
  ON public.scenario_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scenario sessions"
  ON public.scenario_sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_scenario_sessions_updated_at
  BEFORE UPDATE ON public.scenario_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
