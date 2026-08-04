import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  NotificationPreferences,
  UserPreferences,
} from "@/features/settings/types";

export async function findPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select(
      "user_id, display_name, target_weight, target_calories, target_protein, target_carbs, target_fat, target_water_ml, weekly_workouts, preferred_training_time, allergies, disliked_foods",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error)
    throw new Error(`No se pudieron cargar tus objetivos: ${error.message}`);
  if (!data) return null;

  return {
    userId: data.user_id,
    displayName: data.display_name,
    targetWeight:
      data.target_weight === null ? null : Number(data.target_weight),
    targetCalories: Number(data.target_calories),
    targetProtein: Number(data.target_protein),
    targetCarbs: Number(data.target_carbs),
    targetFat: Number(data.target_fat),
    targetWaterMl: Number(data.target_water_ml),
    weeklyWorkouts: Number(data.weekly_workouts),
    preferredTrainingTime: data.preferred_training_time,
    allergies: data.allergies ?? [],
    dislikedFoods: data.disliked_foods ?? [],
  };
}

export async function upsertPreferences(
  supabase: SupabaseClient,
  preferences: UserPreferences,
) {
  const { error } = await supabase.from("user_preferences").upsert({
    user_id: preferences.userId,
    display_name: preferences.displayName,
    target_weight: preferences.targetWeight,
    target_calories: preferences.targetCalories,
    target_protein: preferences.targetProtein,
    target_carbs: preferences.targetCarbs,
    target_fat: preferences.targetFat,
    target_water_ml: preferences.targetWaterMl,
    weekly_workouts: preferences.weeklyWorkouts,
    preferred_training_time: preferences.preferredTrainingTime,
    allergies: preferences.allergies,
    disliked_foods: preferences.dislikedFoods,
    updated_at: new Date().toISOString(),
  });

  if (error)
    throw new Error(`No se pudieron guardar tus objetivos: ${error.message}`);
}

export async function getHydrationAmount(
  supabase: SupabaseClient,
  date: string,
) {
  const { data, error } = await supabase
    .from("hydration_logs")
    .select("amount_ml")
    .eq("consumed_on", date);

  if (error)
    throw new Error(`No se pudo cargar la hidratación: ${error.message}`);
  return (data ?? []).reduce((total, row) => total + Number(row.amount_ml), 0);
}

export async function insertHydration(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  amountMl: number,
) {
  const { error } = await supabase.from("hydration_logs").insert({
    user_id: userId,
    consumed_on: date,
    amount_ml: amountMl,
  });
  if (error) throw new Error(`No se pudo registrar el agua: ${error.message}`);
}

export async function findNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<NotificationPreferences | null> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select(
      "workout_reminders, weight_reminders, nutrition_reminders, coach_summary, reminder_time",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error)
    throw new Error(`No se pudieron cargar los avisos: ${error.message}`);
  if (!data) return null;

  return {
    workoutReminders: data.workout_reminders,
    weightReminders: data.weight_reminders,
    nutritionReminders: data.nutrition_reminders,
    coachSummary: data.coach_summary,
    reminderTime: String(data.reminder_time).slice(0, 5),
  };
}

export async function upsertNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
  preferences: NotificationPreferences,
) {
  const { error } = await supabase.from("notification_preferences").upsert({
    user_id: userId,
    workout_reminders: preferences.workoutReminders,
    weight_reminders: preferences.weightReminders,
    nutrition_reminders: preferences.nutritionReminders,
    coach_summary: preferences.coachSummary,
    reminder_time: preferences.reminderTime,
    updated_at: new Date().toISOString(),
  });

  if (error)
    throw new Error(`No se pudieron guardar los avisos: ${error.message}`);
}
