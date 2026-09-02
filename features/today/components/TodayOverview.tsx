import Link from "next/link";
import {
  Apple,
  Bot,
  CalendarDays,
  TrendingUp,
  Flame,
  HeartPulse,
  Target,
  Trophy,
  Scale,
  Sparkles,
} from "lucide-react";

import { HydrationCard } from "@/features/today/components/HydrationCard";
import type { TodayData } from "@/features/today/types";

export function TodayOverview({ data }: { data: TodayData }) {
  const today = new Date().toISOString().slice(0, 10);
  const nextSession =
    data.plan.sessions.find((session) => session.date >= today) ??
    data.plan.sessions[0];
  const caloriesLeft = Math.max(
    0,
    data.nutrition.targets.calories - data.nutrition.totals.calories,
  );
  const proteinLeft = Math.max(
    0,
    data.nutrition.targets.protein - data.nutrition.totals.protein,
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/20 via-slate-900 to-slate-900 p-6">
        <p className="text-sm font-semibold text-emerald-300">HOY EN FIT33</p>
        <h1 className="mt-2 text-3xl font-black">
          Hola, {data.preferences.displayName}
        </h1>
        <p className="mt-2 max-w-xl text-slate-300">{data.coach.headline}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-950/50 p-4">
            <Flame className="h-5 w-5 text-orange-300" />
            <p className="mt-3 text-2xl font-bold">{data.coach.score}/100</p>
            <p className="text-xs text-slate-400">Estado semanal</p>
          </div>
          <div className="rounded-2xl bg-slate-950/50 p-4">
            <Trophy className="h-5 w-5 text-amber-300" />
            <p className="mt-3 text-2xl font-bold">
              Nivel {data.achievements.level}
            </p>
            <p className="text-xs text-slate-400">
              {data.achievements.points} XP
            </p>
          </div>
          <div className="rounded-2xl bg-slate-950/50 p-4">
            <Target className="h-5 w-5 text-emerald-300" />
            <p className="mt-3 text-2xl font-bold">
              {data.coach.adherencePercent}%
            </p>
            <p className="text-xs text-slate-400">Adherencia</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Control de peso</p>
            <h2 className="mt-1 text-2xl font-bold">Registrar peso</h2>
            <p className="mt-2 text-sm text-slate-400">
              Añade tu peso, cintura y grasa corporal para mantener actualizado
              tu progreso.
            </p>
          </div>
          <Scale className="h-7 w-7 shrink-0 text-emerald-300" />
        </div>
        <Link
          href="/registrar-peso"
          className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 font-bold text-slate-950"
        >
          + Registrar peso
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Próxima sesión</p>
              <h2 className="mt-1 text-2xl font-bold">{nextSession?.type}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {nextSession?.focus}
              </p>
            </div>
            <CalendarDays className="h-7 w-7 text-emerald-300" />
          </div>
          <Link
            href={`/entrenos/${nextSession?.slug ?? data.coach.nextWorkout.slug}`}
            className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 font-bold text-slate-950"
          >
            Empezar entrenamiento
          </Link>
        </article>

        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Nutrición restante</p>
              <p className="mt-2 text-2xl font-bold">
                {Math.round(caloriesLeft)} kcal
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {Math.round(proteinLeft)} g de proteína
              </p>
            </div>
            <Apple className="h-7 w-7 text-lime-300" />
          </div>
          <Link
            href="/nutricion"
            className="mt-5 flex min-h-12 items-center justify-center rounded-2xl border border-slate-700 font-semibold"
          >
            Registrar comida
          </Link>
        </article>
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Recuperación diaria</p>
            <p className="mt-2 text-2xl font-bold">
              {data.recovery ? `${data.recovery.score}/100` : "Sin check-in"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {data.plan.adaptation}
            </p>
          </div>
          <HeartPulse className="h-7 w-7 text-emerald-300" />
        </div>
        <Link
          href="/recuperacion"
          className="mt-5 flex min-h-12 items-center justify-center rounded-2xl border border-emerald-400/30 font-semibold text-emerald-200"
        >
          {data.recovery ? "Actualizar check-in" : "Registrar recuperación"}
        </Link>
      </section>

      <HydrationCard
        date={data.hydration.date}
        initialAmount={data.hydration.amountMl}
        target={data.hydration.targetMl}
      />

      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
            <Sparkles className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-emerald-200/70">Fit33 Adaptive Engine</p>
            <h2 className="mt-1 text-xl font-bold">
              Tu entrenamiento se adapta a ti
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Ajustamos la sesión según recuperación, adherencia y rendimiento
              reciente.
            </p>
            <Link
              href="/adaptativo"
              className="mt-4 inline-flex min-h-11 items-center rounded-2xl bg-emerald-400 px-4 font-bold text-slate-950"
            >
              Ver sesión adaptada →
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-100/70">Predicción de objetivo</p>
              <p className="mt-2 text-2xl font-bold">
                {data.predictions.weight.estimatedWeeks !== null
                  ? `${data.predictions.weight.estimatedWeeks} semanas`
                  : "Tendencia en formación"}
              </p>
              <p className="mt-2 text-sm text-cyan-100/70">
                {data.predictions.weight.message}
              </p>
            </div>
            <TrendingUp className="h-7 w-7 text-cyan-300" />
          </div>
          <Link
            href="/predicciones"
            className="mt-4 inline-block font-semibold text-cyan-200"
          >
            Ver predicciones →
          </Link>
        </article>

        <article className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-amber-100/70">Retos semanales</p>
              <p className="mt-2 text-2xl font-bold">
                {data.challenges.completed}/{data.challenges.total}
              </p>
              <p className="mt-2 text-sm text-amber-100/70">
                Completa los retos de entrenamiento, nutrición, agua y
                recuperación.
              </p>
            </div>
            <Trophy className="h-7 w-7 text-amber-300" />
          </div>
          <Link
            href="/retos"
            className="mt-4 inline-block font-semibold text-amber-200"
          >
            Abrir retos →
          </Link>
        </article>
      </section>

      <section className="rounded-3xl border border-violet-400/20 bg-violet-400/5 p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-300 text-slate-950">
            <Sparkles className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-violet-200/70">Coach autónomo</p>
            <h2 className="mt-1 text-xl font-bold">
              Fit33 puede proponerte acciones
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Detecta desviaciones en entrenamiento, recuperación y nutrición y
              te lleva al flujo adecuado para confirmar el cambio.
            </p>
            <Link
              href="/coach/autonomo"
              className="mt-4 inline-flex min-h-11 items-center rounded-2xl bg-violet-300 px-4 font-bold text-slate-950"
            >
              Revisar propuestas →
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-300 text-slate-950">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold">Coach Fit33</p>
            <p className="mt-2 text-sm leading-6 text-violet-100/80">
              {data.coach.recommendations[0]?.message ?? data.coach.headline}
            </p>
            <Link
              href="/coach/chat"
              className="mt-4 inline-block font-semibold text-violet-200"
            >
              Abrir conversación →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
