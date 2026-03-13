import type { LifecycleProfile } from "@/lib/lifecycleEngine";

export const lifecycleProfileStorageKey = "legacyLifecycleProfile";

export const defaultLifecycleProfile: LifecycleProfile = {
  age: 38,
  expectedLifespan: 80,
  worldview: "secular",
  occupation: "",
  scores: {
    financialFreedom: 5,
    familyCloseness: 5,
    hobbies: 5,
    workEnjoyment: 5,
    restEnjoyment: 5,
    healthWellness: 5,
    purpose: 5,
  },
  selectedActivities: [],
  workEnjoysMost: "",
  restEnjoysMost: "",
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
      scores: {
        ...defaultLifecycleProfile.scores,
        ...(typeof parsed.scores === "object" && parsed.scores !== null ? parsed.scores : {}),
      },
      selectedActivities: Array.isArray(parsed.selectedActivities) ? parsed.selectedActivities : [],
    };
  } catch {
    return defaultLifecycleProfile;
  }
}

export function saveLifecycleProfile(profile: LifecycleProfile) {
  localStorage.setItem(lifecycleProfileStorageKey, JSON.stringify(profile));
}
