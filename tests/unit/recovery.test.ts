import { describe, expect, it } from "vitest";

import { calculateRecoveryScore, getRecoveryState } from "@/features/recovery";

describe("Recovery Engine", () => {
  it("clasifica una recuperación alta", () => {
    const score = calculateRecoveryScore({
      recordedOn: "2026-08-05",
      sleepHours: 8,
      sleepQuality: 5,
      soreness: 1,
      stress: 1,
      energy: 5,
      restingHeartRate: 58,
      notes: null,
    });

    expect(score).toBeGreaterThanOrEqual(75);
    expect(getRecoveryState(score).status).toBe("ready");
  });

  it("recomienda reducir carga con recuperación baja", () => {
    const score = calculateRecoveryScore({
      recordedOn: "2026-08-05",
      sleepHours: 4,
      sleepQuality: 1,
      soreness: 5,
      stress: 5,
      energy: 1,
      restingHeartRate: null,
      notes: null,
    });

    expect(getRecoveryState(score).status).toBe("low");
  });
});
