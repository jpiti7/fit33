import { describe, expect, it } from "vitest";

import {
  buildShoppingItems,
  generateWeeklyMealPlan,
} from "@/features/nutrition-planner/services/meal-plan.service";
import type { UserPreferences } from "@/features/settings/types";

const preferences: UserPreferences = {
  userId: "test",
  displayName: "Test",
  targetWeight: 75,
  targetCalories: 2300,
  targetProtein: 180,
  targetCarbs: 220,
  targetFat: 70,
  targetWaterMl: 3000,
  weeklyWorkouts: 4,
  preferredTrainingTime: "20:30",
  allergies: ["garbanzos", "lentejas", "cacahuetes", "sandía", "melón"],
  dislikedFoods: ["pescado"],
};

describe("Planificador nutricional", () => {
  it("genera siete días sin ingredientes excluidos", () => {
    const days = generateWeeklyMealPlan(
      { weekStart: "2026-08-03", mealsPerDay: 5, includeFreeMeal: true },
      preferences,
    );

    expect(days).toHaveLength(7);
    const names = days
      .flatMap((day) => day.meals)
      .flatMap((meal) => meal.ingredients)
      .map((ingredient) => ingredient.name.toLowerCase())
      .join(" ");

    expect(names).not.toContain("garbanzo");
    expect(names).not.toContain("lenteja");
    expect(names).not.toContain("cacahuete");
    expect(names).not.toContain("pescado");
  });

  it("agrupa ingredientes repetidos en la lista de la compra", () => {
    const days = generateWeeklyMealPlan(
      { weekStart: "2026-08-03", mealsPerDay: 4, includeFreeMeal: false },
      preferences,
    );
    const items = buildShoppingItems(days);
    const names = items.map((item) => `${item.name}:${item.unit}`);

    expect(new Set(names).size).toBe(names.length);
    expect(items.length).toBeGreaterThan(10);
  });
});
