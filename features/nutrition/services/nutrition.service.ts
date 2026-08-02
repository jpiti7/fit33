import type { SupabaseClient } from "@supabase/supabase-js";

import { PROFILE } from "@/constants/profile";
import {
  deleteNutritionLog,
  findNutritionLogsByDate,
  insertNutritionLog,
} from "@/features/nutrition/repositories/nutrition.repository";
import type { NutritionLogInput } from "@/features/nutrition/schemas/nutrition.schema";
import type {
  NutritionDay,
  NutritionLog,
  NutritionTargets,
  NutritionTotals,
} from "@/features/nutrition/types";

export const DEFAULT_NUTRITION_TARGETS: NutritionTargets = {
  calories: PROFILE.targetCalories,
  protein: PROFILE.targetProteinGrams,
  carbs: PROFILE.targetCarbohydratesGrams,
  fat: PROFILE.targetFatGrams,
  fiber: 30,
};

export function calculateNutritionTotals(
  logs: Pick<
    NutritionLog,
    "calories" | "protein" | "carbs" | "fat" | "fiber"
  >[],
): NutritionTotals {
  return logs.reduce<NutritionTotals>(
    (totals, log) => ({
      calories: totals.calories + Number(log.calories || 0),
      protein: totals.protein + Number(log.protein || 0),
      carbs: totals.carbs + Number(log.carbs || 0),
      fat: totals.fat + Number(log.fat || 0),
      fiber: totals.fiber + Number(log.fiber || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
}

export async function getNutritionDay(
  supabase: SupabaseClient,
  date: string,
): Promise<NutritionDay> {
  const logs = await findNutritionLogsByDate(supabase, date);

  return {
    date,
    logs,
    totals: calculateNutritionTotals(logs),
    targets: DEFAULT_NUTRITION_TARGETS,
  };
}

export async function createNutritionLog(
  supabase: SupabaseClient,
  userId: string,
  input: NutritionLogInput,
) {
  return insertNutritionLog(supabase, userId, input);
}

export async function removeNutritionLog(
  supabase: SupabaseClient,
  logId: string,
) {
  return deleteNutritionLog(supabase, logId);
}
