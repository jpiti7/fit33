"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  CalendarDays,
  ChefHat,
  Dumbbell,
  RefreshCw,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMealPlanAction } from "@/features/nutrition-planner/actions/nutrition-planner.actions";
import type { MealPlan } from "@/features/nutrition-planner/types";
import type { UserPreferences } from "@/features/settings/types";

type MealPlannerProps = {
  initialPlan: MealPlan | null;
  preferences: UserPreferences;
  weekStart: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(
    value,
  );
}

export function MealPlanner({
  initialPlan,
  preferences,
  weekStart,
}: MealPlannerProps) {
  const [plan, setPlan] = useState(initialPlan);
  const [mealsPerDay, setMealsPerDay] = useState<4 | 5>(5);
  const [includeFreeMeal, setIncludeFreeMeal] = useState(true);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function generatePlan() {
    setMessage("");
    startTransition(async () => {
      const result = await generateMealPlanAction({
        weekStart,
        mealsPerDay,
        includeFreeMeal,
      });

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setPlan(result.plan);
      setMessage("Menú y lista de la compra generados correctamente.");
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-slate-900 text-white">
        <CardContent className="grid gap-5 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="h-5 w-5" />
              <p className="font-semibold">Plan adaptado a tus objetivos</p>
            </div>
            <h2 className="mt-3 text-2xl font-bold">
              {formatNumber(preferences.targetCalories)} kcal ·{" "}
              {preferences.targetProtein} g de proteína
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              El generador evita tus alergias y alimentos descartados, mantiene
              opciones con pan y diferencia entre días de entrenamiento y
              descanso.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Alergias: {preferences.allergies.join(", ") || "ninguna"} ·
              Evitados: {preferences.dislikedFoods.join(", ") || "ninguno"}
            </p>
          </div>

          <Link href={`/nutricion/lista-compra?week=${weekStart}`}>
            <Button className="w-full bg-white text-slate-950 hover:bg-slate-200 lg:w-auto">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ver lista de la compra
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Generar menú semanal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3 md:items-end">
          <label className="text-sm text-slate-300">
            Comidas al día
            <select
              value={mealsPerDay}
              onChange={(event) =>
                setMealsPerDay(Number(event.target.value) as 4 | 5)
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-white"
            >
              <option value={4}>4 comidas</option>
              <option value={5}>5 comidas</option>
            </select>
          </label>

          <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={includeFreeMeal}
              onChange={(event) => setIncludeFreeMeal(event.target.checked)}
              className="h-5 w-5 accent-emerald-400"
            />
            Comida libre el sábado
          </label>

          <Button
            type="button"
            disabled={isPending}
            onClick={generatePlan}
            className="h-11 bg-emerald-400 text-slate-950 hover:bg-emerald-300"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            />
            {plan ? "Regenerar semana" : "Crear menú"}
          </Button>
        </CardContent>
      </Card>

      {message && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      )}

      {!plan ? (
        <Card className="border-dashed border-slate-700 bg-slate-900/50 text-white">
          <CardContent className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <ChefHat className="h-10 w-10 text-slate-500" />
            <h3 className="mt-4 text-xl font-bold">Todavía no hay menú</h3>
            <p className="mt-2 max-w-lg text-sm text-slate-400">
              Genera la semana para obtener recetas, cantidades, preparación y
              una lista de la compra agrupada automáticamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {plan.days.map((day) => (
            <Card
              key={day.date}
              className="overflow-hidden border-slate-800 bg-slate-900 text-white"
            >
              <CardHeader className="border-b border-slate-800 bg-slate-950/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-emerald-400" />
                      <CardTitle>{day.label}</CardTitle>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{day.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-300">
                      {formatNumber(day.totals.calories)} kcal
                    </p>
                    <p className="text-xs text-slate-400">
                      {day.totals.protein} g proteína
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {day.trainingDay && (
                    <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      <Dumbbell className="mr-1.5 h-3.5 w-3.5" /> Entrenamiento
                    </span>
                  )}
                  {day.freeMeal && (
                    <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                      Comida libre
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                {day.meals.map((meal) => (
                  <details
                    key={meal.id}
                    className="group rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                            {meal.mealType}
                          </p>
                          <p className="mt-1 font-bold">{meal.name}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            {meal.description}
                          </p>
                        </div>
                        <div className="shrink-0 text-right text-sm">
                          <p className="font-semibold">{meal.calories} kcal</p>
                          <p className="text-slate-500">P {meal.protein} g</p>
                        </div>
                      </div>
                    </summary>
                    <div className="mt-4 grid gap-4 border-t border-slate-800 pt-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-200">
                          Ingredientes
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-400">
                          {meal.ingredients.length === 0 ? (
                            <li>Elección flexible.</li>
                          ) : (
                            meal.ingredients.map((ingredient) => (
                              <li key={`${ingredient.name}-${ingredient.unit}`}>
                                {ingredient.name}: {ingredient.quantity}{" "}
                                {ingredient.unit}
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">
                          Preparación
                        </p>
                        <ol className="mt-2 space-y-1 text-sm text-slate-400">
                          {meal.preparation.map((step, index) => (
                            <li key={step}>
                              {index + 1}. {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </details>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
