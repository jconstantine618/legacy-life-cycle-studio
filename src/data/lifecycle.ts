export type Worldview = "secular" | "sacred";
export type MapLayout = "circle" | "arc";
export type SeasonId = "spring" | "summer" | "autumn" | "winter";
export type DomainId =
  | "identity"
  | "relationships"
  | "work"
  | "health"
  | "stewardship"
  | "legacy";

export interface SeasonDefinition {
  id: SeasonId;
  name: string;
  verb: string;
  ageRange: [number, number];
  summary: string;
  descriptors: string[];
  focusStatement: string;
  transitionPrompt: string;
  sacredAnchor?: {
    citation: string;
    excerpt: string;
  };
  colors: {
    solid: string;
    soft: string;
    ink: string;
  };
}

export interface DomainDefinition {
  id: DomainId;
  name: string;
  summary: string;
}

export interface PdfAsset {
  id: string;
  worldview: Worldview;
  layout: MapLayout;
  title: string;
  description: string;
  pdfUrl: string;
  previewUrl: string;
}

export interface PriorityOption {
  id: string;
  label: string;
  summary: string;
}

export interface HorizonOption {
  id: string;
  label: string;
  summary: string;
}

export interface GuidedPromptGroup {
  id: string;
  title: string;
  prompts: string[];
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  prompt: string;
  summary: string;
}

export const worldviewLabels: Record<Worldview, string> = {
  secular: "Secular",
  sacred: "Sacred",
};

export const layoutLabels: Record<MapLayout, string> = {
  circle: "Circle",
  arc: "Arc",
};

export const seasons: SeasonDefinition[] = [
  {
    id: "spring",
    name: "Spring",
    verb: "Learn",
    ageRange: [0, 25],
    summary: "A season for orientation, identity formation, and discovering what kind of person you are becoming.",
    descriptors: ["Longer days", "New life", "Growth", "Hope", "Optimism", "Change"],
    focusStatement: "Build foundations before speed becomes the default.",
    transitionPrompt: "What habits, beliefs, and relationships should be strengthened before the pace of Summer arrives?",
    sacredAnchor: {
      citation: "Isaiah 48:17",
      excerpt: "I am the Lord your God, who teaches you what is best for you, who directs you in the way you should go.",
    },
    colors: {
      solid: "#45b649",
      soft: "#e5f7df",
      ink: "#225a22",
    },
  },
  {
    id: "summer",
    name: "Summer",
    verb: "Apply",
    ageRange: [25, 50],
    summary: "A season of execution where learning gets tested in work, family, leadership, and daily responsibility.",
    descriptors: ["Longest days", "Full and busy", "Implement", "Realize", "Validate", "Achieve"],
    focusStatement: "Convert momentum into durable systems and meaningful commitments.",
    transitionPrompt: "What are you building now that should still matter when output is no longer your main advantage?",
    sacredAnchor: {
      citation: "Ecclesiastes 11:6",
      excerpt: "Sow your seed in the morning, and at evening let your hands not be idle.",
    },
    colors: {
      solid: "#0f75bd",
      soft: "#dceffd",
      ink: "#11496f",
    },
  },
  {
    id: "autumn",
    name: "Autumn",
    verb: "Reap",
    ageRange: [50, 75],
    summary: "A season to harvest wisdom, reallocate attention, and widen influence through contribution rather than pure output.",
    descriptors: ["Shorter days", "Harvest", "Fruit", "Vision", "Significance", "Leverage"],
    focusStatement: "Harvest intentionally and direct what you have built toward significance.",
    transitionPrompt: "Where should your experience become mentorship, generosity, or strategic stewardship?",
    sacredAnchor: {
      citation: "Psalm 128:2",
      excerpt: "You will eat the fruit of your labor; blessings and prosperity will be yours.",
    },
    colors: {
      solid: "#e6b718",
      soft: "#fcf3cf",
      ink: "#7a5b06",
    },
  },
  {
    id: "winter",
    name: "Winter",
    verb: "Prepare",
    ageRange: [75, 100],
    summary: "A season for simplification, blessing others, story curation, and preparing family and community for what continues after you.",
    descriptors: ["Shortest days", "Reminisce", "Dreams", "Destiny", "Legacy", "Death"],
    focusStatement: "Reduce noise, clarify what matters, and transfer wisdom with intention.",
    transitionPrompt: "What still needs to be named, shared, organized, or released for others to carry forward well?",
    sacredAnchor: {
      citation: "Ecclesiastes 3:20",
      excerpt: "All go to the same place; all come from dust, and to dust all return.",
    },
    colors: {
      solid: "#736a67",
      soft: "#efebe9",
      ink: "#4b4340",
    },
  },
];

export const domains: DomainDefinition[] = [
  {
    id: "identity",
    name: "Identity",
    summary: "Values, beliefs, calling, and the story you are living from.",
  },
  {
    id: "relationships",
    name: "Relationships",
    summary: "Family, friendship, marriage, community, repair, and belonging.",
  },
  {
    id: "work",
    name: "Work",
    summary: "Career, craft, leadership, contribution, and how your effort compounds.",
  },
  {
    id: "health",
    name: "Health",
    summary: "Physical energy, mental resilience, rest, and your capacity to sustain a life rhythm.",
  },
  {
    id: "stewardship",
    name: "Stewardship",
    summary: "Resources, margin, generosity, estate readiness, and intentional allocation.",
  },
  {
    id: "legacy",
    name: "Legacy",
    summary: "Mentorship, stories, rituals, documents, and what remains after your active years.",
  },
];

export const priorityOptions: PriorityOption[] = [
  {
    id: "clarity",
    label: "Gain clarity for this season",
    summary: "Name what matters now and reduce noise.",
  },
  {
    id: "transition",
    label: "Prepare for the next transition",
    summary: "Reduce friction before the next quarter-life turn.",
  },
  {
    id: "alignment",
    label: "Align work and life",
    summary: "Make decisions that fit your values, pace, and responsibilities.",
  },
  {
    id: "relationships",
    label: "Strengthen core relationships",
    summary: "Make room for repair, presence, and intergenerational conversations.",
  },
  {
    id: "legacy",
    label: "Build a living legacy plan",
    summary: "Capture stories, intentions, and practical transfer steps.",
  },
  {
    id: "stewardship",
    label: "Create stewardship structure",
    summary: "Organize assets, obligations, and key documents.",
  },
];

export const horizonOptions: HorizonOption[] = [
  {
    id: "90_days",
    label: "Next 90 days",
    summary: "A focused operating rhythm for immediate action.",
  },
  {
    id: "12_months",
    label: "Next 12 months",
    summary: "A practical annual roadmap with milestones.",
  },
  {
    id: "3_years",
    label: "Next 3 years",
    summary: "A transition-aware plan for larger shifts and timing.",
  },
];

export const guidedPromptGroups: GuidedPromptGroup[] = [
  {
    id: "background",
    title: "Background prompts",
    prompts: [
      "What shaped you most in the last ten years?",
      "What responsibilities or relationships define this season?",
      "What part of your history still affects how you make decisions now?",
    ],
  },
  {
    id: "work",
    title: "Work and contribution prompts",
    prompts: [
      "What do you do for a living, and what part of it feels most meaningful?",
      "What work drains you, and what work makes you feel useful or alive?",
      "If your current role ended tomorrow, what kind of contribution would you still want to make?",
    ],
  },
  {
    id: "passion",
    title: "Passion and purpose prompts",
    prompts: [
      "What do you care about even when nobody asks you to care about it?",
      "Where do you naturally give energy, time, or attention?",
      "What topics, causes, or kinds of people pull something strong out of you?",
    ],
  },
  {
    id: "future",
    title: "Future vision prompts",
    prompts: [
      "What do you think your future could look like if things went well enough?",
      "What are you afraid might happen if you do not act intentionally?",
      "What do you want more of in the next chapter: stability, freedom, service, creativity, rest, or reinvention?",
    ],
  },
  {
    id: "scenario",
    title: "Scenario prompts",
    prompts: [
      "What is the specific situation you are trying to think through?",
      "Why does it feel complicated right now?",
      "What decision, conversation, or transition feels hardest to face next?",
    ],
  },
];

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: "retirement",
    title: "I don't know when to retire",
    prompt: "I don't know when to retire. I am unsure how to weigh money, identity, usefulness, timing, and family needs.",
    summary: "Useful for people trying to decide whether to keep working, slow down, or move into a new chapter.",
  },
  {
    id: "spare-time",
    title: "I don't know what to do with my spare time",
    prompt: "I don't know what to do with my spare time. I need help thinking about purpose, rhythm, relationships, contribution, and enjoyment.",
    summary: "Useful when structure has changed and meaning has not caught up yet.",
  },
  {
    id: "grief",
    title: "My spouse just died, what should my focus be now?",
    prompt: "My spouse just died. I need help thinking through what my focus should be now emotionally, relationally, practically, and spiritually.",
    summary: "Useful for grief, disorientation, and immediate next-step thinking after a major loss.",
  },
  {
    id: "reinvention",
    title: "I think I need to reinvent my life",
    prompt: "I think I need to reinvent my life, but I do not know what to keep, what to release, or what to build next.",
    summary: "Useful for transitions involving calling, identity, career, or lifestyle redesign.",
  },
  {
    id: "caregiving",
    title: "I am caring for others and losing myself",
    prompt: "I am caring for others and losing myself. I need help balancing duty, identity, energy, and what is sustainable.",
    summary: "Useful for caregiving seasons, role overload, and boundary questions.",
  },
];

export const pdfAssets: PdfAsset[] = [
  {
    id: "secular-circle",
    worldview: "secular",
    layout: "circle",
    title: "Secular Circle Map",
    description: "The original 360-degree lifecycle chart focused on the four seasonal verbs.",
    pdfUrl: "/legacy-lifecycle/pdfs/secular_circle.pdf",
    previewUrl: "/legacy-lifecycle/previews/secular_circle.png",
  },
  {
    id: "sacred-circle",
    worldview: "sacred",
    layout: "circle",
    title: "Sacred Circle Map",
    description: "The faith-oriented circle chart with scriptural anchors for each season.",
    pdfUrl: "/legacy-lifecycle/pdfs/sacred_circle.pdf",
    previewUrl: "/legacy-lifecycle/previews/sacred_circle.png",
  },
  {
    id: "secular-arc",
    worldview: "secular",
    layout: "arc",
    title: "Secular Arc Map",
    description: "A 180-degree arc that emphasizes the acceleration and deceleration of life.",
    pdfUrl: "/legacy-lifecycle/pdfs/secular_arc.pdf",
    previewUrl: "/legacy-lifecycle/previews/secular_arc.png",
  },
  {
    id: "sacred-arc",
    worldview: "sacred",
    layout: "arc",
    title: "Sacred Arc Map",
    description: "The arc view plus scriptural anchors and Psalm 90:10 framing.",
    pdfUrl: "/legacy-lifecycle/pdfs/sacred_arc.pdf",
    previewUrl: "/legacy-lifecycle/previews/sacred_arc.png",
  },
];

export const seasonOrder: SeasonId[] = ["spring", "summer", "autumn", "winter"];

export const sacredFraming = {
  verse: "Psalm 90:10",
  excerpt:
    "Our days may come to seventy years, or eighty, if our strength endures; yet they quickly pass, and we fly away.",
};
