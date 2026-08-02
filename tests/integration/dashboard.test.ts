import { describe, expect, it } from "vitest";

type WorkoutSummaryInput = {
  durationMinutes: number;
  completedSets: number;
  totalVolume: number;
};

type WeeklySummary = {
  workouts: number;
  durationMinutes: number;
  completedSets: number;
  totalVolume: number;
};

describe("Dashboard Fit33", () => {
  it("genera un resumen semanal coherente", () => {
    const workouts: WorkoutSummaryInput[] = [
      {
        durationMinutes: 60,
        completedSets: 20,
        totalVolume: 12000,
      },
      {
        durationMinutes: 70,
        completedSets: 22,
        totalVolume: 13500,
      },
    ];

    const initialSummary: WeeklySummary = {
      workouts: 0,
      durationMinutes: 0,
      completedSets: 0,
      totalVolume: 0,
    };

    const summary = workouts.reduce<WeeklySummary>(
      (result, workout) => ({
        workouts: result.workouts + 1,
        durationMinutes: result.durationMinutes + workout.durationMinutes,
        completedSets: result.completedSets + workout.completedSets,
        totalVolume: result.totalVolume + workout.totalVolume,
      }),
      initialSummary,
    );

    expect(summary).toEqual({
      workouts: 2,
      durationMinutes: 130,
      completedSets: 42,
      totalVolume: 25500,
    });
  });

  it("funciona cuando todavía no hay entrenamientos", () => {
    const workouts: WorkoutSummaryInput[] = [];

    expect(workouts).toHaveLength(0);
  });
});
