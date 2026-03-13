export type Worldview = "secular" | "sacred";
export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export interface SeasonDefinition {
  id: SeasonId;
  name: string;
  verb: string;
  ageRange: [number, number];
  summary: string;
  descriptors: string[];
  focusStatement: string;
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

export interface LifeCategory {
  id: string;
  label: string;
  question: string;
  icon: string;
}

export interface ActivityOption {
  id: string;
  label: string;
  category: "creative" | "social" | "physical" | "intellectual" | "spiritual" | "service" | "leisure";
}

export const seasons: SeasonDefinition[] = [
  {
    id: "spring",
    name: "Spring",
    verb: "Learn",
    ageRange: [0, 25],
    summary: "A season for orientation, identity formation, and discovering what kind of person you are becoming.",
    descriptors: ["New life", "Growth", "Hope", "Discovery", "Foundation"],
    focusStatement: "Build foundations before speed becomes the default.",
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
    descriptors: ["Full and busy", "Implement", "Achieve", "Build", "Sustain"],
    focusStatement: "Convert momentum into durable systems and meaningful commitments.",
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
    summary: "A season to harvest wisdom, reallocate attention, and widen influence through contribution rather than output.",
    descriptors: ["Harvest", "Vision", "Significance", "Mentor", "Leverage"],
    focusStatement: "Harvest intentionally and direct what you have built toward significance.",
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
    summary: "A season for simplification, blessing others, story curation, and preparing for what continues after you.",
    descriptors: ["Simplify", "Bless", "Legacy", "Rest", "Transfer"],
    focusStatement: "Reduce noise, clarify what matters, and transfer wisdom with intention.",
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

export const lifeCategories: LifeCategory[] = [
  {
    id: "financialFreedom",
    label: "Financial Freedom",
    question: "How financially free do you feel?",
    icon: "💰",
  },
  {
    id: "familyCloseness",
    label: "Family Closeness",
    question: "How close to your family are you?",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "hobbies",
    label: "Hobbies & Interests",
    question: "How active are your hobbies and interests?",
    icon: "🎨",
  },
  {
    id: "workEnjoyment",
    label: "Work Enjoyment",
    question: "When working, how much do you enjoy what you do?",
    icon: "💼",
  },
  {
    id: "restEnjoyment",
    label: "Rest & Leisure",
    question: "When not working, how fulfilling is your downtime?",
    icon: "☀️",
  },
  {
    id: "healthWellness",
    label: "Health & Wellness",
    question: "How would you rate your physical health and energy?",
    icon: "❤️",
  },
  {
    id: "purpose",
    label: "Sense of Purpose",
    question: "How strong is your sense of purpose right now?",
    icon: "🧭",
  },
];

export const activityOptions: ActivityOption[] = [
  // Creative
  { id: "painting", label: "Painting & Drawing", category: "creative" },
  { id: "writing", label: "Writing & Journaling", category: "creative" },
  { id: "music", label: "Playing Music", category: "creative" },
  { id: "photography", label: "Photography", category: "creative" },
  { id: "woodworking", label: "Woodworking & Crafts", category: "creative" },
  { id: "cooking", label: "Cooking & Baking", category: "creative" },
  { id: "gardening", label: "Gardening", category: "creative" },

  // Social
  { id: "entertaining", label: "Hosting & Entertaining", category: "social" },
  { id: "mentoring", label: "Mentoring Others", category: "social" },
  { id: "communityWork", label: "Community Involvement", category: "social" },
  { id: "familyTime", label: "Quality Family Time", category: "social" },
  { id: "friendships", label: "Deepening Friendships", category: "social" },

  // Physical
  { id: "hiking", label: "Hiking & Nature Walks", category: "physical" },
  { id: "sports", label: "Sports & Athletics", category: "physical" },
  { id: "yoga", label: "Yoga & Stretching", category: "physical" },
  { id: "swimming", label: "Swimming", category: "physical" },
  { id: "cycling", label: "Cycling", category: "physical" },
  { id: "gym", label: "Strength Training", category: "physical" },

  // Intellectual
  { id: "reading", label: "Reading", category: "intellectual" },
  { id: "learning", label: "Taking Courses & Learning", category: "intellectual" },
  { id: "puzzles", label: "Puzzles & Strategy Games", category: "intellectual" },
  { id: "technology", label: "Exploring Technology", category: "intellectual" },
  { id: "investing", label: "Investing & Finance", category: "intellectual" },

  // Spiritual
  { id: "prayer", label: "Prayer & Meditation", category: "spiritual" },
  { id: "worship", label: "Worship & Church Life", category: "spiritual" },
  { id: "scripture", label: "Scripture Study", category: "spiritual" },
  { id: "retreat", label: "Retreats & Reflection", category: "spiritual" },

  // Service
  { id: "volunteering", label: "Volunteering", category: "service" },
  { id: "teaching", label: "Teaching & Training", category: "service" },
  { id: "caregiving", label: "Caregiving", category: "service" },
  { id: "missions", label: "Missions & Outreach", category: "service" },
  { id: "nonprofit", label: "Nonprofit Work", category: "service" },

  // Leisure
  { id: "travel", label: "Travel & Exploration", category: "leisure" },
  { id: "movies", label: "Movies & Shows", category: "leisure" },
  { id: "gaming", label: "Gaming", category: "leisure" },
  { id: "fishing", label: "Fishing & Hunting", category: "leisure" },
  { id: "collecting", label: "Collecting", category: "leisure" },
  { id: "relaxing", label: "Simply Relaxing", category: "leisure" },
];

export const activityCategories = [
  { id: "creative", label: "Creative", color: "#e6b718" },
  { id: "social", label: "Social", color: "#45b649" },
  { id: "physical", label: "Physical", color: "#0f75bd" },
  { id: "intellectual", label: "Intellectual", color: "#8b5cf6" },
  { id: "spiritual", label: "Spiritual", color: "#ec4899" },
  { id: "service", label: "Service", color: "#f97316" },
  { id: "leisure", label: "Leisure", color: "#736a67" },
] as const;

export const seasonOrder: SeasonId[] = ["spring", "summer", "autumn", "winter"];

export const sacredFraming = {
  verse: "Psalm 90:10",
  excerpt:
    "Our days may come to seventy years, or eighty, if our strength endures; yet they quickly pass, and we fly away.",
};

export function getSeasonByAge(age: number, maxAge: number = 100): SeasonDefinition {
  // Scale seasons proportionally to the person's expected lifespan
  const fraction = Math.min(1, Math.max(0, age / maxAge));
  if (fraction < 0.25) return seasons[0]; // Spring
  if (fraction < 0.5) return seasons[1];  // Summer
  if (fraction < 0.75) return seasons[2]; // Autumn
  return seasons[3];                       // Winter
}

export function getScaledSeasons(maxAge: number): (SeasonDefinition & { scaledRange: [number, number] })[] {
  return seasons.map((season, i) => ({
    ...season,
    scaledRange: [
      Math.round((i * maxAge) / 4),
      Math.round(((i + 1) * maxAge) / 4),
    ] as [number, number],
  }));
}
