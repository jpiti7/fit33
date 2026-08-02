import Link from "next/link";
import {
  BrainCircuit,
  CalendarCheck2,
  ChevronRight,
  Gauge,
  Target,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CoachRecommendation, CoachReport } from "@/features/coach/types";

const toneClasses: Record<CoachRecommendation["tone"], string> = {
  positive: "border-emerald-400/20 bg-emerald-400/5",
  warning: "border-amber-400/20 bg-amber-400/5",
  neutral: "border-slate-800 bg-slate-950",
};

export function CoachOverview({
  report,
  compact = false,
}: {
  report: CoachReport;
  compact?: boolean;
}) {
  const recommendations = compact
    ? report.recommendations.slice(0, 3)
    : report.recommendations;
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="pt-6">
            <Gauge className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-sm text-slate-400">Puntuación semanal</p>
            <p className="mt-1 text-3xl font-bold">{report.score}/100</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="pt-6">
            <CalendarCheck2 className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-sm text-slate-400">Adherencia</p>
            <p className="mt-1 text-3xl font-bold">
              {report.completedWorkouts}/{report.weeklyTarget}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {report.adherencePercent} % completado
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="pt-6">
            <Target className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-sm text-slate-400">Próxima sesión</p>
            <p className="mt-1 text-xl font-bold">{report.nextWorkout.type}</p>
            <Link
              href={`/entrenos/${report.nextWorkout.slug}`}
              className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-400"
            >
              Comenzar <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-emerald-400" />
            Coach Fit33
          </CardTitle>
          <p className="text-sm text-slate-400">{report.headline}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((item) => (
            <article
              key={item.id}
              className={`rounded-xl border p-4 ${toneClasses[item.tone]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.message}
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase text-slate-400">
                  {item.priority}
                </span>
              </div>
            </article>
          ))}
          {recommendations.length === 0 && (
            <p className="text-sm text-slate-400">
              Todavía no hay suficientes datos para generar recomendaciones.
            </p>
          )}
          {compact && (
            <Link
              href="/coach"
              className="inline-flex items-center text-sm font-semibold text-emerald-400"
            >
              Ver informe completo <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
