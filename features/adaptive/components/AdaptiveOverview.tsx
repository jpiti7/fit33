import Link from "next/link";
import {
  ArrowUp,
  Minus,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";

import type {
  AdaptiveExercise,
  AdaptiveSummary,
} from "@/features/adaptive/types";

const actionMeta: Record<
  AdaptiveExercise["action"],
  { label: string; icon: typeof ArrowUp; className: string }
> = {
  increase: { label: "Subir", icon: ArrowUp, className: "text-emerald-300" },
  maintain: { label: "Mantener", icon: Minus, className: "text-sky-300" },
  decrease: { label: "Bajar", icon: TrendingDown, className: "text-amber-300" },
  start: { label: "Establecer", icon: Zap, className: "text-violet-300" },
};

export function AdaptiveOverview({ data }: { data: AdaptiveSummary }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/15 via-slate-900 to-slate-900 p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
              FIT33 ADAPTIVE ENGINE
            </p>
            <h1 className="mt-2 text-3xl font-black">{data.headline}</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              La rutina se adapta a tu recuperación, adherencia y última sesión
              registrada.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric label="Recuperación" value={`${data.recoveryScore}/100`} />
          <Metric label="Adherencia" value={`${data.adherencePercent}%`} />
          <Metric label="Proteína hoy" value={`${data.nutritionPercent}%`} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Sesión recomendada</p>
            <h2 className="mt-1 text-2xl font-bold">{data.workout.type}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Variante {data.workout.variant} ·{" "}
              {data.workout.intensity === "reduced"
                ? "Volumen reducido"
                : "Intensidad normal"}
            </p>
          </div>
          <Link
            href={`/entrenos/${data.workout.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-400 px-5 font-bold text-slate-950"
          >
            Empezar sesión
          </Link>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-100">
          {data.readiness === "red" ? (
            <ShieldAlert className="h-5 w-5 shrink-0" />
          ) : (
            <Sparkles className="h-5 w-5 shrink-0" />
          )}
          {data.workout.summary}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        {data.workout.exercises.map((exercise) => {
          const meta = actionMeta[exercise.action];
          const Icon = meta.icon;
          return (
            <article
              key={exercise.name}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {exercise.muscleGroup}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{exercise.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {exercise.targetSets} series · {exercise.targetReps} reps
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-bold ${meta.className}`}
                >
                  <Icon className="h-4 w-4" /> {meta.label}
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Carga propuesta</p>
                <p className="mt-1 text-2xl font-black">
                  {exercise.suggestedWeight === null
                    ? "Ajustar en calentamiento"
                    : `${exercise.suggestedWeight.toLocaleString("es-ES")} kg`}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {exercise.reason}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/recuperacion"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-semibold hover:border-emerald-400/30"
        >
          Actualizar recuperación →
        </Link>
        <Link
          href="/nutricion"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-semibold hover:border-emerald-400/30"
        >
          Revisar nutrición →
        </Link>
        <Link
          href="/coach/chat"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-semibold hover:border-emerald-400/30"
        >
          Preguntar al Coach →
        </Link>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-950/60 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
