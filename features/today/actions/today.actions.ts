"use server";

import { getAchievementSummaryAction } from "@/features/achievements";
import { getCoachReportAction } from "@/features/coach";
import { getChallengeSummaryAction } from "@/features/challenges";
import { getNutritionDayAction } from "@/features/nutrition";
import { getWeeklyPlanAction } from "@/features/planner";
import { getPredictionSummaryAction } from "@/features/predictions";
import { getLatestRecoveryAction } from "@/features/recovery";
import {
  getHydrationDayAction,
  getPreferencesAction,
} from "@/features/settings";
import type { TodayData } from "@/features/today/types";

export async function getTodayDataAction(): Promise<TodayData> {
  const date = new Date().toISOString().slice(0, 10);
  const [
    preferences,
    coach,
    nutrition,
    hydration,
    plan,
    achievements,
    recovery,
    predictions,
    challenges,
  ] = await Promise.all([
    getPreferencesAction(),
    getCoachReportAction(),
    getNutritionDayAction(date),
    getHydrationDayAction(date),
    getWeeklyPlanAction(),
    getAchievementSummaryAction(),
    getLatestRecoveryAction(),
    getPredictionSummaryAction(),
    getChallengeSummaryAction(),
  ]);

  return {
    preferences,
    coach,
    nutrition,
    hydration,
    plan,
    achievements,
    recovery,
    predictions,
    challenges,
  };
}
