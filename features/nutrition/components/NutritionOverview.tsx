"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createNutritionLogAction,
  deleteNutritionLogAction,
} from "@/features/nutrition/actions/nutrition.actions";
import type { NutritionLogInput } from "@/features/nutrition/schemas/nutrition.schema";
import {
  MEAL_TYPES,
  type MealType,
  type NutritionDay,
  type NutritionLog,
} from "@/features/nutrition/types";

const macroCards = [
  { key: "calories", label: "Calorías", unit: "kcal", decimals: 0 },
  { key: "protein", label: "Proteínas", unit: "g", decimals: 1 },
  { key: "carbs", label: "Hidratos", unit: "g", decimals: 1 },
  { key: "fat", label: "Grasas", unit: "g", decimals: 1 },
  { key: "fiber", label: "Fibra", unit: "g", decimals: 1 },
] as const;

function formatValue(value: number, decimals = 1) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function todayLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function emptyForm(date: string): NutritionLogInput {
  return {
    consumedOn: date,
    mealType: "Desayuno",
    foodName: "",
    grams: 100,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    notes: "",
  };
}

type NutritionOverviewProps = {
  initialDay: NutritionDay;
};

export function NutritionOverview({ initialDay }: NutritionOverviewProps) {
  const [day, setDay] = useState(initialDay);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NutritionLogInput>(
    emptyForm(initialDay.date),
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const groupedLogs = useMemo(
    () =>
      MEAL_TYPES.map((mealType) => ({
        mealType,
        logs: day.logs.filter((log) => log.meal_type === mealType),
      })).filter((group) => group.logs.length > 0),
    [day.logs],
  );

  function updateNumber(
    key: "grams" | "calories" | "protein" | "carbs" | "fat" | "fiber",
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [key]: Number(value.replace(",", ".")) || 0,
    }));
  }

  function addLocalLog(id: string): NutritionLog {
    return {
      id,
      user_id: "current-user",
      food_id: null,
      consumed_on: form.consumedOn,
      meal_type: form.mealType,
      food_name: form.foodName,
      grams: form.grams,
      calories: form.calories,
      protein: form.protein,
      carbs: form.carbs,
      fat: form.fat,
      fiber: form.fiber,
      notes: form.notes || null,
      created_at: new Date().toISOString(),
    };
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const result = await createNutritionLogAction(form);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      const log = addLocalLog(result.id ?? crypto.randomUUID());
      setDay((current) => ({
        ...current,
        logs: [...current.logs, log],
        totals: {
          calories: current.totals.calories + log.calories,
          protein: current.totals.protein + log.protein,
          carbs: current.totals.carbs + log.carbs,
          fat: current.totals.fat + log.fat,
          fiber: current.totals.fiber + log.fiber,
        },
      }));
      setForm(emptyForm(day.date));
      setShowForm(false);
      setMessage("Comida registrada correctamente.");
    });
  }

  function removeLog(log: NutritionLog) {
    setMessage("");

    startTransition(async () => {
      const result = await deleteNutritionLogAction(log.id);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setDay((current) => ({
        ...current,
        logs: current.logs.filter((item) => item.id !== log.id),
        totals: {
          calories: Math.max(0, current.totals.calories - log.calories),
          protein: Math.max(0, current.totals.protein - log.protein),
          carbs: Math.max(0, current.totals.carbs - log.carbs),
          fat: Math.max(0, current.totals.fat - log.fat),
          fiber: Math.max(0, current.totals.fiber - log.fiber),
        },
      }));
    });
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {macroCards.map((macro) => {
          const current = day.totals[macro.key];
          const target = day.targets[macro.key];
          const percentage = Math.min(
            100,
            target > 0 ? (current / target) * 100 : 0,
          );

          return (
            <Card
              key={macro.key}
              className="border-slate-800 bg-slate-900 text-white"
            >
              <CardContent className="pt-6">
                <p className="text-sm text-slate-400">{macro.label}</p>
                <p className="mt-2 text-2xl font-bold">
                  {formatValue(current, macro.decimals)}
                  <span className="ml-1 text-sm font-normal text-slate-500">
                    / {formatValue(target, macro.decimals)} {macro.unit}
                  </span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Comidas de hoy</h2>
          <p className="mt-1 text-sm text-slate-400">
            {day.logs.length} {day.logs.length === 1 ? "registro" : "registros"}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowForm((visible) => !visible)}
          className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
        >
          {showForm ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {showForm ? "Cerrar" : "Registrar comida"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Nuevo registro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitForm} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm text-slate-300">
                  Fecha
                  <Input
                    type="date"
                    value={form.consumedOn}
                    max={todayLocal()}
                    readOnly
                    className="mt-2 border-slate-700 bg-slate-950"
                    required
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Comida
                  <select
                    value={form.mealType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        mealType: event.target.value as MealType,
                      }))
                    }
                    className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                  >
                    {MEAL_TYPES.map((mealType) => (
                      <option key={mealType}>{mealType}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm text-slate-300">
                  Cantidad (g)
                  <Input
                    type="number"
                    min="1"
                    step="0.1"
                    value={form.grams}
                    onChange={(event) =>
                      updateNumber("grams", event.target.value)
                    }
                    className="mt-2 border-slate-700 bg-slate-950"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-300">
                Alimento o plato
                <Input
                  value={form.foodName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      foodName: event.target.value,
                    }))
                  }
                  placeholder="Ejemplo: tostadas con pavo"
                  className="mt-2 border-slate-700 bg-slate-950"
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-5">
                {(
                  [
                    ["calories", "Calorías"],
                    ["protein", "Proteína"],
                    ["carbs", "Hidratos"],
                    ["fat", "Grasas"],
                    ["fiber", "Fibra"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="text-sm text-slate-300">
                    {label}
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form[key]}
                      onChange={(event) =>
                        updateNumber(key, event.target.value)
                      }
                      className="mt-2 border-slate-700 bg-slate-950"
                      required
                    />
                  </label>
                ))}
              </div>

              <label className="block text-sm text-slate-300">
                Observaciones
                <textarea
                  rows={3}
                  value={form.notes ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                  placeholder="Hambre, energía, preparación..."
                />
              </label>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
              >
                {isPending ? "Guardando..." : "Guardar comida"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {message && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200">
          {message}
        </div>
      )}

      {groupedLogs.length === 0 ? (
        <Card className="border-dashed border-slate-700 bg-slate-900 text-white">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold">
              Todavía no has registrado comidas hoy
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Añade tu primera comida para empezar a controlar calorías y
              macros.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {groupedLogs.map((group) => (
            <Card
              key={group.mealType}
              className="border-slate-800 bg-slate-900 text-white"
            >
              <CardHeader>
                <CardTitle>{group.mealType}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.logs.map((log) => (
                  <article
                    key={log.id}
                    className="flex flex-col gap-3 rounded-xl bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {log.food_name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatValue(log.grams)} g ·{" "}
                        {formatValue(log.calories, 0)} kcal
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        P {formatValue(log.protein)} · H{" "}
                        {formatValue(log.carbs)} · G {formatValue(log.fat)} ·
                        Fibra {formatValue(log.fiber)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      onClick={() => removeLog(log)}
                      aria-label={`Eliminar ${log.food_name}`}
                      className="text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </article>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
