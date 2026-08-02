import Link from "next/link";
import { CalendarDays, ChevronRight, Clock3, Dumbbell } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutStats } from "@/features/workouts/history/services/workout-history.service";
import type { WorkoutHistoryItem } from "@/features/workouts/history/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type WorkoutHistoryCardProps = {
  workout: WorkoutHistoryItem;
};

export function WorkoutHistoryCard({ workout }: WorkoutHistoryCardProps) {
  const stats = getWorkoutStats(workout);

  return (
    <Card className="border-slate-800 bg-slate-900 text-white transition hover:border-slate-700">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-2xl">{workout.workoutType}</CardTitle>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <CalendarDays className="h-4 w-4" />
              {formatDate(workout.startedAt)}
            </p>
          </div>

          <span className="flex w-fit items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-400">
            <Clock3 className="h-4 w-4" />
            {workout.durationMinutes} min
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Ejercicios</p>
            <p className="mt-1 text-xl font-bold">{stats.exercises}</p>
          </div>
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Series</p>
            <p className="mt-1 text-xl font-bold">{stats.sets}</p>
          </div>
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Volumen</p>
            <p className="mt-1 text-xl font-bold">
              {stats.volume.toLocaleString("es-ES")} kg
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {workout.exercises.slice(0, 5).map((exercise) => (
            <span
              key={exercise.id}
              className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-400"
            >
              {exercise.name}
            </span>
          ))}
          {workout.exercises.length > 5 && (
            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-500">
              +{workout.exercises.length - 5}
            </span>
          )}
        </div>

        {workout.notes && (
          <p className="mt-4 rounded-xl bg-slate-950 p-4 text-sm text-slate-400">
            {workout.notes}
          </p>
        )}

        <Link
          href={`/entrenos/historial/${workout.id}`}
          className="mt-5 flex items-center justify-between rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
        >
          <span className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Ver sesión completa
          </span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
