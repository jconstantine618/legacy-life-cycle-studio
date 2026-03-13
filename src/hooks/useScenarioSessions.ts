import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { LifecycleRoadmap } from "@/lib/lifecycleEngine";

export interface ScenarioSession {
  id: string;
  title: string | null;
  scenario: string;
  guidance: LifecycleRoadmap["scenarioGuidance"] | null;
  lifecycleProfileId: string | null;
  createdAt: string;
}

export function useScenarioSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ScenarioSession[]>([]);
  const [loading, setLoading] = useState(false);

  // Load sessions when user is available
  useEffect(() => {
    if (!user) {
      setSessions([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("scenario_sessions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (cancelled) return;

      if (!error && data) {
        setSessions(
          data.map((row) => ({
            id: row.id,
            title: row.title,
            scenario: row.scenario,
            guidance: row.guidance as ScenarioSession["guidance"],
            lifecycleProfileId: row.lifecycle_profile_id,
            createdAt: row.created_at,
          })),
        );
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  /** Save a new scenario session. */
  const saveSession = useCallback(
    async (params: {
      scenario: string;
      guidance: LifecycleRoadmap["scenarioGuidance"];
      lifecycleProfileId?: string | null;
      title?: string;
    }) => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("scenario_sessions")
        .insert({
          user_id: user.id,
          scenario: params.scenario,
          guidance: params.guidance as unknown as Record<string, unknown>,
          lifecycle_profile_id: params.lifecycleProfileId ?? null,
          title: params.title ?? params.guidance.label,
        })
        .select("id")
        .single();

      if (!error && data) {
        // Refresh sessions list
        const { data: refreshed } = await supabase
          .from("scenario_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (refreshed) {
          setSessions(
            refreshed.map((row) => ({
              id: row.id,
              title: row.title,
              scenario: row.scenario,
              guidance: row.guidance as ScenarioSession["guidance"],
              lifecycleProfileId: row.lifecycle_profile_id,
              createdAt: row.created_at,
            })),
          );
        }

        return data.id;
      }

      return null;
    },
    [user],
  );

  return {
    sessions,
    loading,
    saveSession,
    isAuthenticated: !!user,
  };
}
