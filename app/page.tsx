import Link from "next/link";

import { DashboardData } from "@/components/dashboard/dashboard-data";
import { CoachOverview, getCoachReportAction } from "@/features/coach";
import {
  DashboardTrainingOverview,
  getDashboardTrainingDataAction,
} from "@/features/dashboard";

export default async function Home() {
  let trainingData = null;
  let coachReport = null;

  try {
    trainingData = await getDashboardTrainingDataAction();
  } catch (error) {
    console.error("No se pudo cargar el Dashboard PRO:", error);
  }

  try {
    coachReport = await getCoachReportAction();
  } catch (error) {
    console.error("No se pudo cargar Coach Fit33:", error);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Fit33
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Buenos días, Jesús
            </h1>

            <p className="mt-2 text-slate-400">
              Continúa avanzando hacia tu mejor versión.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/entrenos"
              className="rounded-xl border border-slate-700 px-5 py-3 text-center font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-400"
            >
              Entrenar ahora
            </Link>
            <Link
              href="/registrar-peso"
              className="rounded-xl bg-emerald-400 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Registrar peso
            </Link>
          </div>
        </header>

        {trainingData ? (
          <DashboardTrainingOverview data={trainingData} />
        ) : (
          <section className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-200">
            No se pudieron cargar las métricas de entrenamiento. El seguimiento
            corporal sigue disponible.
          </section>
        )}

        {coachReport && (
          <div className="mb-8">
            <CoachOverview report={coachReport} compact />
          </div>
        )}

        <DashboardData />
      </div>
    </main>
  );
}
