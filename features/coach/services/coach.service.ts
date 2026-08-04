import { PROFILE } from "@/constants/profile";
import type {
  CoachContext,
  CoachPriority,
  CoachReport,
  CoachRecommendation,
} from "@/features/coach/types";
import { evaluateAdherence } from "@/features/coach/rules/adherence.rule";
import { evaluateFrequency } from "@/features/coach/rules/frequency.rule";
import { evaluateProgression } from "@/features/coach/rules/progression.rule";
import { evaluateRecovery } from "@/features/coach/rules/recovery.rule";
import { evaluateVolume } from "@/features/coach/rules/volume.rule";
import { evaluateWeight } from "@/features/coach/rules/weight.rule";

const priorityOrder: Record<CoachPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};
const ROUTINE = [
  { type: "Push", slug: "push" },
  { type: "Pierna A", slug: "pierna-a" },
  { type: "Pull", slug: "pull" },
  { type: "Pierna B + hombro", slug: "pierna-b-hombro" },
];

function chooseNextWorkout(context: CoachContext) {
  const latestTypes = context.workouts
    .slice(0, 8)
    .map((workout) => workout.workoutType);
  const selected =
    ROUTINE.find(
      (routine) => !latestTypes.slice(0, 3).includes(routine.type),
    ) ?? ROUTINE[context.analytics.week.current.sessions % ROUTINE.length];
  return {
    ...selected,
    reason: `Equilibra la rotación de tus cuatro sesiones semanales y evita repetir en exceso los mismos grupos.`,
  };
}

function calculateScore(
  context: CoachContext,
  recommendations: CoachRecommendation[],
) {
  const adherence = Math.min(
    100,
    (context.analytics.week.current.sessions / PROFILE.weeklyWorkouts) * 100,
  );
  const penalties = recommendations.reduce(
    (total, item) =>
      total +
      (item.tone === "warning" ? (item.priority === "high" ? 12 : 6) : 0),
    0,
  );
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        adherence -
          penalties +
          (context.analytics.week.volumeChangePercent &&
          context.analytics.week.volumeChangePercent > 0
            ? 8
            : 0),
      ),
    ),
  );
}

export function buildCoachReport(context: CoachContext): CoachReport {
  const recommendations = [
    ...evaluateAdherence(context),
    ...evaluateFrequency(context),
    ...evaluateVolume(context),
    ...evaluateProgression(context),
    ...evaluateWeight(context),
    ...evaluateRecovery(context),
  ].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const completed = context.analytics.week.current.sessions;
  const adherencePercent = Math.min(
    100,
    Math.round((completed / PROFILE.weeklyWorkouts) * 100),
  );
  const score = calculateScore(context, recommendations);

  return {
    generatedAt: context.now.toISOString(),
    score,
    headline:
      score >= 80
        ? "Semana sólida: sigue ejecutando el plan."
        : score >= 55
          ? "Vas en buena dirección, pero hay margen de mejora."
          : "Conviene simplificar la semana y recuperar constancia.",
    weeklyTarget: PROFILE.weeklyWorkouts,
    completedWorkouts: completed,
    adherencePercent,
    nextWorkout: chooseNextWorkout(context),
    weeklyBrief: {
      volume: context.analytics.week.current.volume,
      durationMinutes: context.analytics.week.current.durationMinutes,
      completedSets: context.analytics.week.current.completedSets,
      strongestExercise:
        context.analytics.personalRecords[0]?.exerciseName ?? null,
    },
    recommendations: recommendations.slice(0, 8),
  };
}
