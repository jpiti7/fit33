import { describe, expect, it } from "vitest";

import { buildAdaptiveSummary } from "@/features/adaptive/services/adaptive.service";
import { getWorkoutTemplate } from "@/constants/workouts";
import type { CoachReport } from "@/features/coach/types";
import type { NutritionDay } from "@/features/nutrition/types";
import type { RecoveryState } from "@/features/recovery/types";

const coach = {
  generatedAt: new Date().toISOString(),
  score: 90,
  headline: "Semana sólida",
  weeklyTarget: 4,
  completedWorkouts: 4,
  adherencePercent: 100,
  nextWorkout: { type: "Push", slug: "push", reason: "Siguiente sesión" },
  weeklyBrief: {
    volume: 1000,
    durationMinutes: 200,
    completedSets: 40,
    strongestExercise: "Press banca",
  },
  recommendations: [],
} as CoachReport;

const nutrition = {
  date: "2026-08-31",
  logs: [],
  totals: { calories: 1800, protein: 180, carbs: 200, fat: 60, fiber: 25 },
  targets: { calories: 2300, protein: 180, carbs: 220, fat: 70, fiber: 30 },
} as NutritionDay;

const recovery = {
  score: 90,
  status: "ready",
  label: "Preparado",
  recommendation: "Puedes progresar.",
} as RecoveryState;

function currentPushExerciseName() {
  return getWorkoutTemplate("Push")!.exercises[0].name;
}

function previousWorkoutFor(exerciseName: string) {
  return {
    exercises: [
      {
        exercise_name: exerciseName,
        sets: [
          { weight: 70, reps: 8, rir: 2, completed: true },
          { weight: 70, reps: 8, rir: 2, completed: true },
          { weight: 70, reps: 8, rir: 2, completed: true },
        ],
      },
    ],
  };
}

describe("Adaptive Engine", () => {
  it("propone subir cuando se alcanza el extremo alto con margen", () => {
    const exerciseName = currentPushExerciseName();
    const result = buildAdaptiveSummary({
      coach,
      recovery,
      nutrition,
      previousWorkout: previousWorkoutFor(exerciseName),
    });
    const exercise = result.workout.exercises.find(
      (item) => item.name === exerciseName,
    );

    expect(exercise?.action).toBe("increase");
    expect(exercise?.suggestedWeight).toBe(72);
  });

  it("reduce la carga cuando la recuperación es baja", () => {
    const lowRecovery = {
      ...recovery,
      score: 40,
      status: "low",
      label: "Recuperación baja",
    } as RecoveryState;
    const exerciseName = currentPushExerciseName();
    const result = buildAdaptiveSummary({
      coach,
      recovery: lowRecovery,
      nutrition,
      previousWorkout: previousWorkoutFor(exerciseName),
    });
    const exercise = result.workout.exercises.find(
      (item) => item.name === exerciseName,
    );

    expect(exercise?.action).toBe("decrease");
    expect(exercise?.suggestedWeight).toBe(63);
    expect(result.workout.intensity).toBe("reduced");
  });

  it("pide establecer carga cuando no existe historial del ejercicio", () => {
    const result = buildAdaptiveSummary({
      coach,
      recovery,
      nutrition,
      previousWorkout: null,
    });
    const firstExercise = result.workout.exercises[0];

    expect(firstExercise.action).toBe("start");
    expect(firstExercise.suggestedWeight).toBeNull();
  });
});
