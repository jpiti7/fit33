import Link from "next/link";
import { BarChart3, Clock3, Dumbbell, Layers3, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoachCard } from "@/features/dashboard/components/CoachCard";
import { PRCard } from "@/features/dashboard/components/PRCard";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import type { DashboardTrainingData } from "@/features/dashboard/types";

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} h ${remainingMinutes.toString().padStart(2, "0")} min`;
}

export function DashboardTrainingOverview({
  data,
}: {
  data: DashboardTrainingData;
}) {
  const { summary, muscleFocus } = data;

  return (
    <section className="mb-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-400">
            Rendimiento semanal
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Tu entrenamiento de un vistazo
          </h2>
        </div>
        <Link
          href="/analiticas"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-700 bg-transparent px-3 text-sm font-medium text-slate-200 transition hover:border-emerald-400 hover:text-emerald-400"
        >
          Ver todas las analíticas
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Entrenamientos"
          value={String(summary.weeklySessions)}
          detail="Esta semana"
          icon={Dumbbell}
          trend={summary.sessionTrend}
        />
        <SummaryCard
          label="Volumen"
          value={`${summary.weeklyVolume.toLocaleString("es-ES", { maximumFractionDigits: 0 })} kg`}
          detail="Esta semana"
          icon={BarChart3}
          trend={summary.volumeTrend}
        />
        <SummaryCard
          label="Tiempo entrenando"
          value={formatDuration(summary.weeklyDurationMinutes)}
          detail={`${summary.averageSessionDurationMinutes} min de media`}
          icon={Clock3}
          trend={summary.durationTrend}
        />
        <SummaryCard
          label="Series completadas"
          value={String(summary.weeklyCompletedSets)}
          detail="Esta semana"
          icon={Layers3}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.1fr_1.1fr]">
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-400" />
              Foco muscular
            </CardTitle>
          </CardHeader>
          <CardContent>
            {muscleFocus ? (
              <div>
                <p className="text-3xl font-bold">{muscleFocus.muscleGroup}</p>
                <p className="mt-2 text-sm text-slate-400">
                  Es el grupo con mayor volumen en los entrenamientos
                  analizados.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Series</p>
                    <p className="mt-1 text-xl font-bold">
                      {muscleFocus.completedSets}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Volumen</p>
                    <p className="mt-1 text-xl font-bold text-emerald-400">
                      {muscleFocus.volume.toLocaleString("es-ES", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      kg
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Registra sesiones para identificar tu foco muscular.
              </p>
            )}
          </CardContent>
        </Card>

        <PRCard records={data.recentRecords} />
        <CoachCard messages={data.coachMessages} />
      </div>
    </section>
  );
}
