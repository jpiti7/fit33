import { describe, expect, it } from "vitest";

import { buildWeeklyPlan } from "@/features/planner/services/planner.service";
import type { CoachReport } from "@/features/coach";

const report: CoachReport = {
  generatedAt: "2026-08-03T08:00:00.000Z",
  score: 80,
  headline: "Semana sólida",
  weeklyTarget: 4,
  completedWorkouts: 2,
  adherencePercent: 50,
  nextWorkout: { type: "Pull", slug: "pull", reason: "Equilibrar la semana" },
  weeklyBrief: {
    volume: 10000,
    durationMinutes: 120,
    completedSets: 30,
    strongestExercise: "Press banca",
  },
  recommendations: [],
};

describe("Planificador Fit33", () => {
  it("crea cuatro sesiones y empieza por la recomendada", () => {
    const plan = buildWeeklyPlan(report, new Date("2026-08-05T12:00:00Z"), 4);
    expect(plan.sessions).toHaveLength(4);
    expect(plan.sessions[0].slug).toBe("pull");
    expect(plan.recoveryDays).toHaveLength(3);
  });
});
