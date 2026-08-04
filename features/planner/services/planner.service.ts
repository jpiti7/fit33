import type { CoachReport } from "@/features/coach";
import type { WeeklyPlan } from "@/features/planner/types";

const ROUTINE = [
  { type: "Push", slug: "push", focus: "Pecho, hombro y tríceps" },
  { type: "Pierna A", slug: "pierna-a", focus: "Cuádriceps y gemelo" },
  { type: "Pull", slug: "pull", focus: "Espalda y bíceps" },
  {
    type: "Pierna B + hombro",
    slug: "pierna-b-hombro",
    focus: "Cadena posterior y deltoides",
  },
] as const;

function monday(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const distance = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - distance);
  return result;
}

function isoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function buildWeeklyPlan(
  report: CoachReport,
  now = new Date(),
  weeklyTarget = 4,
): WeeklyPlan {
  const start = monday(now);
  const offsetsByTarget: Record<number, number[]> = {
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  const safeTarget = Math.max(1, Math.min(7, weeklyTarget));
  const offsets = offsetsByTarget[safeTarget];
  const recommendedIndex = ROUTINE.findIndex(
    (item) => item.slug === report.nextWorkout.slug,
  );
  const ordered = [
    ...ROUTINE.slice(Math.max(0, recommendedIndex)),
    ...ROUTINE.slice(0, Math.max(0, recommendedIndex)),
  ];

  const sessions = offsets.slice(0, safeTarget).map((offset, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + offset);
    const template = ordered[index % ordered.length];
    return {
      day: new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(date),
      date: isoDay(date),
      type: template.type,
      slug: template.slug,
      focus: template.focus,
      reason:
        index === 0
          ? report.nextWorkout.reason
          : "Mantiene una distribución equilibrada y deja recuperación entre estímulos similares.",
    };
  });

  const sessionDates = new Set(sessions.map((session) => session.date));
  const recoveryDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index);
    return isoDay(date);
  }).filter((date) => !sessionDates.has(date));

  return { weekStart: isoDay(start), sessions, recoveryDays };
}
