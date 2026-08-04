"use server";

import { buildChallengeSummary } from "@/features/challenges/services/challenge.service";
import type { ChallengeSummary } from "@/features/challenges/types";
import { getCoachReportAction } from "@/features/coach";
import { getNutritionDayAction } from "@/features/nutrition";
import { getLatestRecoveryAction } from "@/features/recovery";
import {
  getHydrationDayAction,
  getPreferencesAction,
} from "@/features/settings";

export async function getChallengeSummaryAction(): Promise<ChallengeSummary> {
  const date = new Date().toISOString().slice(0, 10);
  const [coach, nutrition, hydration, recovery, preferences] =
    await Promise.all([
      getCoachReportAction(),
      getNutritionDayAction(date),
      getHydrationDayAction(date),
      getLatestRecoveryAction(),
      getPreferencesAction(),
    ]);
  return buildChallengeSummary({
    coach,
    nutrition,
    hydration,
    recovery,
    preferences,
  });
}
