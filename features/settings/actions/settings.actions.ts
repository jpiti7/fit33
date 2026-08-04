"use server";

import { revalidatePath } from "next/cache";

import {
  addHydration,
  getHydrationDay,
  getOrCreateNotificationPreferences,
  getOrCreatePreferences,
} from "@/features/settings/services/settings.service";
import { upsertNotificationPreferences } from "@/features/settings/repositories/settings.repository";
import type { NotificationPreferences } from "@/features/settings/types";
import { createClient } from "@/lib/supabase/server";

async function authenticated() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Tu sesión ha caducado.");
  return { supabase, user };
}

export async function getPreferencesAction() {
  const { supabase, user } = await authenticated();
  return getOrCreatePreferences(supabase, user.id);
}

export async function getHydrationDayAction(date: string) {
  const { supabase, user } = await authenticated();
  const preferences = await getOrCreatePreferences(supabase, user.id);
  return getHydrationDay(supabase, date, preferences.targetWaterMl);
}

export async function addHydrationAction(date: string, amountMl: number) {
  try {
    const { supabase, user } = await authenticated();
    await addHydration(supabase, user.id, date, amountMl);
    revalidatePath("/");
    revalidatePath("/nutricion");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo registrar el agua.",
    };
  }
}

export async function getNotificationPreferencesAction() {
  const { supabase, user } = await authenticated();
  return getOrCreateNotificationPreferences(supabase, user.id);
}

export async function saveNotificationPreferencesAction(
  preferences: NotificationPreferences,
) {
  try {
    const { supabase, user } = await authenticated();
    await upsertNotificationPreferences(supabase, user.id, preferences);
    revalidatePath("/perfil/notificaciones");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los avisos.",
    };
  }
}
