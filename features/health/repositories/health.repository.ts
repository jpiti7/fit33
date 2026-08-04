import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AppleHealthSnapshot,
  StoredHealthSnapshot,
} from "@/features/health/types";

function mapRow(row: Record<string, unknown>): StoredHealthSnapshot {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    recordedOn: String(row.recorded_on),
    steps: Number(row.steps ?? 0),
    activeEnergyKcal: Number(row.active_energy_kcal ?? 0),
    restingHeartRate:
      row.resting_heart_rate === null ? null : Number(row.resting_heart_rate),
    sleepMinutes: Number(row.sleep_minutes ?? 0),
    bodyMassKg: row.body_mass_kg === null ? null : Number(row.body_mass_kg),
    workoutMinutes: Number(row.workout_minutes ?? 0),
    workoutCount: Number(row.workout_count ?? 0),
    source: "apple-health",
    syncedAt: String(row.synced_at),
  };
}

export async function upsertHealthSnapshot(
  supabase: SupabaseClient,
  userId: string,
  snapshot: AppleHealthSnapshot,
) {
  const { data, error } = await supabase
    .from("health_daily_snapshots")
    .upsert(
      {
        user_id: userId,
        recorded_on: snapshot.recordedOn,
        steps: snapshot.steps,
        active_energy_kcal: snapshot.activeEnergyKcal,
        resting_heart_rate: snapshot.restingHeartRate,
        sleep_minutes: snapshot.sleepMinutes,
        body_mass_kg: snapshot.bodyMassKg,
        workout_minutes: snapshot.workoutMinutes,
        workout_count: snapshot.workoutCount,
        source: snapshot.source,
        synced_at: new Date().toISOString(),
      },
      { onConflict: "user_id,recorded_on,source" },
    )
    .select("*")
    .single();

  if (error)
    throw new Error(`No se pudo sincronizar Apple Health: ${error.message}`);
  return mapRow(data);
}

export async function findLatestHealthSnapshot(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("health_daily_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error)
    throw new Error(`No se pudo cargar Apple Health: ${error.message}`);
  return data ? mapRow(data) : null;
}
