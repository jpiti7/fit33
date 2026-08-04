import type {
  ChallengeSummary,
  WeeklyChallenge,
} from "@/features/challenges/types";
import type { CoachReport } from "@/features/coach";
import type { NutritionDay } from "@/features/nutrition";
import type { RecoveryCheckin } from "@/features/recovery";
import type { HydrationDay, UserPreferences } from "@/features/settings";

function monday(date: Date) {
  const result = new Date(date);
  const distance = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - distance);
  result.setHours(0, 0, 0, 0);
  return result;
}

function challenge(input: Omit<WeeklyChallenge, "status">): WeeklyChallenge {
  return {
    ...input,
    status: input.progress >= input.target ? "completed" : "active",
  };
}

export function buildChallengeSummary({
  coach,
  nutrition,
  hydration,
  recovery,
  preferences,
  now = new Date(),
}: {
  coach: CoachReport;
  nutrition: NutritionDay;
  hydration: HydrationDay;
  recovery: RecoveryCheckin | null;
  preferences: UserPreferences;
  now?: Date;
}): ChallengeSummary {
  const proteinProgress = Math.round(nutrition.totals.protein);
  const recoveryProgress = recovery?.score ?? 0;
  const challenges = [
    challenge({
      id: "weekly-workouts",
      title: "Semana consistente",
      description: `Completa ${preferences.weeklyWorkouts} entrenamientos esta semana.`,
      metric: "Entrenamientos",
      progress: coach.completedWorkouts,
      target: preferences.weeklyWorkouts,
      unit: "sesiones",
    }),
    challenge({
      id: "daily-protein",
      title: "Proteína completa",
      description: "Alcanza hoy tu objetivo de proteína.",
      metric: "Proteína",
      progress: proteinProgress,
      target: preferences.targetProtein,
      unit: "g",
    }),
    challenge({
      id: "daily-water",
      title: "Hidratación",
      description: "Completa hoy tu objetivo de agua.",
      metric: "Agua",
      progress: hydration.amountMl,
      target: hydration.targetMl,
      unit: "ml",
    }),
    challenge({
      id: "recovery-checkin",
      title: "Escucha tu cuerpo",
      description: "Registra un check-in de recuperación de 60 puntos o más.",
      metric: "Recuperación",
      progress: recoveryProgress,
      target: 60,
      unit: "puntos",
    }),
  ];

  return {
    weekStart: monday(now).toISOString().slice(0, 10),
    completed: challenges.filter((item) => item.status === "completed").length,
    total: challenges.length,
    challenges,
  };
}
