import { describe, expect, it } from "vitest";

import { answerCoachQuestion } from "@/features/coach-chat/services/coach-chat.service";

describe("Coach conversacional", () => {
  it("responde con la sesión recomendada", () => {
    const response = answerCoachQuestion("¿Qué entreno hoy?", {
      report: {
        generatedAt: "",
        score: 80,
        headline: "Bien",
        weeklyTarget: 4,
        completedWorkouts: 2,
        adherencePercent: 50,
        nextWorkout: { type: "Pull", slug: "pull", reason: "Equilibrar" },
        weeklyBrief: {
          volume: 0,
          durationMinutes: 0,
          completedSets: 0,
          strongestExercise: null,
        },
        recommendations: [],
      },
      nutrition: {
        date: "2026-08-04",
        logs: [],
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        targets: {
          calories: 2300,
          protein: 180,
          carbs: 220,
          fat: 70,
          fiber: 30,
        },
      },
      plan: {
        weekStart: "2026-08-03",
        sessions: [
          {
            day: "miércoles",
            date: "2026-08-05",
            type: "Pull",
            slug: "pull",
            focus: "Espalda",
            reason: "Equilibrar",
          },
        ],
        recoveryDays: [],
      },
      preferences: {
        userId: "1",
        displayName: "Jesús",
        targetWeight: 75,
        targetCalories: 2300,
        targetProtein: 180,
        targetCarbs: 220,
        targetFat: 70,
        targetWaterMl: 3000,
        weeklyWorkouts: 4,
        preferredTrainingTime: "20:30",
        allergies: [],
        dislikedFoods: [],
      },
      hydrationMl: 1000,
    });

    expect(response.answer).toContain("Pull");
    expect(response.source).toBe("rules");
  });
});
