import Link from "next/link";
import { Apple, Bot, CalendarDays, Flame, Target, Trophy } from "lucide-react";

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

      <HydrationCard
        date={data.hydration.date}
        initialAmount={data.hydration.amountMl}
        target={data.hydration.targetMl}
      />

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
