import { describe, expect, it } from "vitest";

import { buildPredictionSummary } from "@/features/predictions";

const weightLog = (created_at: string, weight: number) => ({
  id: created_at,
  user_id: "user",
  created_at,
  weight,
  waist: null,
  body_fat: null,
  notes: null,
});

describe("Predicciones Fit33", () => {
  it("estima semanas hasta el objetivo cuando la tendencia avanza", () => {
    const result = buildPredictionSummary({
      weightLogs: [
        weightLog("2026-07-01T08:00:00.000Z", 82),
        weightLog("2026-07-15T08:00:00.000Z", 81),
        weightLog("2026-07-29T08:00:00.000Z", 80),
      ],
      workouts: [],
      targetWeight: 75,
      now: new Date("2026-08-01T08:00:00.000Z"),
    });

    expect(result.weight.weeklyChangeKg).toBeLessThan(0);
    expect(result.weight.estimatedWeeks).not.toBeNull();
  });
});
