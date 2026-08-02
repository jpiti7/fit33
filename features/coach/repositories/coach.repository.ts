import type { SupabaseClient } from "@supabase/supabase-js";

import { listWorkouts } from "@/features/workouts/repositories/workout.repository";

export async function listCoachWorkouts(supabase: SupabaseClient, limit = 250) {
  return listWorkouts(supabase, limit);
}

export async function listCoachWeightLogs(
  supabase: SupabaseClient,
  limit = 60,
) {
  const { data, error } = await supabase
    .from("weight_logs")
    .select("id, user_id, created_at, weight, waist, body_fat, notes")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`No se pudieron cargar los pesos: ${error.message}`);
  }

  return data ?? [];
}
