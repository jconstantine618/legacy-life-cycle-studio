import { describe, it, expect } from "vitest";
import { buildLifeCoachInsight, type LifecycleProfile } from "@/lib/lifecycleEngine";
import { getSeasonByAge, getScaledSeasons } from "@/data/lifecycle";

const sampleProfile: LifecycleProfile = {
  age: 45,
  expectedLifespan: 80,
  worldview: "secular",
  occupation: "Software engineer",
  scores: {
    financialFreedom: 7,
    familyCloseness: 6,
    hobbies: 3,
    workEnjoyment: 8,
    restEnjoyment: 4,
    healthWellness: 5,
    purpose: 7,
  },
  selectedActivities: ["reading", "hiking", "mentoring"],
  workEnjoysMost: "Solving complex problems",
  restEnjoysMost: "Spending time outdoors",
};

describe("getSeasonByAge", () => {
  it("returns Spring for young ages", () => {
    expect(getSeasonByAge(10, 80).id).toBe("spring");
  });

  it("returns Summer for mid-life ages", () => {
    expect(getSeasonByAge(30, 80).id).toBe("summer");
  });

  it("returns Autumn for later ages", () => {
    expect(getSeasonByAge(55, 80).id).toBe("autumn");
  });

  it("returns Winter for elder ages", () => {
    expect(getSeasonByAge(75, 80).id).toBe("winter");
  });
});

describe("getScaledSeasons", () => {
  it("returns 4 seasons with scaled ranges", () => {
    const scaled = getScaledSeasons(80);
    expect(scaled).toHaveLength(4);
    expect(scaled[0].scaledRange).toEqual([0, 20]);
    expect(scaled[3].scaledRange).toEqual([60, 80]);
  });
});

describe("buildLifeCoachInsight", () => {
  it("generates insight for a sample profile", () => {
    const insight = buildLifeCoachInsight(sampleProfile);

    expect(insight.currentSeason).toBeDefined();
    expect(insight.yearsLived).toBe(45);
    expect(insight.yearsRemaining).toBe(35);
    expect(insight.fiveYearSegments.length).toBeGreaterThan(0);
    expect(insight.narrative.length).toBeGreaterThan(0);
    expect(insight.reflectionPrompts.length).toBeGreaterThan(0);
    expect(insight.nextFiveYearFocus.length).toBeGreaterThan(0);
  });

  it("identifies strengths and growth areas", () => {
    const insight = buildLifeCoachInsight(sampleProfile);
    expect(insight.strengths.length).toBeGreaterThan(0);
    expect(insight.growthAreas.length).toBeGreaterThan(0);
  });

  it("uses sacred framing when worldview is sacred", () => {
    const sacredProfile = { ...sampleProfile, worldview: "sacred" as const };
    const insight = buildLifeCoachInsight(sacredProfile);
    expect(insight.narrative).toContain("God");
  });
});
