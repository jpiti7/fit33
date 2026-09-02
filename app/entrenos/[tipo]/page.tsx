import Link from "next/link";
import { notFound } from "next/navigation";

import { getWorkoutTemplate } from "@/constants/workouts";
import { WorkoutForm } from "@/features/workouts/components/WorkoutForm";
import { getAdaptiveSummaryAction } from "@/features/adaptive";

type WorkoutPageProps = {
  params: Promise<{
    tipo: string;
  }>;
};

const slugToType: Record<string, string> = {
  push: "Push",
  "pierna-a": "Pierna A",
  pull: "Pull",
  "pierna-b-hombro": "Pierna B + hombro",
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { tipo } = await params;
  const workoutType = slugToType[tipo];

  const template = workoutType ? getWorkoutTemplate(workoutType) : undefined;

  if (!template) {
    notFound();
  }

  const adaptive = await getAdaptiveSummaryAction(workoutType);

  return (
    <main className="min-h-screen bg-slate-950 px-3 pb-6 pt-[max(0.75rem,env(safe-area-inset-top))] text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/entrenos"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Volver a entrenamientos
        </Link>

        <div className="mt-3 sm:mt-6">
          <WorkoutForm
            template={template}
            suggestedWeights={Object.fromEntries(
              adaptive.workout.exercises.map((exercise) => [
                exercise.name,
                exercise.suggestedWeight,
              ]),
            )}
          />
        </div>
      </div>
    </main>
  );
}
