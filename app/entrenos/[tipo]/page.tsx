import Link from "next/link";
import { notFound } from "next/navigation";

import { WORKOUT_TEMPLATES } from "@/constants/workouts";
import { WorkoutForm } from "@/features/workouts/components/WorkoutForm";

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

  const template = WORKOUT_TEMPLATES.find(
    (workout) => workout.type === workoutType,
  );

  if (!template) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/entrenos"
          className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Volver a entrenamientos
        </Link>

        <div className="mt-6">
          <WorkoutForm template={template} />
        </div>
      </div>
    </main>
  );
}
