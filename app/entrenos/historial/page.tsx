import Link from "next/link";
import { BarChart3, Clock3, Dumbbell, Layers3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  getHistorySummary,
  normalizeWorkoutHistoryItem,
  type RawWorkoutHistoryItem,
  WorkoutHistoryCard,
} from "@/features/workouts/history";
import { listWorkouts } from "@/features/workouts/repositories/workout.repository";
import { createClient } from "@/lib/supabase/server";

export default async function WorkoutHistoryPage() {
  const supabase = await createClient();
  const rawWorkouts = (await listWorkouts(
    supabase,
    50,
  )) as RawWorkoutHistoryItem[];
  const workouts = rawWorkouts.map(normalizeWorkoutHistoryItem);
  const summary = getHistorySummary(workouts);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/entrenos"
          className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Volver a entrenamientos
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Historial de entrenamientos
          </h1>
          <p className="mt-2 text-slate-400">
            Consulta tus sesiones, cargas, volumen y evolución respecto al
            entrenamiento anterior.
          </p>
        </header>

        {workouts.length > 0 && (
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-slate-800 bg-slate-900 text-white">
              <CardContent className="p-5">
                <Dumbbell className="h-5 w-5 text-emerald-400" />
                <p className="mt-4 text-sm text-slate-400">Sesiones</p>
                <p className="mt-1 text-2xl font-bold">{summary.sessions}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900 text-white">
              <CardContent className="p-5">
                <Clock3 className="h-5 w-5 text-emerald-400" />
                <p className="mt-4 text-sm text-slate-400">Duración media</p>
                <p className="mt-1 text-2xl font-bold">
                  {summary.averageDuration} min
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900 text-white">
              <CardContent className="p-5">
                <Layers3 className="h-5 w-5 text-emerald-400" />
                <p className="mt-4 text-sm text-slate-400">Series totales</p>
                <p className="mt-1 text-2xl font-bold">{summary.totalSets}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900 text-white">
              <CardContent className="p-5">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                <p className="mt-4 text-sm text-slate-400">Volumen acumulado</p>
                <p className="mt-1 text-2xl font-bold">
                  {summary.totalVolume.toLocaleString("es-ES")} kg
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {workouts.length === 0 ? (
          <Card className="mt-8 border-slate-800 bg-slate-900 text-white">
            <CardContent className="py-12 text-center">
              <Dumbbell className="mx-auto h-10 w-10 text-slate-600" />
              <p className="mt-4 text-lg font-semibold">
                Todavía no hay entrenamientos
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Completa tu primera sesión para verla aquí.
              </p>
            </CardContent>
          </Card>
        ) : (
          <section className="mt-8 space-y-4">
            {workouts.map((workout) => (
              <WorkoutHistoryCard key={workout.id} workout={workout} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
