import { CoachOverview, getCoachReportAction } from "@/features/coach";

export default async function CoachPage() {
  const report = await getCoachReportAction();
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Fit33
        </p>
        <h1 className="mt-2 text-3xl font-bold">Coach Fit33</h1>
        <p className="mt-2 mb-8 text-slate-400">
          Recomendaciones automáticas basadas en tu peso, adherencia y
          rendimiento.
        </p>
        <CoachOverview report={report} />
      </div>
    </main>
  );
}
