import type {
  AutonomousContext,
  AutonomousProposal,
  AutonomousSummary,
} from "@/features/autonomous/types";

function proteinPercent(context: AutonomousContext) {
  if (context.nutrition.targets.protein <= 0) return 0;
  return Math.min(
    100,
    Math.round(
      (context.nutrition.totals.protein / context.nutrition.targets.protein) *
        100,
    ),
  );
}

function addProposal(list: AutonomousProposal[], proposal: AutonomousProposal) {
  if (!list.some((item) => item.id === proposal.id)) list.push(proposal);
}

export function buildAutonomousSummary(
  context: AutonomousContext,
): AutonomousSummary {
  const { coach, recovery } = context;
  const protein = proteinPercent(context);
  const proposals: AutonomousProposal[] = [];

  if (coach.completedWorkouts < coach.weeklyTarget) {
    addProposal(proposals, {
      id: "reorganize-training",
      kind: "reorganize_training",
      title: "Reorganizar la semana",
      message: `Llevas ${coach.completedWorkouts}/${coach.weeklyTarget} entrenamientos. Puedo priorizar las sesiones restantes para que mantengas la frecuencia sin intentar compensar con sesiones excesivas.`,
      priority: "high",
      cta: "Reorganizar semana",
    });
  }

  if (recovery.score < 50) {
    addProposal(proposals, {
      id: "reduce-training",
      kind: "reduce_training",
      title: "Proteger la recuperación",
      message:
        "La recuperación es baja. La propuesta es reducir intensidad y volumen hoy, evitando récords y trabajo al fallo.",
      priority: "high",
      cta: "Aplicar sesión reducida",
    });
  } else if (recovery.score < 65) {
    addProposal(proposals, {
      id: "recovery-checkin",
      kind: "recovery_checkin",
      title: "Actualizar recuperación",
      message:
        "Tu recuperación está en una zona intermedia. Un nuevo check-in puede cambiar la recomendación de la sesión.",
      priority: "medium",
      cta: "Actualizar check-in",
    });
  }

  if (protein < 80) {
    addProposal(proposals, {
      id: "nutrition-review",
      kind: "nutrition_review",
      title: "Revisar nutrición de hoy",
      message: `Has alcanzado aproximadamente el ${protein}% de tu objetivo de proteína. Puedo llevarte directamente al registro para completar el día.`,
      priority: "medium",
      cta: "Revisar nutrición",
    });
  }

  if (proposals.length === 0) {
    addProposal(proposals, {
      id: "maintain-course",
      kind: "recovery_checkin",
      title: "Mantener el plan",
      message:
        "No he detectado una desviación importante. Mantén la rutina y registra el resultado de la sesión para que Fit33 pueda ajustar la siguiente.",
      priority: "low",
      cta: "Ver entrenamiento",
    });
  }

  const score = Math.round(
    coach.score * 0.4 + recovery.score * 0.4 + Math.min(100, protein) * 0.2,
  );

  return {
    score,
    headline:
      score >= 80
        ? "El plan está bajo control. Fit33 solo propone pequeños ajustes."
        : score >= 60
          ? "Hay margen de mejora. Fit33 ha preparado acciones concretas."
          : "Fit33 detecta señales para actuar antes de que afecten a tu progreso.",
    proposals,
    context: {
      adherencePercent: coach.adherencePercent,
      recoveryScore: recovery.score,
      proteinPercent: protein,
      completedWorkouts: coach.completedWorkouts,
      weeklyTarget: coach.weeklyTarget,
    },
  };
}
