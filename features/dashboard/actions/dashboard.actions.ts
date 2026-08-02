"use server";

import { listWorkoutsForAnalytics } from "@/features/analytics/repositories/analytics.repository";
import { buildTrainingAnalytics } from "@/features/analytics/services/analytics.service";
import { buildDashboardTrainingData } from "@/features/dashboard/services/dashboard.service";
import type { DashboardTrainingData } from "@/features/dashboard/types";
import type { RawWorkoutHistoryItem } from "@/features/workouts/history";
import { createClient } from "@/lib/supabase/server";

export async function getDashboardTrainingDataAction(): Promise<DashboardTrainingData> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");
  }

  const rawWorkouts = (await listWorkoutsForAnalytics(
    supabase,
  )) as RawWorkoutHistoryItem[];
  const analytics = buildTrainingAnalytics(rawWorkouts);

  return buildDashboardTrainingData(analytics);
}
