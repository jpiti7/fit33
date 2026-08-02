import type { CoachContext, CoachRecommendation } from "@/features/coach/types";

const DAY_MS = 86_400_000;

export function evaluateWeight(context: CoachContext): CoachRecommendation[] {
  if (context.weightLogs.length < 2) return [];

  const latest = context.weightLogs[0];
  const reference = context.weightLogs.find(
    (log) =>
      new Date(latest.created_at).getTime() -
        new Date(log.created_at).getTime() >=
      6 * DAY_MS,
  );
  if (!reference) return [];

  const difference = latest.weight - reference.weight;
  if (difference <= -1) {
    return [
      {
        id: "weight-fast-loss",
        category: "weight",
        title: "Pérdida de peso rápida",
        message: `Has bajado ${Math.abs(difference).toFixed(1)} kg en aproximadamente una semana. Vigila energía, hambre y rendimiento.`,
        tone: "warning",
        priority: "high",
      },
    ];
  }
  if (difference < -0.2) {
    return [
      {
        id: "weight-steady-loss",
        category: "weight",
        title: "Ritmo de peso favorable",
        message: `Has bajado ${Math.abs(difference).toFixed(1)} kg manteniendo un ritmo compatible con la recomposición corporal.`,
        tone: "positive",
        priority: "medium",
      },
    ];
  }
  if (Math.abs(difference) <= 0.2) {
    return [
      {
        id: "weight-stable",
        category: "weight",
        title: "Peso estable",
        message:
          "El peso apenas ha cambiado. Valora también cintura, rendimiento y media semanal antes de ajustar calorías.",
        tone: "neutral",
        priority: "low",
      },
    ];
  }
  return [
    {
      id: "weight-up",
      category: "weight",
      title: "Peso semanal al alza",
      message: `El peso ha aumentado ${difference.toFixed(1)} kg. Revisa si se debe a retención puntual o a una tendencia sostenida.`,
      tone: "warning",
      priority: "medium",
    },
  ];
}
