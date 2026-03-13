import {
  domains,
  seasonOrder,
  seasons,
  type DomainId,
  type MapLayout,
  type SeasonDefinition,
  type SeasonId,
  type Worldview,
} from "@/data/lifecycle";

export interface LifecycleProfile {
  age: number;
  worldview: Worldview;
  preferredLayout: MapLayout;
  backgroundSummary: string;
  occupation: string;
  passions: string;
  futureVision: string;
  energy: number;
  transitionConfidence: number;
  priorities: string[];
  selectedDomains: DomainId[];
  horizon: string;
  notes: string;
  scenario: string;
}

export interface RoadmapSignal {
  title: string;
  value: string;
  tone: "strong" | "steady" | "watch";
  summary: string;
}

export interface RoadmapFocus {
  domainId: DomainId;
  title: string;
  rationale: string;
  actions: string[];
}

export interface LifecycleRoadmap {
  season: SeasonDefinition;
  nextSeason: SeasonDefinition | null;
  yearsIntoSeason: number;
  yearsToNextSeason: number;
  readinessScore: number;
  profileNarrative: string;
  signals: RoadmapSignal[];
  focusAreas: RoadmapFocus[];
  reflectionPrompts: string[];
  scenarioGuidance: {
    label: string;
    summary: string;
    nextSteps: string[];
    questions: string[];
    stabilizeFirst: string[];
  };
}

const seasonFocusMatrix: Record<SeasonId, Record<DomainId, string[]>> = {
  spring: {
    identity: [
      "Write the values you want to be known for before outside expectations define them for you.",
      "Name one mentor, one practice, and one habit that should shape the next decade.",
    ],
    relationships: [
      "Decide which relationships are formative and protect time for them early.",
      "Practice repair and communication while the stakes are still manageable.",
    ],
    work: [
      "Choose learning environments that build range, not just resume lines.",
      "Track what type of work gives you energy instead of only what earns approval.",
    ],
    health: [
      "Build sleep, movement, and recovery rituals that can survive future busyness.",
      "Treat energy management as infrastructure, not a reward.",
    ],
    stewardship: [
      "Start a simple operating system for money, obligations, and documents.",
      "Learn the difference between consumption, investment, and generosity.",
    ],
    legacy: [
      "Capture origin stories, family history, and early convictions while they are fresh.",
      "Ask what kind of ancestor you want to become and document the answer.",
    ],
  },
  summer: {
    identity: [
      "Audit where achievement is driving identity and where values are still leading.",
      "Clarify which commitments deserve your best years and which should be refused.",
    ],
    relationships: [
      "Replace accidental togetherness with deliberate rhythms at home and in community.",
      "Schedule conversations that keep roles and expectations current as life expands.",
    ],
    work: [
      "Build systems and leaders so output does not depend entirely on your personal intensity.",
      "Convert expertise into repeatable assets, training, or intellectual property.",
    ],
    health: [
      "Treat recovery as a leadership responsibility before burnout makes the decision for you.",
      "Find the smallest repeatable health rhythm that works during your busiest weeks.",
    ],
    stewardship: [
      "Move from reactive finances to deliberate reserves, protection, and long-term structure.",
      "Create a document trail that others could understand without you in the room.",
    ],
    legacy: [
      "Do not postpone legacy to retirement; start mentoring and documenting now.",
      "Record why you make major decisions so the people behind you inherit wisdom, not just results.",
    ],
  },
  autumn: {
    identity: [
      "Translate experience into a point of view that others can borrow with confidence.",
      "Let significance, not just success, shape the next set of commitments.",
    ],
    relationships: [
      "Create space for blessing, repair, and intentional access across generations.",
      "Invest in family stories and rituals that will outlast your active leadership role.",
    ],
    work: [
      "Shift from proving capacity to allocating it where it multiplies others.",
      "Name what should be delegated, what should be taught, and what should be concluded.",
    ],
    health: [
      "Protect mobility, energy, and attention so your wisdom remains available.",
      "Design a pace that lets you enjoy margin instead of merely talking about it.",
    ],
    stewardship: [
      "Simplify structures, align resources with values, and prepare practical handoff plans.",
      "Make sure estate, access, and philanthropic decisions are understandable and current.",
    ],
    legacy: [
      "Harvest stories, frameworks, and lessons while your memory and perspective are strong.",
      "Turn private wisdom into publishable, teachable, or repeatable legacy assets.",
    ],
  },
  winter: {
    identity: [
      "Clarify the final themes of your life and say them plainly to the people you love.",
      "Choose peace and truth over image management or unfinished striving.",
    ],
    relationships: [
      "Bless, reconcile, and create meaningful conversations that should not wait.",
      "Give family and caregivers practical clarity about your wishes and your story.",
    ],
    work: [
      "Release active control where appropriate and focus on counsel, memory, and witness.",
      "Preserve key lessons in ways others can access after your direct involvement ends.",
    ],
    health: [
      "Simplify routines so energy serves presence, comfort, and meaningful moments.",
      "Discuss support, care preferences, and dignity openly before crisis compresses options.",
    ],
    stewardship: [
      "Consolidate accounts, instructions, passwords, and final intentions into one accessible system.",
      "Reduce avoidable burden for the people who will need to act on your behalf.",
    ],
    legacy: [
      "Record blessing statements, stories, and values in formats your family will actually revisit.",
      "Finish the practical and emotional work of transfer while you can still guide it yourself.",
    ],
  },
};

const domainLeadTitles: Record<DomainId, string> = {
  identity: "Strengthen your inner operating system",
  relationships: "Create relational clarity and continuity",
  work: "Refocus effort on what compounds",
  health: "Protect the capacity that carries the season",
  stewardship: "Organize resources for resilience and transfer",
  legacy: "Convert lived experience into inheritable wisdom",
};

export function getSeasonByAge(age: number): SeasonDefinition {
  const boundedAge = Math.min(100, Math.max(0, age));
  return (
    seasons.find((season) => boundedAge >= season.ageRange[0] && boundedAge < season.ageRange[1]) ??
    seasons[seasons.length - 1]
  );
}

export function getNextSeason(seasonId: SeasonId): SeasonDefinition | null {
  const index = seasonOrder.indexOf(seasonId);
  if (index === -1 || index === seasonOrder.length - 1) {
    return null;
  }

  return seasons.find((season) => season.id === seasonOrder[index + 1]) ?? null;
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function buildNarrative(profile: LifecycleProfile, season: SeasonDefinition, nextSeason: SeasonDefinition | null): string {
  const worldviewLine =
    profile.worldview === "sacred"
      ? "You are framing this journey through a sacred lens, so the roadmap emphasizes formation, stewardship, and faithful transfer."
      : "You are framing this journey through a secular lens, so the roadmap emphasizes meaning, agency, and intentional legacy-building.";

  const transitionLine = nextSeason
    ? `At age ${profile.age}, you are in ${season.name} and have about ${Math.max(
        0,
        nextSeason.ageRange[0] - profile.age,
      )} years before ${nextSeason.name} becomes the dominant frame.`
    : `At age ${profile.age}, you are in ${season.name}, where simplification and transfer become the main work.`;

  const workLine = profile.occupation.trim()
    ? `You describe your current work as ${profile.occupation.trim()}.`
    : "Your roadmap should still be grounded in how you spend your days, even if your work identity is in flux.";

  const futureLine = profile.futureVision.trim()
    ? `You currently imagine the future this way: ${profile.futureVision.trim()}`
    : "Part of the work ahead is giving the future clearer shape, not just reacting to pressure.";

  return `${transitionLine} ${worldviewLine} ${workLine} ${futureLine}`;
}

function buildSignals(profile: LifecycleProfile, season: SeasonDefinition, yearsToNextSeason: number): RoadmapSignal[] {
  const readinessScore = clampScore(
    profile.energy * 11 +
      profile.transitionConfidence * 12 +
      profile.priorities.length * 6 +
      profile.selectedDomains.length * 5 +
      (profile.notes.trim() ? 8 : 0) +
      (profile.scenario.trim() ? 8 : 0) +
      (profile.futureVision.trim() ? 6 : 0),
  );

  const transitionUrgency = yearsToNextSeason <= 3 ? "watch" : yearsToNextSeason <= 8 ? "steady" : "strong";
  const transitionValue = yearsToNextSeason > 0 ? `${yearsToNextSeason} yrs` : "Now";
  const energyTone = profile.energy >= 4 ? "strong" : profile.energy >= 3 ? "steady" : "watch";
  const confidenceTone =
    profile.transitionConfidence >= 4 ? "strong" : profile.transitionConfidence >= 3 ? "steady" : "watch";

  return [
    {
      title: "Season readiness",
      value: `${readinessScore}/100`,
      tone: readinessScore >= 75 ? "strong" : readinessScore >= 55 ? "steady" : "watch",
      summary: `${season.focusStatement} Your current inputs suggest how ready you are to act on that work.`,
    },
    {
      title: "Transition window",
      value: transitionValue,
      tone: transitionUrgency,
      summary:
        yearsToNextSeason > 0
          ? "Use the remaining time in this season intentionally instead of drifting into the next one by default."
          : "You are already at a transition edge, so clarity and simplification matter now.",
    },
    {
      title: "Energy capacity",
      value: `${profile.energy}/5`,
      tone: energyTone,
      summary: "Capacity affects how ambitious this roadmap can realistically be right now.",
    },
    {
      title: "Transition confidence",
      value: `${profile.transitionConfidence}/5`,
      tone: confidenceTone,
      summary: "Confidence does not remove change, but it does lower the cost of acting before pressure spikes.",
    },
  ];
}

function uniqueDomains(profile: LifecycleProfile): DomainId[] {
  if (profile.selectedDomains.length > 0) {
    return profile.selectedDomains;
  }

  return ["identity", "relationships", "stewardship"];
}

function buildFocusAreas(profile: LifecycleProfile, season: SeasonDefinition): RoadmapFocus[] {
  return uniqueDomains(profile)
    .slice(0, 3)
    .map((domainId) => {
      const definition = domains.find((domain) => domain.id === domainId);
      const actions = seasonFocusMatrix[season.id][domainId];

      return {
        domainId,
        title: domainLeadTitles[domainId],
        rationale: definition
          ? `${definition.name} matters in ${season.name} because ${definition.summary.toLowerCase()}`
          : season.summary,
        actions,
      };
    });
}

function buildReflectionPrompts(profile: LifecycleProfile, season: SeasonDefinition, nextSeason: SeasonDefinition | null): string[] {
  const prompts = [season.transitionPrompt];

  if (nextSeason) {
    prompts.push(`What should be true by the time ${nextSeason.name} begins so that the transition feels chosen rather than accidental?`);
  }

  if (profile.priorities.includes("legacy")) {
    prompts.push("What story, ritual, or instruction would be most costly to leave undocumented for the next generation?");
  }

  if (profile.priorities.includes("relationships")) {
    prompts.push("Which conversation would create disproportionate peace if you initiated it this month?");
  }

  if (profile.notes.trim()) {
    prompts.push(`You noted: "${profile.notes.trim()}". What part of that deserves a concrete next action instead of another round of reflection?`);
  }

  if (profile.passions.trim()) {
    prompts.push(`You said you care about ${profile.passions.trim()}. Where should that passion become a commitment, not just an interest?`);
  }

  return prompts.slice(0, 4);
}

function scenarioCategory(scenarioText: string): "retirement" | "purpose" | "grief" | "caregiving" | "reinvention" | "general" {
  const text = scenarioText.toLowerCase();

  if (text.includes("retire")) return "retirement";
  if (text.includes("spouse died") || text.includes("widow") || text.includes("widower") || text.includes("grief") || text.includes("died")) {
    return "grief";
  }
  if (text.includes("care") || text.includes("caregiver") || text.includes("aging parent") || text.includes("parent")) {
    return "caregiving";
  }
  if (text.includes("spare time") || text.includes("purpose") || text.includes("bored") || text.includes("empty")) {
    return "purpose";
  }
  if (text.includes("reinvent") || text.includes("new chapter") || text.includes("transition") || text.includes("what next")) {
    return "reinvention";
  }

  return "general";
}

function buildScenarioGuidance(profile: LifecycleProfile, season: SeasonDefinition) {
  const category = scenarioCategory(profile.scenario);
  const background = profile.backgroundSummary.trim();
  const occupation = profile.occupation.trim();
  const passions = profile.passions.trim();
  const futureVision = profile.futureVision.trim();

  const commonQuestions = [
    "What needs to be stabilized first so you are not making a long-range decision from a short-range panic?",
    "Who should be part of this decision, and who needs to be informed even if they are not deciding?",
    "What would it look like to move one step at a time instead of solving your entire future at once?",
  ];

  const commonStabilizers = [
    "Name the immediate emotional, financial, relational, and practical pressures separately instead of blending them together.",
    "Reduce the problem to the next conversation, next document, or next decision checkpoint.",
    "Write down what must be true in the next 30 days before worrying about the next 5 years.",
  ];

  const scenarioMap = {
    retirement: {
      label: "Retirement discernment",
      summary:
        "Retirement is rarely just a money question. In this framework, it is also a season question about identity, contribution, pace, and transfer.",
      nextSteps: [
        `Use your ${season.name} season lens to ask whether this is a time to keep building, begin harvesting differently, or prepare a cleaner handoff.`,
        "Separate readiness into categories: financial readiness, emotional readiness, relational readiness, and purpose readiness.",
        "Pilot the future before committing to it fully by testing a lighter schedule, advisory role, volunteer commitment, or purposeful sabbath rhythm.",
      ],
      questions: [
        "If work became optional, what form of usefulness would still matter to you?",
        "What are you afraid retirement will take away from your identity?",
        "What responsibilities must be clarified with your spouse or family before changing pace?",
      ],
    },
    purpose: {
      label: "Purpose and spare-time design",
      summary:
        "Unstructured time often exposes questions that busy years kept hidden. The goal is not just to fill hours, but to shape a meaningful rhythm.",
      nextSteps: [
        "List the activities that genuinely restore you, the ones that connect you to people, and the ones that make you feel useful.",
        "Design a weekly pattern with one relational commitment, one contribution commitment, and one restorative practice before chasing hobbies at random.",
        "Treat curiosity as data. Try small experiments before deciding what the next chapter is supposed to become.",
      ],
      questions: [
        "What kind of day leaves you feeling peaceful instead of merely occupied?",
        "Where do your passions and your current season naturally overlap?",
        "What relationships or communities need more of your presence now that time has opened up?",
      ],
    },
    grief: {
      label: "Grief and immediate reorientation",
      summary:
        "After a spouse dies, the first work is not optimization. It is stabilization, support, and protecting yourself from unnecessary pressure while reality is still shifting.",
      nextSteps: [
        "Identify what needs attention now, what can wait, and what should only be done with trusted support present.",
        "Ask for practical help with documents, calendars, finances, and household decisions so grief does not carry every operational burden alone.",
        "Let this season focus on grounding, companionship, and faithful next steps rather than rushing to define your new life too quickly.",
      ],
      questions: [
        "Who is safe enough to help you think, not just react?",
        "What decisions do not need to be made this week even though they feel emotionally urgent?",
        "What routines, people, or places help your body and mind stay anchored right now?",
      ],
    },
    caregiving: {
      label: "Caregiving triage",
      summary:
        "Caregiving compresses time, identity, and energy. The planning task is to protect both the people you love and the parts of you that must remain intact.",
      nextSteps: [
        "Clarify what only you can do, what others can share, and what systems can carry for you.",
        "Build a care map with names, schedules, documents, and emergency decisions so the burden is not trapped in your head.",
        "Choose one non-negotiable rhythm that protects your own health and functioning each week.",
      ],
      questions: [
        "What are you carrying alone because it feels easier than asking for help?",
        "Where is exhaustion making your decisions smaller than your actual options?",
        "What support would meaningfully reduce chaos over the next month?",
      ],
    },
    reinvention: {
      label: "Reinvention and next-chapter design",
      summary:
        "Reinvention works best when it honors your history without becoming trapped by it. The goal is to carry forward what is essential and release what no longer fits.",
      nextSteps: [
        `Use the ${season.name} lens to ask what should still be built, what should now be leveraged, and what should be gracefully concluded.`,
        "Write three columns: what to keep, what to release, and what to explore next.",
        "Test changes in reversible ways before making an irreversible identity decision.",
      ],
      questions: [
        "What parts of your current life are faithful but finished?",
        "What strengths from your history should absolutely come with you into the next chapter?",
        "What would a smaller, braver first move look like?",
      ],
    },
    general: {
      label: "Situation navigation",
      summary:
        "Complex situations become more workable when you interpret them through season, identity, responsibilities, and next-step clarity instead of trying to solve everything at once.",
      nextSteps: [
        `Frame the situation through ${season.name}: what is this season asking you to learn, apply, reap, or prepare?`,
        "Separate the decision itself from the emotions, relationships, and logistics surrounding it.",
        "Choose one next step that creates clarity before you choose the final answer.",
      ],
      questions: [
        "What exactly are you deciding, and what are you not deciding yet?",
        "What would wise progress look like over the next 30 days?",
        "Who can offer grounded perspective because they know both your history and your hopes?",
      ],
    },
  } as const;

  const selected = scenarioMap[category];
  const personalization = [
    background ? `Background to keep in view: ${background}` : null,
    occupation ? `Your current work context: ${occupation}` : null,
    passions ? `Passions that should shape the answer: ${passions}` : null,
    futureVision ? `Future picture to test against: ${futureVision}` : null,
  ].filter(Boolean) as string[];

  return {
    label: selected.label,
    summary: `${selected.summary} ${personalization.slice(0, 2).join(" ")}`.trim(),
    nextSteps: [...selected.nextSteps, ...personalization].slice(0, 5),
    questions: [...selected.questions, ...commonQuestions].slice(0, 5),
    stabilizeFirst: category === "grief" || category === "caregiving" ? commonStabilizers : commonStabilizers.slice(0, 2),
  };
}

export function buildLifecycleRoadmap(profile: LifecycleProfile): LifecycleRoadmap {
  const season = getSeasonByAge(profile.age);
  const nextSeason = getNextSeason(season.id);
  const yearsIntoSeason = profile.age - season.ageRange[0];
  const yearsToNextSeason = nextSeason ? Math.max(0, nextSeason.ageRange[0] - profile.age) : 0;
  const readinessSignal = buildSignals(profile, season, yearsToNextSeason)[0];

  return {
    season,
    nextSeason,
    yearsIntoSeason,
    yearsToNextSeason,
    readinessScore: Number.parseInt(readinessSignal.value, 10),
    profileNarrative: buildNarrative(profile, season, nextSeason),
    signals: buildSignals(profile, season, yearsToNextSeason),
    focusAreas: buildFocusAreas(profile, season),
    reflectionPrompts: buildReflectionPrompts(profile, season, nextSeason),
    scenarioGuidance: buildScenarioGuidance(profile, season),
  };
}
