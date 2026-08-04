import type { AchievementSummary } from "@/features/achievements";
import type { CoachReport } from "@/features/coach";
import type { NutritionDay } from "@/features/nutrition";
import type { WeeklyPlan } from "@/features/planner";
import type { RecoveryCheckin } from "@/features/recovery";
import type { HydrationDay, UserPreferences } from "@/features/settings";

export type TodayData = {
  preferences: UserPreferences;
  coach: CoachReport;
  nutrition: NutritionDay;
  hydration: HydrationDay;
  plan: WeeklyPlan;
  achievements: AchievementSummary;
  recovery: RecoveryCheckin | null;
};
