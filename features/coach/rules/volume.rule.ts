import type { CoachContext, CoachRecommendation } from "@/features/coach/types";

export function evaluateVolume(context: CoachContext): CoachRecommendation[] {
  const change = context.analytics.week.volumeChangePercent;
  if (change === null) return [];

  if (change >= 8 && change <= 20) {
    return [
      {
        id: "volume-progress",
        category: "volume",
        title: "Progresión de volumen adecuada",
        message: `Tu volumen semanal ha aumentado un ${Math.round(change)} %. Mantén las cargas y prioriza una técnica limpia.`,
        tone: "positive",
        priority: "medium",
      },
    ];
  }
  if (change > 20) {
    return [
      {
        id: "volume-spike",
        category: "volume",
        title: "Subida de volumen elevada",
        message: `Has aumentado el volumen un ${Math.round(change)} %. Evita otro salto similar la próxima semana para controlar la fatiga.`,
        tone: "warning",
        priority: "high",
      },
    ];
  }
  if (change <= -15) {
    return [
      {
        id: "volume-drop",
        category: "volume",
        title: "Volumen semanal en descenso",
        message: `El volumen ha bajado un ${Math.abs(Math.round(change))} %. Comprueba si ha sido una descarga planificada o falta de adherencia.`,
        tone: "warning",
        priority: "medium",
      },
    ];
  }
  return [];
}
