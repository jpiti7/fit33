import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Dumbbell,
  Gauge,
  Layers3,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  compareWorkoutExercises,
  getExerciseVolume,
  getWorkoutStats,
  normalizeWorkoutHistoryItem,
  type RawWorkoutHistoryItem,
} from "@/features/workouts/history";
import {
  getPreviousWorkoutOfType,
  getWorkoutById,
} from "@/features/workouts/repositories/workout.repository";
import { createClient } from "@/lib/supabase/server";

type WorkoutDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function Difference({
  value,
  suffix = "",
}: {
  value: number | null;
  suffix?: string;
}) {
  if (value === null) {
    return <span className="text-xs text-slate-500">Primera referencia</span>;
  }

  if (value > 0) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
        <ArrowUpRight className="h-3.5 w-3.5" />+{value.toLocaleString("es-ES")}
        {suffix}
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
        <ArrowDownRight className="h-3.5 w-3.5" />
        {value.toLocaleString("es-ES")}
        {suffix}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
      <ArrowRight className="h-3.5 w-3.5" />
      Sin cambios
    </span>
  );
}

export default async function WorkoutDetailPage({
  params,
}: WorkoutDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  let rawWorkout: RawWorkoutHistoryItem;
  try {
    rawWorkout = (await getWorkoutById(supabase, id)) as RawWorkoutHistoryItem;
  } catch {
    notFound();
  }

  const workout = normalizeWorkoutHistoryItem(rawWorkout);
  const rawPrevious = (await getPreviousWorkoutOfType(
    supabase,
    workout.workoutType,
    workout.startedAt,
  )) as RawWorkoutHistoryItem | null;
  const previous = rawPrevious
    ? normalizeWorkoutHistoryItem(rawPrevious)
    : null;
  const stats = getWorkoutStats(workout);
  const comparison = compareWorkoutExercises(workout, previous);
  const comparisonByName = new Map(comparison.map((item) => [item.name, item]));

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/entrenos/historial"
          className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Volver al historial
        </Link>

        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Fit33
            </p>
            <h1 className="mt-2 text-3xl font-bold">{workout.workoutType}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <CalendarDays className="h-4 w-4" />
              {formatDate(workout.startedAt)}
            </p>
          </div>
          <span className="flex w-fit items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400">
            <Clock3 className="h-4 w-4" />
            {workout.durationMinutes} min
          </span>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900 text-white">
            <CardContent className="p-5">
              <Dumbbell className="h-5 w-5 text-emerald-400" />
              <p className="mt-4 text-sm text-slate-400">Ejercicios</p>
              <p className="mt-1 text-2xl font-bold">{stats.exercises}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900 text-white">
            <CardContent className="p-5">
              <Layers3 className="h-5 w-5 text-emerald-400" />
              <p className="mt-4 text-sm text-slate-400">Series</p>
              <p className="mt-1 text-2xl font-bold">{stats.sets}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900 text-white">
            <CardContent className="p-5">
              <Gauge className="h-5 w-5 text-emerald-400" />
              <p className="mt-4 text-sm text-slate-400">Carga máxima</p>
              <p className="mt-1 text-2xl font-bold">
                {stats.maxWeight.toLocaleString("es-ES")} kg
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900 text-white">
            <CardContent className="p-5">
              <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              <p className="mt-4 text-sm text-slate-400">Volumen</p>
              <p className="mt-1 text-2xl font-bold">
                {stats.volume.toLocaleString("es-ES")} kg
              </p>
            </CardContent>
          </Card>
        </section>

        {previous && (
          <p className="mt-6 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
            Comparación frente a tu sesión anterior de {workout.workoutType},
            realizada el {formatDate(previous.startedAt)}.
          </p>
        )}

        <section className="mt-6 space-y-5">
          {workout.exercises.map((exercise) => {
            const exerciseComparison = comparisonByName.get(exercise.name);
            return (
              <Card
                key={exercise.id}
                className="border-slate-800 bg-slate-900 text-white"
              >
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle>{exercise.name}</CardTitle>
                      <p className="mt-1 text-sm text-slate-400">
                        {exercise.muscleGroup ?? "Grupo muscular sin registrar"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {getExerciseVolume(exercise).toLocaleString("es-ES")} kg
                      </p>
                      <Difference
                        value={exerciseComparison?.volumeDifference ?? null}
                        suffix=" kg volumen"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[520px]">
                      <div className="grid grid-cols-5 gap-2 border-b border-slate-800 pb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <span>Serie</span>
                        <span>Peso</span>
                        <span>Reps</span>
                        <span>RIR</span>
                        <span>Volumen</span>
                      </div>
                      <div className="divide-y divide-slate-800">
                        {exercise.sets.map((set) => (
                          <div
                            key={set.id}
                            className="grid grid-cols-5 gap-2 py-3 text-center text-sm"
                          >
                            <span className="text-slate-400">
                              {set.setNumber}
                            </span>
                            <span className="font-semibold">
                              {set.weight.toLocaleString("es-ES")} kg
                            </span>
                            <span>{set.reps}</span>
                            <span>{set.rir ?? "—"}</span>
                            <span className="text-slate-300">
                              {(set.weight * set.reps).toLocaleString("es-ES")}{" "}
                              kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {exerciseComparison && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-950 p-4">
                        <p className="text-xs text-slate-500">Carga máxima</p>
                        <p className="mt-1 font-bold">
                          {exerciseComparison.currentMaxWeight.toLocaleString(
                            "es-ES",
                          )}{" "}
                          kg
                        </p>
                        <Difference
                          value={exerciseComparison.maxWeightDifference}
                          suffix=" kg"
                        />
                      </div>
                      <div className="rounded-xl bg-slate-950 p-4">
                        <p className="text-xs text-slate-500">
                          Series completadas
                        </p>
                        <p className="mt-1 font-bold">
                          {exerciseComparison.currentSets}
                        </p>
                        <Difference
                          value={
                            exerciseComparison.previousSets === null
                              ? null
                              : exerciseComparison.currentSets -
                                exerciseComparison.previousSets
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>

        {workout.notes && (
          <Card className="mt-6 border-slate-800 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-slate-400">
                {workout.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
