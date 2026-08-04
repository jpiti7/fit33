"use server";

import { getAchievementSummaryAction } from "@/features/achievements";
import { getCoachReportAction } from "@/features/coach";
import { getNutritionDayAction } from "@/features/nutrition";
import { getWeeklyPlanAction } from "@/features/planner";
import {
  getHydrationDayAction,
  getPreferencesAction,
} from "@/features/settings";
import type { TodayData } from "@/features/today/types";

export async function getTodayDataAction(): Promise<TodayData> {
  const date = new Date().toISOString().slice(0, 10);
  const [preferences, coach, nutrition, hydration, plan, achievements] =
    await Promise.all([
      getPreferencesAction(),
      getCoachReportAction(),
      getNutritionDayAction(date),
      getHydrationDayAction(date),
      getWeeklyPlanAction(),
      getAchievementSummaryAction(),
    ]);

  return { preferences, coach, nutrition, hydration, plan, achievements };
}
