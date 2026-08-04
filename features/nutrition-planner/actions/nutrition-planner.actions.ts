"use server";

import { revalidatePath } from "next/cache";

import {
  findMealPlan,
  findShoppingList,
  upsertMealPlan,
  upsertShoppingList,
} from "@/features/nutrition-planner/repositories/nutrition-planner.repository";
import {
  buildShoppingItems,
  generateWeeklyMealPlan,
} from "@/features/nutrition-planner/services/meal-plan.service";
import type {
  GenerateMealPlanInput,
  ShoppingListItem,
} from "@/features/nutrition-planner/types";
import { getOrCreatePreferences } from "@/features/settings/services/settings.service";
import { createClient } from "@/lib/supabase/server";

async function authenticated() {
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

function validateWeekStart(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("La fecha de inicio de semana no es válida.");
  }
}

export async function getMealPlannerAction(weekStart: string) {
  validateWeekStart(weekStart);
  const { supabase, user } = await authenticated();
  const [plan, shoppingList, preferences] = await Promise.all([
    findMealPlan(supabase, user.id, weekStart),
    findShoppingList(supabase, user.id, weekStart),
    getOrCreatePreferences(supabase, user.id),
  ]);

  return { plan, shoppingList, preferences };
}

export async function generateMealPlanAction(input: GenerateMealPlanInput) {
  try {
    validateWeekStart(input.weekStart);
    if (![4, 5].includes(input.mealsPerDay)) {
      throw new Error("Selecciona cuatro o cinco comidas al día.");
    }

    const { supabase, user } = await authenticated();
    const preferences = await getOrCreatePreferences(supabase, user.id);
    const days = generateWeeklyMealPlan(input, preferences);
    const plan = await upsertMealPlan(
      supabase,
      user.id,
      input.weekStart,
      preferences.targetCalories,
      days,
    );
    const items = buildShoppingItems(days);
    const shoppingList = await upsertShoppingList(
      supabase,
      user.id,
      input.weekStart,
      items,
    );

    revalidatePath("/nutricion");
    revalidatePath("/nutricion/planificador");
    revalidatePath("/nutricion/lista-compra");

    return { success: true as const, plan, shoppingList };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo generar el menú semanal.",
    };
  }
}

export async function saveShoppingListAction(
  weekStart: string,
  items: ShoppingListItem[],
) {
  try {
    validateWeekStart(weekStart);
    if (items.length > 250) {
      throw new Error("La lista no puede superar 250 productos.");
    }

    const cleanItems = items.map((item) => ({
      ...item,
      name: item.name.trim().slice(0, 100),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));

    const { supabase, user } = await authenticated();
    const shoppingList = await upsertShoppingList(
      supabase,
      user.id,
      weekStart,
      cleanItems,
    );

    revalidatePath("/nutricion/lista-compra");
    return { success: true as const, shoppingList };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo guardar la lista de la compra.",
    };
  }
}
