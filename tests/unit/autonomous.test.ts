import { describe, expect, it } from "vitest";
import { buildAutonomousSummary } from "@/features/autonomous/services/autonomous.service";
import type { CoachReport } from "@/features/coach/types";
import type { NutritionDay } from "@/features/nutrition/types";
import type { RecoveryState } from "@/features/recovery/types";

const coach = (overrides: Partial<CoachReport> = {}): CoachReport => ({
  generatedAt: "2026-09-02T00:00:00.000Z",
  score: 80,
  headline: "Bien",
  weeklyTarget: 4,
  completedWorkouts: 4,
  adherencePercent: 90,
  nextWorkout: { type: "Push", slug: "push", reason: "Hoy" },
  weeklyBrief: {
    volume: 10,
    durationMinutes: 40,
    completedSets: 20,
    strongestExercise: "Press banca",
  },
  recommendations: [],
  ...overrides,
});

const recovery: RecoveryState = {
  score: 80,
  status: "ready",
  label: "Buena",
  recommendation: "Puedes progresar.",
};
const nutrition: NutritionDay = {
  date: "2026-09-02",
  logs: [],
  totals: { calories: 1800, protein: 150, carbs: 180, fat: 60, fiber: 25 },
  targets: { calories: 2200, protein: 160, carbs: 220, fat: 70, fiber: 30 },
};

describe("Coach autónomo", () => {
  it("propone reorganizar cuando faltan entrenamientos", () => {
    const result = buildAutonomousSummary({
      coach: coach({ completedWorkouts: 2 }),
      recovery,
      nutrition,
    });
    expect(result.proposals.some((p) => p.id === "reorganize-training")).toBe(
      true,
    );
  });

  it("propone proteger recuperación cuando el score es bajo", () => {
    const result = buildAutonomousSummary({
      coach: coach(),
      recovery: {
        score: 40,
        status: "low",
        label: "Baja",
        recommendation: "Reduce.",
      },
      nutrition,
    });
    expect(result.proposals.some((p) => p.id === "reduce-training")).toBe(true);
  });

  it("propone revisar nutrición con proteína baja", () => {
    const lowProtein = {
      ...nutrition,
      totals: { ...nutrition.totals, protein: 80 },
    };
    const result = buildAutonomousSummary({
      coach: coach(),
      recovery,
      nutrition: lowProtein,
    });
    expect(result.proposals.some((p) => p.id === "nutrition-review")).toBe(
      true,
    );
  });
});
