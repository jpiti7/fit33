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

        <NutritionOverview initialDay={day} />
      </div>
    </main>
  );
}
