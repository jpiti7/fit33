import type { SupabaseClient } from "@supabase/supabase-js";

import { PROFILE } from "@/constants/profile";
import {
  findNotificationPreferences,
  findPreferences,
  getHydrationAmount,
  insertHydration,
  upsertNotificationPreferences,
  upsertPreferences,
} from "@/features/settings/repositories/settings.repository";
import type {
  HydrationDay,
  NotificationPreferences,
  UserPreferences,
} from "@/features/settings/types";

export function defaultPreferences(userId: string): UserPreferences {
  return {
    userId,
    displayName: PROFILE.name,
    targetWeight: PROFILE.targetWeightKg,
    targetCalories: PROFILE.targetCalories,
    targetProtein: PROFILE.targetProteinGrams,
    targetCarbs: PROFILE.targetCarbohydratesGrams,
    targetFat: PROFILE.targetFatGrams,
    targetWaterMl: PROFILE.targetWaterLiters * 1000,
    weeklyWorkouts: PROFILE.weeklyWorkouts,
    preferredTrainingTime: "20:30",
    allergies: ["garbanzos", "lentejas", "cacahuetes", "sandía", "melón"],
    dislikedFoods: ["pescado"],
  };
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  workoutReminders: true,
  weightReminders: true,
  nutritionReminders: false,
  coachSummary: true,
  reminderTime: "20:00",
};

export async function getOrCreatePreferences(
  supabase: SupabaseClient,
  userId: string,
) {
  const current = await findPreferences(supabase, userId);
  if (current) return current;

  const defaults = defaultPreferences(userId);
  await upsertPreferences(supabase, defaults);
  return defaults;
}

export async function getHydrationDay(
  supabase: SupabaseClient,
  date: string,
  targetMl: number,
): Promise<HydrationDay> {
  const amountMl = await getHydrationAmount(supabase, date);
  return {
    date,
    amountMl,
    targetMl,
    percentage: Math.min(100, Math.round((amountMl / targetMl) * 100)),
  };
}

export async function addHydration(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  amountMl: number,
) {
  if (!Number.isInteger(amountMl) || amountMl < 50 || amountMl > 2000) {
    throw new Error("La cantidad de agua debe estar entre 50 y 2000 ml.");
  }
  await insertHydration(supabase, userId, date, amountMl);
}

export async function getOrCreateNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
) {
  const current = await findNotificationPreferences(supabase, userId);
  if (current) return current;
  await upsertNotificationPreferences(
    supabase,
    userId,
    DEFAULT_NOTIFICATION_PREFERENCES,
  );
  return DEFAULT_NOTIFICATION_PREFERENCES;
}
