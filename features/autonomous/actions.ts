"use server";

import { getCoachReportAction } from "@/features/coach";
import { getNutritionDayAction } from "@/features/nutrition";
import { getLatestRecoveryAction } from "@/features/recovery";
import { getRecoveryState } from "@/features/recovery/services/recovery.service";
import { buildAutonomousSummary } from "@/features/autonomous/services/autonomous.service";
import type { AutonomousActionKind } from "@/features/autonomous/types";

export async function getAutonomousSummaryAction() {
  const date = new Date().toISOString().slice(0, 10);
  const [coach, recoveryCheckin, nutrition] = await Promise.all([
    getCoachReportAction(),
    getLatestRecoveryAction(),
    getNutritionDayAction(date),
  ]);

  return buildAutonomousSummary({
    coach,
    recovery: getRecoveryState(recoveryCheckin?.score ?? 65),
    nutrition,
  });
}

export async function acknowledgeAutonomousAction(kind: AutonomousActionKind) {
  // The action is deliberately confirmation-only in v7.0: no workout or nutrition
  // mutation is performed without an explicit, dedicated flow. This keeps the
  // autonomous coach safe while giving us a stable seam for future persistence.
  return {
    success: true as const,
    kind,
    message:
      "Acción aceptada. Fit33 te lleva al flujo correspondiente para confirmar el cambio.",
  };
}
