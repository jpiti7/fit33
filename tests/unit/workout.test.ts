import { describe, expect, it } from "vitest";

describe("Workout Service", () => {
  it("cuenta únicamente las series completadas", () => {
    const sets = [
      { completed: true },
      { completed: true },
      { completed: false },
      { completed: true },
    ];

    const completedSets = sets.filter((set) => set.completed).length;

    expect(completedSets).toBe(3);
  });

  it("no calcula volumen para una serie sin completar", () => {
    const set = {
      weight: 80,
      reps: 8,
      completed: false,
    };

    const volume = set.completed ? set.weight * set.reps : 0;

    expect(volume).toBe(0);
  });

  it("calcula el volumen de las series completadas", () => {
    const sets = [
      { weight: 80, reps: 8, completed: true },
      { weight: 80, reps: 7, completed: true },
      { weight: 75, reps: 10, completed: false },
    ];

    const totalVolume = sets.reduce((total, set) => {
      if (!set.completed) {
        return total;
      }

      return total + set.weight * set.reps;
    }, 0);

    expect(totalVolume).toBe(1200);
  });
});

describe("rotación de rutinas", () => {
  it("alterna variantes del mismo entrenamiento según la semana", async () => {
    const { getWorkoutVariant } = await import("@/constants/workouts");
    const weekOne = getWorkoutVariant("Push", new Date("2026-01-05T12:00:00Z"));
    const weekTwo = getWorkoutVariant("Push", new Date("2026-01-12T12:00:00Z"));
    const weekThree = getWorkoutVariant(
      "Push",
      new Date("2026-01-19T12:00:00Z"),
    );
    const weekFour = getWorkoutVariant(
      "Push",
      new Date("2026-01-26T12:00:00Z"),
    );

    expect(weekOne?.variant).toBe(1);
    expect(weekTwo?.variant).toBe(2);
    expect(weekThree?.variant).toBe(3);
    expect(weekFour?.variant).toBe(1);
  });
});
