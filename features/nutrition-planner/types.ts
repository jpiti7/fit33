export type IngredientCategory =
  | "Proteínas"
  | "Carbohidratos"
  | "Fruta y verdura"
  | "Lácteos"
  | "Despensa"
  | "Otros";

export type Ingredient = {
  name: string;
  quantity: number;
  unit: "g" | "ml" | "unidad" | "rebanada";
  category: IngredientCategory;
};

export type PlannedMeal = {
  id: string;
  mealType: "Desayuno" | "Media mañana" | "Comida" | "Merienda" | "Cena";
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  preparation: string[];
  tags: string[];
};

export type MealPlanDay = {
  date: string;
  label: string;
  trainingDay: boolean;
  freeMeal: boolean;
  meals: PlannedMeal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export type MealPlan = {
  id: string;
  weekStart: string;
  targetCalories: number;
  generatedBy: "rules";
  days: MealPlanDay[];
  createdAt: string;
  updatedAt: string;
};

export type ShoppingListItem = Ingredient & {
  id: string;
  checked: boolean;
  manual: boolean;
};

export type ShoppingList = {
  id: string;
  weekStart: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
};

export type GenerateMealPlanInput = {
  weekStart: string;
  mealsPerDay: 4 | 5;
  includeFreeMeal: boolean;
};
