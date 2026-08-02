"use server";

import { revalidatePath } from "next/cache";

import {
  nutritionLogSchema,
  type NutritionLogInput,
} from "@/features/nutrition/schemas/nutrition.schema";
import {
  createNutritionLog,
  getNutritionDay,
  removeNutritionLog,
} from "@/features/nutrition/services/nutrition.service";
import type { NutritionDay } from "@/features/nutrition/types";
import { createClient } from "@/lib/supabase/server";

export type NutritionActionResult =
  { success: true; id?: string } | { success: false; message: string };

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");
  }

  return { supabase, user };
}

export async function getNutritionDayAction(
  date: string,
): Promise<NutritionDay> {
  const { supabase } = await getAuthenticatedClient();
  return getNutritionDay(supabase, date);
}

export async function createNutritionLogAction(
  values: NutritionLogInput,
): Promise<NutritionActionResult> {
  try {
    const input = nutritionLogSchema.parse(values);
    const { supabase, user } = await getAuthenticatedClient();
    const id = await createNutritionLog(supabase, user.id, input);

    revalidatePath("/");
    revalidatePath("/nutricion");
    revalidatePath("/coach");

    return { success: true, id };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo guardar la comida.",
    };
  }
}

export async function deleteNutritionLogAction(
  logId: string,
): Promise<NutritionActionResult> {
  try {
    const { supabase } = await getAuthenticatedClient();
    await removeNutritionLog(supabase, logId);

    revalidatePath("/");
    revalidatePath("/nutricion");
    revalidatePath("/coach");

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la comida.",
    };
  }
}
