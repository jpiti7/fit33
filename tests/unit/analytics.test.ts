import { describe, expect, it } from "vitest";

describe("Analytics Engine", () => {
  it("calcula correctamente el volumen de una serie", () => {
    const weight = 80;
    const reps = 8;

    const volume = weight * reps;

    expect(volume).toBe(640);
  });

  it("calcula el volumen total de varias series", () => {
    const sets = [
      { weight: 80, reps: 8 },
      { weight: 80, reps: 7 },
      { weight: 75, reps: 10 },
    ];

    const totalVolume = sets.reduce(
      (total, set) => total + set.weight * set.reps,
      0,
    );

    expect(totalVolume).toBe(1950);
  });
});
