import { describe, expect, it } from "vitest";

import { buildChallengeSummary } from "@/features/challenges";

describe("Retos semanales", () => {
  it("marca como completados los objetivos alcanzados", () => {
    const result = buildChallengeSummary({
      coach: {
        generatedAt: "",
        score: 80,
        headline: "Bien",
        weeklyTarget: 4,
        completedWorkouts: 4,
        adherencePercent: 100,
        nextWorkout: { type: "Push", slug: "push", reason: "Continuidad" },
        weeklyBrief: {
          volume: 1000,
          durationMinutes: 60,
          completedSets: 12,
          strongestExercise: null,
        },
        recommendations: [],
      },
      nutrition: {
        date: "2026-08-05",
        logs: [],
        totals: {
          calories: 2000,
          protein: 180,
          carbs: 200,
          fat: 60,
          fiber: 25,
        },
        targets: {
          calories: 2200,
          protein: 180,
          carbs: 220,
          fat: 70,
          fiber: 30,
        },
      },
      hydration: {
        date: "2026-08-05",
        amountMl: 3000,
        targetMl: 3000,
        percentage: 100,
      },
      recovery: {
        id: "1",
        userId: "user",
        recordedOn: "2026-08-05",
        sleepHours: 8,
        sleepQuality: 4,
        energy: 4,
        stress: 2,
        soreness: 2,
        restingHeartRate: null,
        notes: null,
        score: 80,
      },
      preferences: {
        userId: "user",
        displayName: "Jesús",
        targetWeight: 75,
        targetCalories: 2200,
        targetProtein: 180,
        targetCarbs: 220,
        targetFat: 70,
        targetWaterMl: 3000,
        weeklyWorkouts: 4,
        preferredTrainingTime: "20:30",
        allergies: [],
        dislikedFoods: [],
      },
    });

    expect(result.completed).toBe(4);
  });
});
