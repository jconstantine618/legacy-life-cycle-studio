import {
  seasons,
  seasonOrder,
  getSeasonByAge,
  getScaledSeasons,
  type SeasonDefinition,
  type SeasonId,
  type Worldview,
} from "@/data/lifecycle";

export interface LifecycleProfile {
  age: number;
  expectedLifespan: number;
  worldview: Worldview;
  occupation: string;
  scores: Record<string, number>; // categoryId -> 1-10
  selectedActivities: string[];   // activityOption ids
  workEnjoysMost: string;
  restEnjoysMost: string;
}

export interface FiveYearSegment {
  ageStart: number;
  ageEnd: number;
  season: SeasonDefinition;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  label: string;
}

export interface LifeCoachInsight {
  currentSeason: SeasonDefinition & { scaledRange: [number, number] };
  nextSeason: (SeasonDefinition & { scaledRange: [number, number] }) | null;
  yearsLived: number;
  yearsRemaining: number;
  percentComplete: number;
  fiveYearSegments: FiveYearSegment[];
  currentSegmentIndex: number;
  narrative: string;
  reflectionPrompts: string[];
  nextFiveYearFocus: string[];
  strengths: string[];
  growthAreas: string[];
}

export function getNextSeason(seasonId: SeasonId): SeasonDefinition | null {
  const index = seasonOrder.indexOf(seasonId);
  if (index === -1 || index === seasonOrder.length - 1) return null;
  return seasons.find((s) => s.id === seasonOrder[index + 1]) ?? null;
}

function buildFiveYearSegments(profile: LifecycleProfile): FiveYearSegment[] {
  const segments: FiveYearSegment[] = [];
  const maxAge = profile.expectedLifespan;

  for (let start = 0; start < maxAge; start += 5) {
    const end = Math.min(start + 5, maxAge);
    const midpoint = (start + end) / 2;
    const season = getSeasonByAge(midpoint, maxAge);

    segments.push({
      ageStart: start,
      ageEnd: end,
      season,
      isPast: end <= profile.age,
      isCurrent: start <= profile.age && end > profile.age,
      isFuture: start > profile.age,
      label: `${start}-${end}`,
    });
  }

  return segments;
}

function buildNarrative(profile: LifecycleProfile, currentSeason: SeasonDefinition, worldview: Worldview): string {
  const yearsRemaining = Math.max(0, profile.expectedLifespan - profile.age);
  const percentComplete = Math.round((profile.age / profile.expectedLifespan) * 100);

  const secularOpening = `At ${profile.age}, you've lived about ${percentComplete}% of your expected life. You're in the ${currentSeason.name} season — a time to ${currentSeason.verb.toLowerCase()}. With roughly ${yearsRemaining} years ahead, the question isn't just how much time remains, but how intentionally you'll spend it.`;

  const sacredOpening = `At ${profile.age}, you've journeyed through about ${percentComplete}% of the years God may grant you. You're in the ${currentSeason.name} season — a time to ${currentSeason.verb.toLowerCase()}. ${currentSeason.sacredAnchor ? `As Scripture says: "${currentSeason.sacredAnchor.excerpt}" (${currentSeason.sacredAnchor.citation})` : ""} With roughly ${yearsRemaining} years ahead, the invitation is to steward them faithfully.`;

  const occupationLine = profile.occupation.trim()
    ? ` Your work in ${profile.occupation.trim()} shapes your daily rhythm.`
    : "";

  // Analyze scores
  const scoreEntries = Object.entries(profile.scores);
  const highScores = scoreEntries.filter(([, v]) => v >= 7).map(([k]) => k);
  const lowScores = scoreEntries.filter(([, v]) => v <= 4).map(([k]) => k);

  let scoreLine = "";
  if (highScores.length > 0 && lowScores.length > 0) {
    scoreLine = ` You feel strongest in areas like ${formatCategoryNames(highScores).join(" and ")}, while ${formatCategoryNames(lowScores).join(" and ")} ${lowScores.length === 1 ? "needs" : "need"} more attention.`;
  } else if (lowScores.length > 0) {
    scoreLine = ` Areas like ${formatCategoryNames(lowScores).join(" and ")} could use more of your focus.`;
  } else if (highScores.length > 0) {
    scoreLine = ` You're feeling strong across the board, especially in ${formatCategoryNames(highScores).join(" and ")}.`;
  }

  return (worldview === "sacred" ? sacredOpening : secularOpening) + occupationLine + scoreLine;
}

function formatCategoryNames(ids: string[]): string[] {
  const nameMap: Record<string, string> = {
    financialFreedom: "financial freedom",
    familyCloseness: "family closeness",
    hobbies: "hobbies",
    workEnjoyment: "work enjoyment",
    restEnjoyment: "rest and leisure",
    healthWellness: "health and wellness",
    purpose: "sense of purpose",
  };
  return ids.map((id) => nameMap[id] || id);
}

function buildReflectionPrompts(
  profile: LifecycleProfile,
  currentSeason: SeasonDefinition,
  worldview: Worldview,
): string[] {
  const prompts: string[] = [];
  const yearsRemaining = profile.expectedLifespan - profile.age;
  const nextSeasonStart = getScaledSeasons(profile.expectedLifespan)
    .find((s) => s.scaledRange[0] > profile.age);

  // Season-specific
  if (worldview === "sacred") {
    prompts.push(`In this ${currentSeason.name} season, what is God calling you to ${currentSeason.verb.toLowerCase()}?`);
    if (yearsRemaining <= 20) {
      prompts.push("What spiritual legacy do you want to leave for those who come after you?");
    }
  } else {
    prompts.push(`What does it look like to fully ${currentSeason.verb.toLowerCase()} in this season of your life?`);
    if (yearsRemaining <= 20) {
      prompts.push("What legacy do you want to leave behind?");
    }
  }

  // Score-driven prompts
  const scores = profile.scores;
  if ((scores.financialFreedom ?? 5) <= 4) {
    prompts.push(worldview === "sacred"
      ? "How can you better steward the resources God has given you to feel more financially at peace?"
      : "What one financial habit could you change in the next 90 days to increase your sense of freedom?");
  }
  if ((scores.familyCloseness ?? 5) <= 4) {
    prompts.push(worldview === "sacred"
      ? "What relationship in your family is God asking you to repair or invest in?"
      : "Which family relationship would benefit most from dedicated time and honest conversation?");
  }
  if ((scores.purpose ?? 5) <= 4) {
    prompts.push(worldview === "sacred"
      ? "When have you felt most alive in your calling? What was happening?"
      : "When was the last time you felt deeply purposeful? What were you doing?");
  }
  if ((scores.healthWellness ?? 5) <= 4) {
    prompts.push("What is one small daily habit that could meaningfully improve your energy and health?");
  }

  // Activity-driven
  if (profile.selectedActivities.length > 0) {
    prompts.push(`You said you'd love to spend time on activities like ${profile.selectedActivities.slice(0, 3).join(", ")}. What's stopping you from doing more of that now?`);
  }

  // Transition prompt
  if (nextSeasonStart) {
    const yearsToNext = nextSeasonStart.scaledRange[0] - profile.age;
    if (yearsToNext <= 10 && yearsToNext > 0) {
      prompts.push(`Your next season (${nextSeasonStart.name}) begins in roughly ${yearsToNext} years. What should be true by then?`);
    }
  }

  return prompts.slice(0, 5);
}

function buildNextFiveYearFocus(
  profile: LifecycleProfile,
  currentSeason: SeasonDefinition,
  worldview: Worldview,
): string[] {
  const focus: string[] = [];
  const scores = profile.scores;
  const nextFive = profile.age + 5;

  // Work/purpose focus
  if (profile.occupation.trim()) {
    if (currentSeason.id === "autumn" || currentSeason.id === "winter") {
      focus.push(worldview === "sacred"
        ? `Between now and age ${nextFive}, consider how your work in ${profile.occupation.trim()} can shift from earning to giving — mentoring, teaching, or serving.`
        : `Between now and age ${nextFive}, think about transitioning your role in ${profile.occupation.trim()} from active execution to mentorship and knowledge transfer.`);
    } else {
      focus.push(`Over the next five years, deepen your craft in ${profile.occupation.trim()} while building systems that don't depend entirely on your personal effort.`);
    }
  }

  // Low-score areas become growth targets
  const lowAreas = Object.entries(scores).filter(([, v]) => v <= 4);
  for (const [area] of lowAreas.slice(0, 2)) {
    const name = formatCategoryNames([area])[0];
    focus.push(`Make ${name} a priority between now and age ${nextFive}. Small, consistent investments here will compound.`);
  }

  // Activities as lifestyle design
  if (profile.selectedActivities.length >= 3) {
    focus.push(`Build a weekly rhythm that includes at least one of your chosen activities. By age ${nextFive}, these should feel like non-negotiables, not luxuries.`);
  }

  // Season-specific guidance
  if (currentSeason.id === "spring") {
    focus.push("Use these five years to explore widely. Try things, meet people, build skills. Don't optimize too early.");
  } else if (currentSeason.id === "summer") {
    focus.push("This is your execution window. Build, commit, and protect what matters. Don't let busyness substitute for intention.");
  } else if (currentSeason.id === "autumn") {
    focus.push(worldview === "sacred"
      ? "These years are about harvest and generosity. Give what you've learned. Pour into the next generation."
      : "These years are about harvesting what you've built and sharing it generously through mentorship, contribution, and presence.");
  } else {
    focus.push(worldview === "sacred"
      ? "Simplify. Bless. Prepare your heart and your household. Every conversation may be a gift."
      : "Simplify your life. Focus on relationships, wisdom transfer, and the things that truly matter to you.");
  }

  return focus.slice(0, 5);
}

function identifyStrengths(profile: LifecycleProfile): string[] {
  return Object.entries(profile.scores)
    .filter(([, v]) => v >= 7)
    .map(([k]) => formatCategoryNames([k])[0]);
}

function identifyGrowthAreas(profile: LifecycleProfile): string[] {
  return Object.entries(profile.scores)
    .filter(([, v]) => v <= 4)
    .map(([k]) => formatCategoryNames([k])[0]);
}

export function buildLifeCoachInsight(profile: LifecycleProfile): LifeCoachInsight {
  const scaledSeasons = getScaledSeasons(profile.expectedLifespan);
  const currentSeason = scaledSeasons.find(
    (s) => profile.age >= s.scaledRange[0] && profile.age < s.scaledRange[1],
  ) ?? scaledSeasons[scaledSeasons.length - 1];

  const currentIndex = scaledSeasons.indexOf(currentSeason);
  const nextSeason = currentIndex < scaledSeasons.length - 1 ? scaledSeasons[currentIndex + 1] : null;

  const fiveYearSegments = buildFiveYearSegments(profile);
  const currentSegmentIndex = fiveYearSegments.findIndex((s) => s.isCurrent);

  return {
    currentSeason,
    nextSeason,
    yearsLived: profile.age,
    yearsRemaining: Math.max(0, profile.expectedLifespan - profile.age),
    percentComplete: Math.round((profile.age / profile.expectedLifespan) * 100),
    fiveYearSegments,
    currentSegmentIndex,
    narrative: buildNarrative(profile, currentSeason, profile.worldview),
    reflectionPrompts: buildReflectionPrompts(profile, currentSeason, profile.worldview),
    nextFiveYearFocus: buildNextFiveYearFocus(profile, currentSeason, profile.worldview),
    strengths: identifyStrengths(profile),
    growthAreas: identifyGrowthAreas(profile),
  };
}
