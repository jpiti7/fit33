import { describe, expect, it } from "vitest";

import { calculateNutritionTotals } from "@/features/nutrition/services/nutrition.service";

describe("Nutrition Service", () => {
  it("suma calorías y macronutrientes del día", () => {
    const totals = calculateNutritionTotals([
      { calories: 400, protein: 25, carbs: 50, fat: 10, fiber: 6 },
      { calories: 650, protein: 45, carbs: 70, fat: 20, fiber: 8 },
    ]);

    expect(totals).toEqual({
      calories: 1050,
      protein: 70,
      carbs: 120,
      fat: 30,
      fiber: 14,
    });
  });

  it("devuelve cero cuando no hay registros", () => {
    expect(calculateNutritionTotals([])).toEqual({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    });
  });
});
