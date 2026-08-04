"use server";

import { getCoachReportAction } from "@/features/coach";
import { buildWeeklyPlan } from "@/features/planner/services/planner.service";
import { getLatestRecoveryAction } from "@/features/recovery";
import { getPreferencesAction } from "@/features/settings";

export async function getWeeklyPlanAction() {
  const [report, preferences, recovery] = await Promise.all([
    getCoachReportAction(),
    getPreferencesAction(),
    getLatestRecoveryAction(),
  ]);

  return buildWeeklyPlan(
    report,
    new Date(),
    preferences.weeklyWorkouts,
    recovery?.score ?? 65,
  );
}
