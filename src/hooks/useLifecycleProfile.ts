import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { LifecycleProfile } from "@/lib/lifecycleEngine";
import {
  defaultLifecycleProfile,
  loadLifecycleProfile as loadFromLocalStorage,
  saveLifecycleProfile as saveToLocalStorage,
} from "@/lib/lifecycleProfile";
import type { DomainId } from "@/data/lifecycle";

/** Map between the camelCase frontend model and the snake_case DB columns. */
function toDbRow(profile: LifecycleProfile, userId: string) {
  return {
    user_id: userId,
    age: profile.age,
    worldview: profile.worldview,
    preferred_layout: profile.preferredLayout,
    background_summary: profile.backgroundSummary,
    occupation: profile.occupation,
    passions: profile.passions,
    future_vision: profile.futureVision,
    energy: profile.energy,
    transition_confidence: profile.transitionConfidence,
    priorities: profile.priorities,
    selected_domains: profile.selectedDomains,
    horizon: profile.horizon,
    notes: profile.notes,
    scenario: profile.scenario,
  };
}

function fromDbRow(row: Record<string, unknown>): LifecycleProfile {
  return {
    age: (row.age as number) ?? defaultLifecycleProfile.age,
    worldview: (row.worldview as LifecycleProfile["worldview"]) ?? defaultLifecycleProfile.worldview,
    preferredLayout: (row.preferred_layout as LifecycleProfile["preferredLayout"]) ?? defaultLifecycleProfile.preferredLayout,
    backgroundSummary: (row.background_summary as string) ?? "",
    occupation: (row.occupation as string) ?? "",
    passions: (row.passions as string) ?? "",
    futureVision: (row.future_vision as string) ?? "",
    energy: (row.energy as number) ?? defaultLifecycleProfile.energy,
    transitionConfidence: (row.transition_confidence as number) ?? defaultLifecycleProfile.transitionConfidence,
    priorities: Array.isArray(row.priorities) ? (row.priorities as string[]) : defaultLifecycleProfile.priorities,
    selectedDomains: Array.isArray(row.selected_domains) ? (row.selected_domains as DomainId[]) : defaultLifecycleProfile.selectedDomains,
    horizon: (row.horizon as string) ?? defaultLifecycleProfile.horizon,
    notes: (row.notes as string) ?? "",
    scenario: (row.scenario as string) ?? "",
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
        saveToLocalStorage(loaded); // keep local cache in sync
      }
      // If no remote data, keep the localStorage profile
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
        // Update existing
        await supabase
          .from("lifecycle_profiles")
          .update(toDbRow(data, user.id))
          .eq("id", remoteId);
      } else {
        // Insert new
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
