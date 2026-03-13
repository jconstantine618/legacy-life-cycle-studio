import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { LifecycleProfile } from "@/lib/lifecycleEngine";
import {
  defaultLifecycleProfile,
  loadLifecycleProfile as loadFromLocalStorage,
  saveLifecycleProfile as saveToLocalStorage,
} from "@/lib/lifecycleProfile";

/** Map between the camelCase frontend model and the snake_case DB columns. */
function toDbRow(profile: LifecycleProfile, userId: string) {
  return {
    user_id: userId,
    age: profile.age,
    worldview: profile.worldview,
    preferred_layout: "circle", // keep for DB compat
    background_summary: JSON.stringify({
      workEnjoysMost: profile.workEnjoysMost,
      restEnjoysMost: profile.restEnjoysMost,
    }),
    occupation: profile.occupation,
    passions: profile.selectedActivities.join(","),
    future_vision: "",
    energy: Math.round(
      Object.values(profile.scores).reduce((a, b) => a + b, 0) /
        Math.max(1, Object.values(profile.scores).length),
    ),
    transition_confidence: 3,
    priorities: Object.entries(profile.scores)
      .filter(([, v]) => v <= 4)
      .map(([k]) => k),
    selected_domains: [],
    horizon: "12_months",
    notes: JSON.stringify({
      expectedLifespan: profile.expectedLifespan,
      scores: profile.scores,
      selectedActivities: profile.selectedActivities,
    }),
    scenario: "",
  };
}

function fromDbRow(row: Record<string, unknown>): LifecycleProfile {
  let notesData: Record<string, unknown> = {};
  let bgData: Record<string, unknown> = {};

  try {
    if (typeof row.notes === "string" && row.notes.startsWith("{")) {
      notesData = JSON.parse(row.notes);
    }
  } catch { /* ignore */ }

  try {
    if (typeof row.background_summary === "string" && row.background_summary.startsWith("{")) {
      bgData = JSON.parse(row.background_summary);
    }
  } catch { /* ignore */ }

  return {
    age: (row.age as number) ?? defaultLifecycleProfile.age,
    expectedLifespan: (notesData.expectedLifespan as number) ?? defaultLifecycleProfile.expectedLifespan,
    worldview: (row.worldview as LifecycleProfile["worldview"]) ?? defaultLifecycleProfile.worldview,
    occupation: (row.occupation as string) ?? "",
    scores: (notesData.scores as Record<string, number>) ?? defaultLifecycleProfile.scores,
    selectedActivities: Array.isArray(notesData.selectedActivities)
      ? (notesData.selectedActivities as string[])
      : [],
    workEnjoysMost: (bgData.workEnjoysMost as string) ?? "",
    restEnjoysMost: (bgData.restEnjoysMost as string) ?? "",
  };
}

export function useLifecycleProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<LifecycleProfile>(() => loadFromLocalStorage());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [remoteId, setRemoteId] = useState<string | null>(null);
  const loadedRef = useRef(false);

  // Load from Supabase when user signs in
  useEffect(() => {
    if (!user || loadedRef.current) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("lifecycle_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (!error && data) {
        setRemoteId(data.id as string);
        const loaded = fromDbRow(data as Record<string, unknown>);
        setProfile(loaded);
        saveToLocalStorage(loaded);
      }
      loadedRef.current = true;
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  // Reset loaded flag if user signs out
  useEffect(() => {
    if (!user) {
      loadedRef.current = false;
      setRemoteId(null);
    }
  }, [user]);

  // Always save to localStorage on change
  useEffect(() => {
    saveToLocalStorage(profile);
  }, [profile]);

  /** Persist to Supabase (upsert). Call this on explicit "Save" actions. */
  const saveToSupabase = useCallback(async (profileToSave?: LifecycleProfile) => {
    const data = profileToSave ?? profile;
    if (!user) return;

    setSaving(true);
    try {
      if (remoteId) {
        await supabase
          .from("lifecycle_profiles")
          .update(toDbRow(data, user.id))
          .eq("id", remoteId);
      } else {
        const { data: inserted } = await supabase
          .from("lifecycle_profiles")
          .insert(toDbRow(data, user.id))
          .select("id")
          .single();

        if (inserted) {
          setRemoteId(inserted.id);
        }
      }
    } finally {
      setSaving(false);
    }
  }, [user, profile, remoteId]);

  const resetProfile = useCallback(() => {
    setProfile(defaultLifecycleProfile);
    saveToLocalStorage(defaultLifecycleProfile);
  }, []);

  return {
    profile,
    setProfile,
    loading,
    saving,
    saveToSupabase,
    resetProfile,
    isAuthenticated: !!user,
    remoteId,
  };
}
