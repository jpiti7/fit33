import type {
  Achievement,
  AchievementSummary,
} from "@/features/achievements/types";
import type { WorkoutHistoryItem } from "@/features/workouts/history";
import type { WeightLog } from "@/types/weight-log";

type AchievementInput = {
  workouts: WorkoutHistoryItem[];
  weightLogs: WeightLog[];
  now?: Date;
};

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function completedWeeks(workouts: WorkoutHistoryItem[], now: Date) {
  let streak = 0;
  const cursor = startOfWeek(now);

  for (let index = 0; index < 52; index += 1) {
    const end = new Date(cursor);
    end.setDate(end.getDate() + 7);
    const sessions = workouts.filter((workout) => {
      const date = new Date(workout.startedAt);
      return date >= cursor && date < end;
    }).length;

    if (sessions < 4) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 7);
  }

  return streak;
}

function maxWeight(workouts: WorkoutHistoryItem[]) {
  return workouts.reduce(
    (best, workout) =>
      Math.max(
        best,
        ...workout.exercises.flatMap((exercise) =>
          exercise.sets.map((set) => set.weight),
        ),
      ),
    0,
  );
}

function createAchievement(
  achievement: Omit<Achievement, "progress" | "unlocked">,
  value: number,
): Achievement {
  return {
    ...achievement,
    progress: Math.min(achievement.target, value),
    unlocked: value >= achievement.target,
  };
}

export function buildAchievementSummary({
  workouts,
  weightLogs,
  now = new Date(),
}: AchievementInput): AchievementSummary {
  const sessions = workouts.length;
  const streak = completedWeeks(workouts, now);
  const strongestSet = maxWeight(workouts);
  const orderedWeights = [...weightLogs].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const firstWeight = orderedWeights[0]?.weight ?? 0;
  const currentWeight = orderedWeights.at(-1)?.weight ?? firstWeight;
  const lostWeight = Math.max(0, firstWeight - currentWeight);

  const achievements: Achievement[] = [
    createAchievement(
      {
        id: "first-workout",
        title: "Primer paso",
        description: "Completa tu primer entrenamiento.",
        category: "training",
        target: 1,
      },
      sessions,
    ),
    createAchievement(
      {
        id: "ten-workouts",
        title: "En marcha",
        description: "Completa 10 entrenamientos.",
        category: "training",
        target: 10,
      },
      sessions,
    ),
    createAchievement(
      {
        id: "fifty-workouts",
        title: "Constancia real",
        description: "Completa 50 entrenamientos.",
        category: "training",
        target: 50,
      },
      sessions,
    ),
    createAchievement(
      {
        id: "three-week-streak",
        title: "Tres semanas sólidas",
        description:
          "Cumple cuatro sesiones durante tres semanas consecutivas.",
        category: "consistency",
        target: 3,
      },
      streak,
    ),
    createAchievement(
      {
        id: "hundred-kilos",
        title: "Club de los 100",
        description: "Registra una serie con 100 kg o más.",
        category: "strength",
        target: 100,
      },
      strongestSet,
    ),
    createAchievement(
      {
        id: "five-kilos-lost",
        title: "Cinco menos",
        description: "Reduce 5 kg desde tu primer registro.",
        category: "progress",
        target: 5,
      },
      lostWeight,
    ),
  ];

  const unlocked = achievements.filter((item) => item.unlocked).length;
  const points = unlocked * 100 + Math.min(99, sessions * 5);

  return {
    unlocked,
    total: achievements.length,
    points,
    level: Math.max(1, Math.floor(points / 300) + 1),
    achievements,
  };
}
