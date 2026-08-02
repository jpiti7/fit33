"use server";

import { buildTrainingAnalytics } from "@/features/analytics/services/analytics.service";
import {
  listCoachWeightLogs,
  listCoachWorkouts,
} from "@/features/coach/repositories/coach.repository";
import { buildCoachReport } from "@/features/coach/services/coach.service";
import type { CoachReport } from "@/features/coach/types";
import {
  normalizeWorkoutHistoryItem,
  type RawWorkoutHistoryItem,
} from "@/features/workouts/history";
import { createClient } from "@/lib/supabase/server";
import type { WeightLog } from "@/types/weight-log";

export async function getCoachReportAction(): Promise<CoachReport> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user)
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");

  const [rawWorkouts, rawWeightLogs] = await Promise.all([
    listCoachWorkouts(supabase),
    listCoachWeightLogs(supabase),
  ]);
  const now = new Date();
  const workouts = (rawWorkouts as RawWorkoutHistoryItem[]).map(
    normalizeWorkoutHistoryItem,
  );
  const weightLogs = (rawWeightLogs as WeightLog[]).map((log) => ({
    ...log,
    weight: Number(log.weight),
    waist: log.waist === null ? null : Number(log.waist),
    body_fat: log.body_fat === null ? null : Number(log.body_fat),
  }));

  return buildCoachReport({
    analytics: buildTrainingAnalytics(
      rawWorkouts as RawWorkoutHistoryItem[],
      now,
    ),
    workouts,
    weightLogs,
    now,
  });
}
