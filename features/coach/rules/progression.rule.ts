import type { CoachContext, CoachRecommendation } from "@/features/coach/types";

export function evaluateProgression(
  context: CoachContext,
): CoachRecommendation[] {
  const record = [...context.analytics.personalRecords].sort(
    (a, b) =>
      new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime(),
  )[0];
  if (!record) return [];
  const days = Math.floor(
    (context.now.getTime() - new Date(record.achievedAt).getTime()) /
      86_400_000,
  );
  if (days > 14) return [];

  return [
    {
      id: "progression-record",
      category: "progression",
      title: `Marca destacada en ${record.exerciseName}`,
      message: `${record.maxWeight.toLocaleString("es-ES")} kg de carga máxima y ${record.estimatedOneRepMax.toLocaleString("es-ES", { maximumFractionDigits: 1 })} kg de 1RM estimado.`,
      tone: "positive",
      priority: "medium",
    },
  ];
}
