import type { CoachContext, CoachRecommendation } from "@/features/coach/types";

export function evaluateRecovery(context: CoachContext): CoachRecommendation[] {
  const dates = [
    ...new Set(
      context.workouts
        .slice(0, 6)
        .map((workout) =>
          new Date(workout.startedAt).toISOString().slice(0, 10),
        ),
    ),
  ]
    .sort()
    .reverse();
  let consecutive = 1;
  for (let index = 1; index < dates.length; index += 1) {
    const previous = new Date(dates[index - 1]).getTime();
    const current = new Date(dates[index]).getTime();
    if (previous - current === 86_400_000) consecutive += 1;
    else break;
  }
  if (consecutive < 4) return [];
  return [
    {
      id: "recovery-consecutive",
      category: "recovery",
      title: "Prioriza la recuperación",
      message: `Has entrenado ${consecutive} días consecutivos. Considera un día de descanso o actividad suave antes de otra sesión exigente.`,
      tone: "warning",
      priority: "high",
    },
  ];
}
