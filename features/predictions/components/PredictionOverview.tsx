import { CalendarClock, Dumbbell, TrendingDown } from "lucide-react";

import type { PredictionSummary } from "@/features/predictions/types";

export function PredictionOverview({ data }: { data: PredictionSummary }) {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-emerald-300">PREDICCIONES</p>
        <h1 className="mt-2 text-3xl font-black">Tu tendencia, explicada</h1>
        <p className="mt-2 text-slate-400">
          Estimaciones orientativas basadas en tus registros reales. No
          sustituyen una valoración profesional.
        </p>
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-slate-900 p-5">
        <div className="flex items-start gap-4">
          <TrendingDown className="h-7 w-7 text-emerald-300" />
          <div className="flex-1">
            <p className="text-sm text-slate-400">Objetivo de peso</p>
            <p className="mt-1 text-2xl font-bold">
              {data.weight.currentWeight ?? "—"} kg →{" "}
              {data.weight.targetWeight ?? "—"} kg
            </p>
            <p className="mt-2 text-sm text-slate-300">{data.weight.message}</p>
            {data.weight.estimatedDate ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-200">
                <CalendarClock className="h-4 w-4" /> Fecha estimada:{" "}
                {data.weight.estimatedDate}
              </p>
            ) : null}
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
              Confianza {data.weight.confidence}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Proyección de fuerza a 4 semanas</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {data.strength.length ? (
            data.strength.map((item) => (
              <article
                key={item.exercise}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
              >
                <Dumbbell className="h-6 w-6 text-violet-300" />
                <h3 className="mt-3 font-bold">{item.exercise}</h3>
                <p className="mt-2 text-2xl font-black">
                  {item.currentBestWeight} → {item.predictedWeight} kg
                </p>
                <p className="mt-2 text-sm text-slate-400">{item.message}</p>
              </article>
            ))
          ) : (
            <p className="text-slate-400">
              Necesitamos más sesiones con cargas registradas.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
