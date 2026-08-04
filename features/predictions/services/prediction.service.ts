import type {
  PredictionSummary,
  StrengthPrediction,
  WeightPrediction,
} from "@/features/predictions/types";
import type { WorkoutHistoryItem } from "@/features/workouts/history";
import type { WeightLog } from "@/types/weight-log";

const DAY_MS = 86_400_000;

function round(value: number, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function buildWeightPrediction(
  weightLogs: WeightLog[],
  targetWeight: number | null,
  now: Date,
): WeightPrediction {
  const ordered = [...weightLogs]
    .filter((log) => Number.isFinite(log.weight))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  const currentWeight = ordered.at(-1)?.weight ?? null;

  if (currentWeight === null || targetWeight === null) {
    return {
      currentWeight,
      targetWeight,
      weeklyChangeKg: null,
      estimatedWeeks: null,
      estimatedDate: null,
      confidence: "low",
      message: "Registra peso y objetivo para activar la predicción.",
    };
  }

  const recent = ordered.slice(-8);
  if (recent.length < 2) {
    return {
      currentWeight,
      targetWeight,
      weeklyChangeKg: null,
      estimatedWeeks: null,
      estimatedDate: null,
      confidence: "low",
      message: "Necesitamos al menos dos registros para estimar una tendencia.",
    };
  }

  const first = recent[0];
  const last = recent.at(-1)!;
  const elapsedWeeks = Math.max(
    1 / 7,
    (new Date(last.created_at).getTime() -
      new Date(first.created_at).getTime()) /
      DAY_MS /
      7,
  );
  const weeklyChangeKg = (last.weight - first.weight) / elapsedWeeks;
  const remaining = targetWeight - currentWeight;
  const movingTowardTarget =
    remaining === 0 ||
    (remaining < 0 && weeklyChangeKg < 0) ||
    (remaining > 0 && weeklyChangeKg > 0);

  if (!movingTowardTarget || Math.abs(weeklyChangeKg) < 0.05) {
    return {
      currentWeight,
      targetWeight,
      weeklyChangeKg: round(weeklyChangeKg, 2),
      estimatedWeeks: null,
      estimatedDate: null,
      confidence: recent.length >= 6 ? "medium" : "low",
      message:
        "La tendencia actual todavía no permite estimar una fecha fiable para el objetivo.",
    };
  }

  const estimatedWeeks = Math.max(
    0,
    Math.ceil(Math.abs(remaining / weeklyChangeKg)),
  );
  const estimatedDate = new Date(now);
  estimatedDate.setDate(estimatedDate.getDate() + estimatedWeeks * 7);

  return {
    currentWeight,
    targetWeight,
    weeklyChangeKg: round(weeklyChangeKg, 2),
    estimatedWeeks,
    estimatedDate: estimatedDate.toISOString().slice(0, 10),
    confidence:
      recent.length >= 6 ? "high" : recent.length >= 4 ? "medium" : "low",
    message:
      estimatedWeeks === 0
        ? "Has alcanzado tu objetivo de peso."
        : `Manteniendo la tendencia, podrías alcanzar el objetivo en unas ${estimatedWeeks} semanas.`,
  };
}

function buildStrengthPredictions(
  workouts: WorkoutHistoryItem[],
): StrengthPrediction[] {
  const byExercise = new Map<string, { date: number; weight: number }[]>();

  for (const workout of workouts) {
    const date = new Date(workout.startedAt).getTime();
    for (const exercise of workout.exercises) {
      const maxWeight = Math.max(
        0,
        ...exercise.sets
          .filter((set) => set.completed)
          .map((set) => set.weight),
      );
      if (maxWeight <= 0) continue;
      const values = byExercise.get(exercise.name) ?? [];
      values.push({ date, weight: maxWeight });
      byExercise.set(exercise.name, values);
    }
  }

  return [...byExercise.entries()]
    .map(([exercise, values]) => {
      const ordered = values.sort((a, b) => a.date - b.date).slice(-6);
      const currentBestWeight = Math.max(...ordered.map((item) => item.weight));
      const first = ordered[0];
      const last = ordered.at(-1)!;
      const weeks = Math.max(1, (last.date - first.date) / DAY_MS / 7);
      const weeklyGain = (last.weight - first.weight) / weeks;
      const predictedWeight = Math.max(
        currentBestWeight,
        round(currentBestWeight + Math.max(0, weeklyGain) * 4, 1),
      );
      return {
        exercise,
        currentBestWeight,
        predictedWeight,
        horizonWeeks: 4,
        message:
          predictedWeight > currentBestWeight
            ? `La tendencia sugiere margen para acercarte a ${predictedWeight} kg.`
            : "Mantén la técnica y la consistencia antes de aumentar la carga.",
      };
    })
    .sort((a, b) => b.currentBestWeight - a.currentBestWeight)
    .slice(0, 5);
}

export function buildPredictionSummary({
  weightLogs,
  workouts,
  targetWeight,
  now = new Date(),
}: {
  weightLogs: WeightLog[];
  workouts: WorkoutHistoryItem[];
  targetWeight: number | null;
  now?: Date;
}): PredictionSummary {
  return {
    weight: buildWeightPrediction(weightLogs, targetWeight, now),
    strength: buildStrengthPredictions(workouts),
  };
}
