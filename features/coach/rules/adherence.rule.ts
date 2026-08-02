import { PROFILE } from "@/constants/profile";
import type { CoachContext, CoachRecommendation } from "@/features/coach/types";

export function evaluateAdherence(
  context: CoachContext,
): CoachRecommendation[] {
  const completed = context.analytics.week.current.sessions;
  const target = PROFILE.weeklyWorkouts;

  if (completed >= target) {
    return [
      {
        id: "adherence-complete",
        category: "adherence",
        title: "Objetivo semanal cumplido",
        message: `Has completado ${completed} de ${target} entrenamientos. Mantén esta constancia sin añadir volumen innecesario.`,
        tone: "positive",
        priority: "high",
      },
    ];
  }

  const remaining = target - completed;
  return [
    {
      id: "adherence-pending",
      category: "adherence",
      title: "Completa tu semana",
      message: `Llevas ${completed} de ${target} entrenamientos. Te faltan ${remaining} sesiones para alcanzar el objetivo.`,
      tone: completed === 0 ? "warning" : "neutral",
      priority: completed === 0 ? "high" : "medium",
    },
  ];
}
