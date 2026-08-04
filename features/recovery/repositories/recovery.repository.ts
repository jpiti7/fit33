import type { SupabaseClient } from "@supabase/supabase-js";

import type { RecoveryCheckin, RecoveryInput } from "@/features/recovery/types";
import { calculateRecoveryScore } from "@/features/recovery/services/recovery.service";

function mapRow(row: Record<string, unknown>): RecoveryCheckin {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    recordedOn: String(row.recorded_on),
    sleepHours: Number(row.sleep_hours),
    sleepQuality: Number(row.sleep_quality),
    soreness: Number(row.soreness),
    stress: Number(row.stress),
    energy: Number(row.energy),
    restingHeartRate:
      row.resting_heart_rate === null ? null : Number(row.resting_heart_rate),
    notes: row.notes === null ? null : String(row.notes),
    score: Number(row.score),
  };
}

export async function findLatestRecoveryCheckin(
  supabase: SupabaseClient,
  userId: string,
): Promise<RecoveryCheckin | null> {
  const { data, error } = await supabase
    .from("recovery_checkins")
    .select(
      "id, user_id, recorded_on, sleep_hours, sleep_quality, soreness, stress, energy, resting_heart_rate, notes, score",
    )
    .eq("user_id", userId)
    .order("recorded_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo cargar la recuperación: ${error.message}`);
  }

  return data ? mapRow(data) : null;
}

export async function upsertRecoveryCheckin(
  supabase: SupabaseClient,
  userId: string,
  input: RecoveryInput,
) {
  const score = calculateRecoveryScore(input);
  const { data, error } = await supabase
    .from("recovery_checkins")
    .upsert(
      {
        user_id: userId,
        recorded_on: input.recordedOn,
        sleep_hours: input.sleepHours,
        sleep_quality: input.sleepQuality,
        soreness: input.soreness,
        stress: input.stress,
        energy: input.energy,
        resting_heart_rate: input.restingHeartRate,
        notes: input.notes,
        score,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,recorded_on" },
    )
    .select(
      "id, user_id, recorded_on, sleep_hours, sleep_quality, soreness, stress, energy, resting_heart_rate, notes, score",
    )
    .single();

  if (error) {
    throw new Error(`No se pudo guardar la recuperación: ${error.message}`);
  }

  return mapRow(data);
}
