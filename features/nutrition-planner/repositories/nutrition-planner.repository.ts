import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  MealPlan,
  MealPlanDay,
  ShoppingList,
  ShoppingListItem,
} from "@/features/nutrition-planner/types";

export async function findMealPlan(
  supabase: SupabaseClient,
  userId: string,
  weekStart: string,
): Promise<MealPlan | null> {
  const { data, error } = await supabase
    .from("meal_plans")
    .select(
      "id, week_start, target_calories, generated_by, days, created_at, updated_at",
    )
    .eq("user_id", userId)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo cargar el menú semanal: ${error.message}`);
  }

  if (!data) return null;

  return {
    id: data.id,
    weekStart: data.week_start,
    targetCalories: Number(data.target_calories),
    generatedBy: "rules",
    days: data.days as MealPlanDay[],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function upsertMealPlan(
  supabase: SupabaseClient,
  userId: string,
  weekStart: string,
  targetCalories: number,
  days: MealPlanDay[],
): Promise<MealPlan> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("meal_plans")
    .upsert(
      {
        user_id: userId,
        week_start: weekStart,
        target_calories: targetCalories,
        generated_by: "rules",
        days,
        updated_at: now,
      },
      { onConflict: "user_id,week_start" },
    )
    .select(
      "id, week_start, target_calories, generated_by, days, created_at, updated_at",
    )
    .single();

  if (error) {
    throw new Error(`No se pudo guardar el menú semanal: ${error.message}`);
  }

  return {
    id: data.id,
    weekStart: data.week_start,
    targetCalories: Number(data.target_calories),
    generatedBy: "rules",
    days: data.days as MealPlanDay[],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function findShoppingList(
  supabase: SupabaseClient,
  userId: string,
  weekStart: string,
): Promise<ShoppingList | null> {
  const { data, error } = await supabase
    .from("shopping_lists")
    .select("id, week_start, items, created_at, updated_at")
    .eq("user_id", userId)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar la lista de la compra: ${error.message}`,
    );
  }
  if (!data) return null;

  return {
    id: data.id,
    weekStart: data.week_start,
    items: data.items as ShoppingListItem[],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function upsertShoppingList(
  supabase: SupabaseClient,
  userId: string,
  weekStart: string,
  items: ShoppingListItem[],
): Promise<ShoppingList> {
  const { data, error } = await supabase
    .from("shopping_lists")
    .upsert(
      {
        user_id: userId,
        week_start: weekStart,
        items,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,week_start" },
    )
    .select("id, week_start, items, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(
      `No se pudo guardar la lista de la compra: ${error.message}`,
    );
  }

  return {
    id: data.id,
    weekStart: data.week_start,
    items: data.items as ShoppingListItem[],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
