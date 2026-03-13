import { describe, expect, it } from "vitest";
import { buildLifecycleRoadmap, getSeasonByAge } from "@/lib/lifecycleEngine";
import { defaultLifecycleProfile } from "@/lib/lifecycleProfile";

describe("lifecycleEngine", () => {
  it("maps ages to quarter-life seasons", () => {
    expect(getSeasonByAge(12).id).toBe("spring");
    expect(getSeasonByAge(38).id).toBe("summer");
    expect(getSeasonByAge(63).id).toBe("autumn");
    expect(getSeasonByAge(88).id).toBe("winter");
  });

  it("builds a roadmap with season-specific focus areas", () => {
    const roadmap = buildLifecycleRoadmap({
      ...defaultLifecycleProfile,
      age: 63,
      occupation: "I run a family business and still carry most decisions.",
      passions: "Mentoring, family continuity, and generosity.",
      futureVision: "I want a slower pace and a stronger legacy beyond work.",
      selectedDomains: ["legacy", "stewardship", "relationships"],
      priorities: ["legacy", "transition"],
      notes: "Preparing for retirement and family conversations.",
      scenario: "I do not know when to retire and I am afraid I will lose my purpose.",
    });

    expect(roadmap.season.id).toBe("autumn");
    expect(roadmap.focusAreas).toHaveLength(3);
    expect(roadmap.focusAreas[0].actions.length).toBeGreaterThan(0);
    expect(roadmap.reflectionPrompts.some((prompt) => prompt.includes("family"))).toBe(true);
    expect(roadmap.scenarioGuidance.label).toBe("Retirement discernment");
    expect(roadmap.scenarioGuidance.nextSteps.length).toBeGreaterThan(0);
  });
});
