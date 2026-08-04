"use server";

import {
  listCoachWeightLogs,
  listCoachWorkouts,
} from "@/features/coach/repositories/coach.repository";
import { buildAchievementSummary } from "@/features/achievements/services/achievement.service";
import type { AchievementSummary } from "@/features/achievements/types";
import {
  normalizeWorkoutHistoryItem,
  type RawWorkoutHistoryItem,
} from "@/features/workouts/history";
import { createClient } from "@/lib/supabase/server";
import type { WeightLog } from "@/types/weight-log";

export async function getAchievementSummaryAction(): Promise<AchievementSummary> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");
  }

  const [rawWorkouts, rawWeightLogs] = await Promise.all([
    listCoachWorkouts(supabase, 500),
    listCoachWeightLogs(supabase, 200),
  ]);

  const workouts = (rawWorkouts as RawWorkoutHistoryItem[]).map(
    normalizeWorkoutHistoryItem,
  );
  const weightLogs = (rawWeightLogs as WeightLog[]).map((log) => ({
    ...log,
    weight: Number(log.weight),
    waist: log.waist === null ? null : Number(log.waist),
    body_fat: log.body_fat === null ? null : Number(log.body_fat),
  }));

  return buildAchievementSummary({ workouts, weightLogs });
}
