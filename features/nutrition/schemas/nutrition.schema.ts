import { z } from "zod";

import { MEAL_TYPES } from "@/features/nutrition/types";

const decimalField = (label: string) =>
  z.coerce
    .number({ error: `Introduce ${label}.` })
    .finite(`${label} debe ser un número válido.`)
    .min(0, `${label} no puede ser negativo.`);

export const nutritionLogSchema = z.object({
  consumedOn: z.iso.date(),
  mealType: z.enum(MEAL_TYPES),
  foodName: z
    .string()
    .trim()
    .min(2, "Escribe el nombre del alimento.")
    .max(120),
  grams: z.coerce
    .number()
    .positive("La cantidad debe ser mayor que cero.")
    .max(5000),
  calories: decimalField("las calorías").max(10000),
  protein: decimalField("la proteína").max(1000),
  carbs: decimalField("los hidratos").max(2000),
  fat: decimalField("las grasas").max(1000),
  fiber: decimalField("la fibra").max(500),
  notes: z.string().trim().max(300).optional(),
});

export type NutritionLogInput = z.infer<typeof nutritionLogSchema>;
