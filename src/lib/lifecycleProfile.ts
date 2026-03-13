import type { LifecycleProfile } from "@/lib/lifecycleEngine";

export const lifecycleProfileStorageKey = "legacyLifecycleProfile";

export const defaultLifecycleProfile: LifecycleProfile = {
  age: 38,
  worldview: "secular",
  preferredLayout: "circle",
  backgroundSummary: "",
  occupation: "",
  passions: "",
  futureVision: "",
  energy: 3,
  transitionConfidence: 3,
  priorities: ["clarity", "alignment"],
  selectedDomains: ["relationships", "work", "stewardship"],
  horizon: "12_months",
  notes: "",
  scenario: "",
};

export function loadLifecycleProfile(): LifecycleProfile {
  const raw = localStorage.getItem(lifecycleProfileStorageKey);
  if (!raw) {
    return defaultLifecycleProfile;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LifecycleProfile>;

    return {
      ...defaultLifecycleProfile,
      ...parsed,
      priorities: Array.isArray(parsed.priorities) ? parsed.priorities : defaultLifecycleProfile.priorities,
      selectedDomains: Array.isArray(parsed.selectedDomains)
        ? parsed.selectedDomains
        : defaultLifecycleProfile.selectedDomains,
    };
  } catch {
    return defaultLifecycleProfile;
  }
}

export function saveLifecycleProfile(profile: LifecycleProfile) {
  localStorage.setItem(lifecycleProfileStorageKey, JSON.stringify(profile));
}
