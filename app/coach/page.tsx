import Link from "next/link";

import { CoachOverview, getCoachReportAction } from "@/features/coach";

export default async function CoachPage() {
  const report = await getCoachReportAction();
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Fit33 v3
        </p>
        <h1 className="mt-2 text-3xl font-bold">Coach Fit33</h1>
        <p className="mt-2 mb-8 text-slate-400">
          Informe semanal y recomendaciones basadas en tu peso, adherencia y
          rendimiento.
        </p>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/coach/chat"
            className="rounded-2xl bg-emerald-400 px-5 py-4 text-center font-bold text-slate-950"
          >
            Hablar con el Coach
          </Link>
          <Link
            href="/planificacion"
            className="rounded-2xl border border-slate-700 px-5 py-4 text-center font-semibold"
          >
            Ver plan semanal
          </Link>
        </div>
        <CoachOverview report={report} />
      </div>
    </main>
  );
}
