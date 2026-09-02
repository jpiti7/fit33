"use server";

import { getCoachReportAction } from "@/features/coach";
import { getNutritionDayAction } from "@/features/nutrition";
import { getLatestRecoveryAction } from "@/features/recovery";
import { getRecoveryState } from "@/features/recovery/services/recovery.service";
import { getPreviousWorkoutOfType } from "@/features/workouts/repositories/workout.repository";
import { buildAdaptiveSummary } from "@/features/adaptive/services/adaptive.service";
import { createClient } from "@/lib/supabase/server";

export async function getAdaptiveSummaryAction(workoutType?: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user)
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");

  const date = new Date().toISOString().slice(0, 10);
  const [coach, recoveryCheckin, nutrition] = await Promise.all([
    getCoachReportAction(),
    getLatestRecoveryAction(),
    getNutritionDayAction(date),
  ]);

  const recovery = getRecoveryState(recoveryCheckin?.score ?? 65);
  const selectedType = workoutType ?? coach.nextWorkout.type;
  const selectedCoach = workoutType
    ? {
        ...coach,
        nextWorkout: {
          ...coach.nextWorkout,
          type: workoutType,
          slug: typeToSlug(workoutType),
        },
      }
    : coach;

  const previousWorkout = await getPreviousWorkoutOfType(
    supabase,
    selectedType,
    new Date().toISOString(),
  );

  return buildAdaptiveSummary({
    coach: selectedCoach,
    recovery,
    nutrition,
    previousWorkout,
  });
}

function typeToSlug(type: string) {
  const map: Record<string, string> = {
    Push: "push",
    "Pierna A": "pierna-a",
    Pull: "pull",
    "Pierna B + hombro": "pierna-b-hombro",
  };
  return map[type] ?? "push";
}
