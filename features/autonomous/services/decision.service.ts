import type {
  AutonomousProposal,
  AutonomousSummary,
} from "@/features/autonomous/types";

export type DecisionAction =
  | "reorganize_training"
  | "reduce_training"
  | "nutrition_review"
  | "recovery_checkin";

export type DecisionPreview = {
  action: DecisionAction;
  title: string;
  impact: string;
  steps: string[];
};

export function buildDecisionPreviews(
  summary: AutonomousSummary,
): DecisionPreview[] {
  return summary.proposals.map((proposal: AutonomousProposal) => {
    switch (proposal.kind) {
      case "reorganize_training":
        return {
          action: proposal.kind,
          title: "Nueva distribución semanal",
          impact:
            "Prioriza las sesiones pendientes sin concentrarlas en días consecutivos innecesarios.",
          steps: [
            `Mantener ${summary.context.weeklyTarget} sesiones como objetivo semanal.`,
            `Partir de las ${summary.context.completedWorkouts} sesiones ya completadas.`,
            "Colocar primero la sesión recomendada por el Coach.",
          ],
        };
      case "reduce_training":
        return {
          action: proposal.kind,
          title: "Sesión protegida",
          impact:
            "Reduce el estrés de entrenamiento mientras la recuperación esté por debajo de 50/100.",
          steps: [
            "Reducir volumen antes que técnica o calidad de ejecución.",
            "Evitar trabajo al fallo y récords.",
            "Reevaluar la recuperación antes de volver a progresar.",
          ],
        };
      case "nutrition_review":
        return {
          action: proposal.kind,
          title: "Ajuste nutricional del día",
          impact: `La prioridad es acercarte al objetivo de proteína (${summary.context.proteinPercent}% completado).`,
          steps: [
            "Revisar las comidas registradas hoy.",
            "Completar proteína antes de añadir calorías innecesarias.",
            "Volver a comprobar el porcentaje tras registrar la siguiente comida.",
          ],
        };
      case "recovery_checkin":
        return {
          action: proposal.kind,
          title: "Nuevo check-in",
          impact:
            "Una medición actualizada puede cambiar la intensidad recomendada.",
          steps: [
            "Registrar sueño, energía, estrés y molestias.",
            "Actualizar el Recovery Score.",
            "Recalcular la recomendación del entrenamiento.",
          ],
        };
    }
  });
}
