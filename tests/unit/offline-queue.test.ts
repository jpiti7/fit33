import { describe, expect, it } from "vitest";

import { deduplicatePendingWorkouts } from "@/lib/offline/queue";
import type { PendingWorkout } from "@/lib/offline/types";

function pending(clientId: string, createdAt: string): PendingWorkout {
  return {
    id: clientId,
    clientId,
    startedAt: createdAt,
    createdAt,
    attempts: 0,
    lastError: null,
    values: { workoutType: "Push", notes: "", exercises: [] },
  };
}

describe("Offline workout queue", () => {
  it("elimina duplicados por clientId", () => {
    const result = deduplicatePendingWorkouts([
      pending("a", "2026-08-01T10:00:00.000Z"),
      pending("a", "2026-08-01T10:01:00.000Z"),
      pending("b", "2026-08-01T10:02:00.000Z"),
    ]);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.clientId)).toEqual(["a", "b"]);
  });
});
