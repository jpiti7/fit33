import { PROFILE } from "@/constants/profile";
import type { TrainingAnalytics } from "@/features/analytics";
import type {
  DashboardCoachMessage,
  DashboardTrainingData,
  DashboardTrend,
} from "@/features/dashboard/types";

function createTrend(value: number | null, label: string): DashboardTrend {
  return { value, label };
}

function buildCoachMessages(
  analytics: TrainingAnalytics,
): DashboardCoachMessage[] {
  const messages: DashboardCoachMessage[] = [];
  const currentWeek = analytics.week.current;
  const volumeChange = analytics.week.volumeChangePercent;

  if (currentWeek.sessions === 0) {
    messages.push({
      id: "start-week",
      tone: "neutral",
      title: "Semana por empezar",
      message:
        "Todavía no has registrado entrenamientos esta semana. Elige una rutina y completa tu primera sesión.",
    });
  } else if (currentWeek.sessions >= PROFILE.weeklyWorkouts) {
    messages.push({
      id: "weekly-target",
      tone: "positive",
      title: "Objetivo semanal completado",
      message: `Ya has completado ${currentWeek.sessions} entrenamientos, alcanzando tu objetivo de ${PROFILE.weeklyWorkouts} sesiones.`,
    });
  } else {
    const remaining = PROFILE.weeklyWorkouts - currentWeek.sessions;
    messages.push({
      id: "weekly-progress",
      tone: "neutral",
      title: "Buen ritmo semanal",
      message: `Llevas ${currentWeek.sessions} entrenamientos. Te faltan ${remaining} para completar tu objetivo semanal.`,
    });
  }

  if (volumeChange !== null && volumeChange >= 10) {
    messages.push({
      id: "volume-up",
      tone: "positive",
      title: "Tu volumen está creciendo",
      message: `Has aumentado el volumen semanal un ${Math.round(volumeChange)} %. Mantén la técnica y evita subir las cargas demasiado rápido.`,
    });
  } else if (volumeChange !== null && volumeChange <= -15) {
    messages.push({
      id: "volume-down",
      tone: "warning",
      title: "Descenso de volumen",
      message: `Tu volumen semanal ha bajado un ${Math.abs(Math.round(volumeChange))} %. Revisa si se debe a fatiga, falta de tiempo o una descarga planificada.`,
    });
  }

  const topMuscleGroup = analytics.muscleGroups[0];

  if (topMuscleGroup && currentWeek.sessions > 0) {
    messages.push({
      id: "muscle-focus",
      tone: "neutral",
      title: `Mayor estímulo: ${topMuscleGroup.muscleGroup}`,
      message: `${topMuscleGroup.completedSets} series registradas y ${Math.round(topMuscleGroup.volume).toLocaleString("es-ES")} kg de volumen acumulado en los datos analizados.`,
    });
  }

  if (analytics.personalRecords.length > 0) {
    const latestRecord = [...analytics.personalRecords].sort(
      (a, b) =>
        new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime(),
    )[0];

    messages.push({
      id: "latest-record",
      tone: "positive",
      title: "Referencia destacada",
      message: `${latestRecord.exerciseName}: ${latestRecord.maxWeight.toLocaleString("es-ES")} kg de carga máxima y ${latestRecord.estimatedOneRepMax.toLocaleString("es-ES", { maximumFractionDigits: 1 })} kg de 1RM estimado.`,
    });
  }

  return messages.slice(0, 3);
}

export function buildDashboardTrainingData(
  analytics: TrainingAnalytics,
): DashboardTrainingData {
  const week = analytics.week.current;
  const averageSessionDurationMinutes =
    week.sessions === 0 ? 0 : Math.round(week.durationMinutes / week.sessions);

  return {
    summary: {
      weeklySessions: week.sessions,
      weeklyVolume: week.volume,
      weeklyDurationMinutes: week.durationMinutes,
      weeklyCompletedSets: week.completedSets,
      averageSessionDurationMinutes,
      sessionTrend: createTrend(
        analytics.week.sessionChangePercent,
        "vs semana anterior",
      ),
      volumeTrend: createTrend(
        analytics.week.volumeChangePercent,
        "vs semana anterior",
      ),
      durationTrend: createTrend(
        analytics.week.durationChangePercent,
        "vs semana anterior",
      ),
    },
    muscleFocus: analytics.muscleGroups[0] ?? null,
    recentRecords: [...analytics.personalRecords]
      .sort(
        (a, b) =>
          new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime(),
      )
      .slice(0, 3)
      .map((record) => ({
        exerciseName: record.exerciseName,
        muscleGroup: record.muscleGroup,
        maxWeight: record.maxWeight,
        estimatedOneRepMax: record.estimatedOneRepMax,
        achievedAt: record.achievedAt,
      })),
    coachMessages: buildCoachMessages(analytics),
  };
}
