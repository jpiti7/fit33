import { describe, expect, it } from "vitest";
import { buildDecisionPreviews } from "@/features/autonomous/services/decision.service";
import type { AutonomousSummary } from "@/features/autonomous/types";

function summary(
  kinds: AutonomousSummary["proposals"][number]["kind"][],
): AutonomousSummary {
  return {
    score: 62,
    headline: "Hay margen de mejora.",
    proposals: kinds.map((kind, index) => ({
      id: `${kind}-${index}`,
      kind,
      title: kind,
      message: "Propuesta de prueba",
      priority: "medium",
      cta: "Revisar",
    })),
    context: {
      adherencePercent: 80,
      recoveryScore: 60,
      proteinPercent: 70,
      completedWorkouts: 2,
      weeklyTarget: 4,
    },
  };
}

describe("Coach Adaptativo 2.0", () => {
  it("genera una vista previa por propuesta", () => {
    const result = buildDecisionPreviews(
      summary([
        "reorganize_training",
        "reduce_training",
        "nutrition_review",
        "recovery_checkin",
      ]),
    );

    expect(result).toHaveLength(4);
    expect(result.map((item) => item.action)).toEqual([
      "reorganize_training",
      "reduce_training",
      "nutrition_review",
      "recovery_checkin",
    ]);
  });

  it("incluye pasos accionables y un impacto", () => {
    const result = buildDecisionPreviews(summary(["reorganize_training"]));

    expect(result[0].impact.length).toBeGreaterThan(0);
    expect(result[0].steps.length).toBeGreaterThanOrEqual(3);
  });
});
