import type { CoachContext, CoachRecommendation } from "@/features/coach/types";

const DAY_MS = 86_400_000;
const GROUPS = [
  "Pecho",
  "Espalda",
  "Cuádriceps",
  "Femoral",
  "Glúteo",
  "Hombro",
];

export function evaluateFrequency(
  context: CoachContext,
): CoachRecommendation[] {
  const lastDates = new Map<string, number>();
  for (const workout of context.workouts) {
    const timestamp = new Date(workout.startedAt).getTime();
    for (const exercise of workout.exercises) {
      const group = exercise.muscleGroup;
      if (
        group &&
        (!lastDates.has(group) || timestamp > (lastDates.get(group) ?? 0))
      ) {
        lastDates.set(group, timestamp);
      }
    }
  }

  const overdue = GROUPS.map((group) => ({
    group,
    timestamp: lastDates.get(group) ?? 0,
  }))
    .map((item) => ({
      ...item,
      days: item.timestamp
        ? Math.floor((context.now.getTime() - item.timestamp) / DAY_MS)
        : null,
    }))
    .filter((item) => item.days === null || item.days >= 8)
    .sort((a, b) => (b.days ?? 999) - (a.days ?? 999));

  const first = overdue[0];
  if (!first) return [];

  return [
    {
      id: `frequency-${first.group}`,
      category: "frequency",
      title: `${first.group} necesita atención`,
      message:
        first.days === null
          ? `Todavía no hay sesiones registradas para ${first.group}.`
          : `Han pasado ${first.days} días desde el último estímulo registrado de ${first.group}.`,
      tone: "warning",
      priority: first.days === null || first.days >= 12 ? "high" : "medium",
    },
  ];
}
