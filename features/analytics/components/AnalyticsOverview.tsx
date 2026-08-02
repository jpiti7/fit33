import {
  Activity,
  BarChart3,
  CalendarDays,
  Clock3,
  Dumbbell,
  Layers3,
  Trophy,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrainingAnalytics } from "@/features/analytics/types";

function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function Trend({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="text-xs text-slate-500">Sin referencia previa</span>
    );
  }

  const prefix = value > 0 ? "+" : "";
  const className =
    value > 0
      ? "text-emerald-400"
      : value < 0
        ? "text-amber-400"
        : "text-slate-400";

  return (
    <span className={`text-xs font-semibold ${className}`}>
      {prefix}
      {formatNumber(value, 1)} % vs semana anterior
    </span>
  );
}

export function AnalyticsOverview({
  analytics,
}: {
  analytics: TrainingAnalytics;
}) {
  const week = analytics.week.current;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="p-5">
            <Dumbbell className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-sm text-slate-400">Sesiones esta semana</p>
            <p className="mt-1 text-2xl font-bold">{week.sessions}</p>
            <Trend value={analytics.week.sessionChangePercent} />
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="p-5">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-sm text-slate-400">Volumen semanal</p>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(week.volume)} kg
            </p>
            <Trend value={analytics.week.volumeChangePercent} />
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="p-5">
            <Layers3 className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-sm text-slate-400">Series esta semana</p>
            <p className="mt-1 text-2xl font-bold">{week.completedSets}</p>
            <p className="text-xs text-slate-500">Series completadas</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="p-5">
            <Clock3 className="h-5 w-5 text-emerald-400" />
            <p className="mt-4 text-sm text-slate-400">Duración semanal</p>
            <p className="mt-1 text-2xl font-bold">
              {week.durationMinutes} min
            </p>
            <Trend value={analytics.week.durationChangePercent} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Distribución por grupo muscular
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.muscleGroups.length === 0 ? (
              <p className="text-sm text-slate-400">
                Completa entrenamientos para generar la distribución.
              </p>
            ) : (
              <div className="space-y-3">
                {analytics.muscleGroups.slice(0, 10).map((group) => (
                  <div
                    key={group.muscleGroup}
                    className="grid gap-3 rounded-xl bg-slate-950 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <div>
                      <p className="font-semibold">{group.muscleGroup}</p>
                      <p className="text-xs text-slate-500">
                        {group.sessions} sesiones
                      </p>
                    </div>
                    <p className="text-sm text-slate-300">
                      {group.completedSets} series
                    </p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {formatNumber(group.volume)} kg
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-400" />
              Resumen del mes
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Entrenamientos</p>
              <p className="mt-1 text-xl font-bold">
                {analytics.month.sessions}
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Volumen</p>
              <p className="mt-1 text-xl font-bold">
                {formatNumber(analytics.month.volume)} kg
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Series</p>
              <p className="mt-1 text-xl font-bold">
                {analytics.month.completedSets}
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Tiempo total</p>
              <p className="mt-1 text-xl font-bold">
                {analytics.month.durationMinutes} min
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-emerald-400" />
            Referencias de rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.personalRecords.length === 0 ? (
            <p className="text-sm text-slate-400">
              Todavía no hay datos suficientes para calcular marcas.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {analytics.personalRecords.slice(0, 9).map((record) => (
                <article
                  key={record.exerciseName}
                  className="rounded-xl bg-slate-950 p-4"
                >
                  <p className="font-semibold">{record.exerciseName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {record.muscleGroup ?? "Sin grupo muscular"}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Carga máxima</p>
                      <p className="font-bold">
                        {formatNumber(record.maxWeight, 1)} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">1RM estimado</p>
                      <p className="font-bold text-emerald-400">
                        {formatNumber(record.estimatedOneRepMax, 1)} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Reps máximas</p>
                      <p className="font-bold">{record.maxReps}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Volumen serie</p>
                      <p className="font-bold">
                        {formatNumber(record.maxSetVolume)} kg
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
