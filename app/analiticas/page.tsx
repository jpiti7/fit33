import Link from "next/link";

import { AnalyticsOverview } from "@/features/analytics";
import { getTrainingAnalyticsAction } from "@/features/analytics/actions/analytics.actions";

export default async function AnalyticsPage() {
  const analytics = await getTrainingAnalyticsAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/entrenos"
          className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Volver a entrenamientos
        </Link>

        <header className="mt-6 mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33 Intelligence
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Analítica de entrenamiento
          </h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Volumen, frecuencia, duración y referencias de rendimiento
            calculadas a partir de tus sesiones guardadas.
          </p>
        </header>

        <AnalyticsOverview analytics={analytics} />
      </div>
    </main>
  );
}
