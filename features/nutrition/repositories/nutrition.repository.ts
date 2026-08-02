import type { SupabaseClient } from "@supabase/supabase-js";

import type { NutritionLogInput } from "@/features/nutrition/schemas/nutrition.schema";
import type { NutritionLog } from "@/features/nutrition/types";

export async function findNutritionLogsByDate(
  supabase: SupabaseClient,
  date: string,
): Promise<NutritionLog[]> {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .select(
      "id, user_id, food_id, consumed_on, meal_type, food_name, grams, calories, protein, carbs, fat, fiber, notes, created_at",
    )
    .eq("consumed_on", date)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`No se pudo cargar la nutrición: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    ...row,
    grams: Number(row.grams),
    calories: Number(row.calories),
    protein: Number(row.protein),
    carbs: Number(row.carbs),
    fat: Number(row.fat),
    fiber: Number(row.fiber),
  })) as NutritionLog[];
}

export async function insertNutritionLog(
  supabase: SupabaseClient,
  userId: string,
  input: NutritionLogInput,
): Promise<string> {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .insert({
      user_id: userId,
      consumed_on: input.consumedOn,
      meal_type: input.mealType,
      food_name: input.foodName,
      grams: input.grams,
      calories: input.calories,
      protein: input.protein,
      carbs: input.carbs,
      fat: input.fat,
      fiber: input.fiber,
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`No se pudo guardar la comida: ${error.message}`);
  }

  return data.id as string;
}

export async function deleteNutritionLog(
  supabase: SupabaseClient,
  logId: string,
): Promise<void> {
  const { error } = await supabase
    .from("nutrition_logs")
    .delete()
    .eq("id", logId);

  if (error) {
    throw new Error(`No se pudo eliminar el registro: ${error.message}`);
  }
}
