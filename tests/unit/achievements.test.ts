import { describe, expect, it } from "vitest";

import { buildAchievementSummary } from "@/features/achievements/services/achievement.service";
import type { WorkoutHistoryItem } from "@/features/workouts/history";
import type { WeightLog } from "@/types/weight-log";

function workout(date: string, weight = 80): WorkoutHistoryItem {
  return {
    id: date,
    workoutType: "Push",
    startedAt: date,
    finishedAt: date,
    durationMinutes: 60,
    notes: null,
    exercises: [
      {
        id: `exercise-${date}`,
        name: "Press banca",
        muscleGroup: "Pecho",
        order: 0,
        sets: [
          {
            id: `set-${date}`,
            setNumber: 1,
            weight,
            reps: 8,
            rir: 2,
            completed: true,
          },
        ],
      },
    ],
  };
}

describe("Achievement Engine", () => {
  it("desbloquea el primer entrenamiento y el club de los 100", () => {
    const summary = buildAchievementSummary({
      workouts: [workout("2026-08-03T10:00:00.000Z", 100)],
      weightLogs: [],
      now: new Date("2026-08-04T12:00:00.000Z"),
    });

    expect(
      summary.achievements.find((item) => item.id === "first-workout")
        ?.unlocked,
    ).toBe(true);
    expect(
      summary.achievements.find((item) => item.id === "hundred-kilos")
        ?.unlocked,
    ).toBe(true);
  });

  it("detecta cinco kilos perdidos", () => {
    const weightLogs: WeightLog[] = [
      {
        id: "1",
        user_id: "u",
        created_at: "2026-01-01T08:00:00.000Z",
        weight: 82,
        waist: null,
        body_fat: null,
        notes: null,
      },
      {
        id: "2",
        user_id: "u",
        created_at: "2026-08-01T08:00:00.000Z",
        weight: 76.8,
        waist: null,
        body_fat: null,
        notes: null,
      },
    ];

    const summary = buildAchievementSummary({ workouts: [], weightLogs });
    expect(
      summary.achievements.find((item) => item.id === "five-kilos-lost")
        ?.unlocked,
    ).toBe(true);
  });
});
