import type { SupabaseClient } from "@supabase/supabase-js";

import { listWorkouts } from "@/features/workouts/repositories/workout.repository";

export async function listWorkoutsForAnalytics(
  supabase: SupabaseClient,
  limit = 250,
) {
  return listWorkouts(supabase, limit);
}
