"use server";

import {
  listCoachWeightLogs,
  listCoachWorkouts,
} from "@/features/coach/repositories/coach.repository";
import { buildPredictionSummary } from "@/features/predictions/services/prediction.service";
import type { PredictionSummary } from "@/features/predictions/types";
import { getPreferencesAction } from "@/features/settings";
import {
  normalizeWorkoutHistoryItem,
  type RawWorkoutHistoryItem,
} from "@/features/workouts/history";
import { createClient } from "@/lib/supabase/server";
import type { WeightLog } from "@/types/weight-log";

export async function getPredictionSummaryAction(): Promise<PredictionSummary> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user)
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");

  const [rawWorkouts, rawWeightLogs, preferences] = await Promise.all([
    listCoachWorkouts(supabase, 300),
    listCoachWeightLogs(supabase, 100),
    getPreferencesAction(),
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

  return buildPredictionSummary({
    workouts,
    weightLogs,
    targetWeight: preferences.targetWeight,
  });
}
