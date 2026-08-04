import Link from "next/link";
import { ChefHat, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NutritionOverview } from "@/features/nutrition/components/NutritionOverview";
import { getNutritionDayAction } from "@/features/nutrition/actions/nutrition.actions";

function todayLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default async function NutritionPage() {
  const day = await getNutritionDayAction(todayLocal());

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33
          </p>
          <h1 className="mt-2 text-3xl font-bold">Nutrición</h1>
          <p className="mt-2 text-slate-400">
            Registra tus comidas y controla el progreso diario de calorías y
            macronutrientes.
          </p>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link href="/nutricion/planificador" className="block">
            <div className="h-full rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 transition hover:border-emerald-400/40">
              <ChefHat className="h-6 w-6 text-emerald-400" />
              <h2 className="mt-3 text-xl font-bold">Crear menú semanal</h2>
              <p className="mt-2 text-sm text-slate-400">
                Menús adaptados a tus objetivos, preferencias y alergias.
              </p>
              <Button className="mt-4 bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                Abrir planificador
              </Button>
            </div>
          </Link>
          <Link href="/nutricion/lista-compra" className="block">
            <div className="h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
              <ShoppingCart className="h-6 w-6 text-emerald-400" />
              <h2 className="mt-3 text-xl font-bold">Lista de la compra</h2>
              <p className="mt-2 text-sm text-slate-400">
                Productos agrupados y cantidades calculadas para toda la semana.
              </p>
              <Button variant="outline" className="mt-4">
                Ver lista
              </Button>
            </div>
          </Link>
        </section>

        <NutritionOverview initialDay={day} />
      </div>
    </main>
  );
}
