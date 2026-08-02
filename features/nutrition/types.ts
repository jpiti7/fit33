export const MEAL_TYPES = [
  "Desayuno",
  "Media mañana",
  "Comida",
  "Merienda",
  "Cena",
  "Otro",
] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export type NutritionLog = {
  id: string;
  user_id: string;
  food_id: string | null;
  consumed_on: string;
  meal_type: MealType;
  food_name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes: string | null;
  created_at: string;
};

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type NutritionTargets = NutritionTotals;

export type NutritionDay = {
  date: string;
  logs: NutritionLog[];
  totals: NutritionTotals;
  targets: NutritionTargets;
};
