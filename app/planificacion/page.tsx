import { getWeeklyPlanAction, WeeklyPlanner } from "@/features/planner";

export default async function PlanningPage() {
  const plan = await getWeeklyPlanAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Plan inteligente
        </p>
        <h1 className="mt-2 text-3xl font-bold">Tu semana</h1>
        <p className="mt-2 mb-8 text-slate-400">
          Una propuesta basada en tu adherencia, rotación y recuperación.
        </p>
        <WeeklyPlanner plan={plan} />
      </div>
    </main>
  );
}
