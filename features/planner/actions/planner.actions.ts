"use server";

import { getCoachReportAction } from "@/features/coach";
import { buildWeeklyPlan } from "@/features/planner/services/planner.service";
import { getPreferencesAction } from "@/features/settings";

export async function getWeeklyPlanAction() {
  const [report, preferences] = await Promise.all([
    getCoachReportAction(),
    getPreferencesAction(),
  ]);
  return buildWeeklyPlan(report, new Date(), preferences.weeklyWorkouts);
}
