import { getWorkoutTemplate } from "@/constants/workouts";
import type { CoachReport } from "@/features/coach/types";
import type { NutritionDay } from "@/features/nutrition/types";
import type { RecoveryState } from "@/features/recovery/types";
import type { WorkoutType } from "@/types/workout";
import type {
  AdaptiveExercise,
  AdaptiveSummary,
} from "@/features/adaptive/types";

function parseRepRange(value: string) {
  const match = value.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return { min: 8, max: 12 };
  return { min: Number(match[1]), max: Number(match[2]) };
}

function roundWeight(weight: number) {
  return Math.round(weight * 2) / 2;
}

function buildExercise(
  exercise: {
    name: string;
    muscleGroup: string;
    targetSets: number;
    targetReps: string;
  },
  previous: PreviousWorkout | null,
  recoveryScore: number,
): AdaptiveExercise {
  const previousExercise = previous?.exercises?.find(
    (item) => item.exercise_name === exercise.name,
  );
  const sets = previousExercise?.sets?.filter((set) => set.completed) ?? [];
  const lastWeight = sets.length
    ? Math.max(...sets.map((set) => Number(set.weight)))
    : null;
  const averageReps = sets.length
    ? sets.reduce((sum, set) => sum + Number(set.reps), 0) / sets.length
    : null;
  const averageRir = sets.length
    ? sets.reduce((sum, set) => sum + Number(set.rir ?? 0), 0) / sets.length
    : null;
  const range = parseRepRange(exercise.targetReps);

  if (lastWeight === null) {
    return {
      ...exercise,
      action: "start",
      suggestedWeight: null,
      reason:
        "No hay una carga anterior registrada. Usa una carga cómoda que te deje 2-3 RIR.",
      previousWeight: null,
      previousReps: null,
    };
  }

  if (recoveryScore < 50) {
    return {
      ...exercise,
      action: "decrease",
      suggestedWeight: roundWeight(lastWeight * 0.9),
      reason:
        "Recuperación baja: reduce la carga aproximadamente un 10% y evita el fallo.",
      previousWeight: lastWeight,
      previousReps: averageReps === null ? null : Math.round(averageReps),
    };
  }

  if (
    averageReps !== null &&
    averageReps >= range.max &&
    (averageRir ?? 0) >= 2
  ) {
    return {
      ...exercise,
      action: "increase",
      suggestedWeight: roundWeight(lastWeight * 1.025),
      reason: `Completaste el rango alto con margen (${Math.round(averageReps)} reps y ${Math.round(averageRir ?? 0)} RIR). Sube ligeramente la carga.`,
      previousWeight: lastWeight,
      previousReps: Math.round(averageReps),
    };
  }

  if (averageReps !== null && averageReps < range.min) {
    return {
      ...exercise,
      action: "decrease",
      suggestedWeight: roundWeight(lastWeight * 0.95),
      reason: `Te quedaste por debajo del rango objetivo (${Math.round(averageReps)} reps). Reduce un 5% para recuperar el rango.`,
      previousWeight: lastWeight,
      previousReps: Math.round(averageReps),
    };
  }

  return {
    ...exercise,
    action: "maintain",
    suggestedWeight: lastWeight,
    reason:
      "Mantén la carga y busca añadir alguna repetición antes de volver a subir peso.",
    previousWeight: lastWeight,
    previousReps: averageReps === null ? null : Math.round(averageReps),
  };
}

type PreviousSet = {
  weight: number;
  reps: number;
  rir: number;
  completed: boolean;
};
type PreviousExercise = { exercise_name: string; sets: PreviousSet[] };
type PreviousWorkout = { exercises: PreviousExercise[] };

export function buildAdaptiveSummary(input: {
  coach: CoachReport;
  recovery: RecoveryState;
  nutrition: NutritionDay;
  previousWorkout: PreviousWorkout | null;
}): AdaptiveSummary {
  const type = input.coach.nextWorkout.type as WorkoutType;
  const template = getWorkoutTemplate(type);
  if (!template) throw new Error("No se encontró la rutina adaptativa.");

  const intensity = input.recovery.score < 55 ? "reduced" : "normal";
  const exercises = template.exercises.map((exercise) =>
    buildExercise(exercise, input.previousWorkout, input.recovery.score),
  );

  const nutritionPercent = Math.min(
    100,
    Math.round(
      (input.nutrition.totals.protein / input.nutrition.targets.protein) * 100,
    ),
  );
  const readiness =
    input.recovery.score >= 75 && input.coach.adherencePercent >= 75
      ? "green"
      : input.recovery.score >= 50
        ? "yellow"
        : "red";

  const summary =
    input.recovery.score < 50
      ? "Hoy priorizamos recuperación: menos carga y cero necesidad de buscar récords."
      : input.recovery.score < 75
        ? "Entrena con normalidad controlada y deja margen; progresaremos cuando el rendimiento lo confirme."
        : "Estás preparado para progresar si completas el rango con buena técnica.";

  return {
    recoveryScore: input.recovery.score,
    recoveryLabel: input.recovery.label,
    adherencePercent: input.coach.adherencePercent,
    nutritionPercent,
    readiness,
    headline:
      readiness === "green"
        ? "Todo apunta a una buena sesión de progreso."
        : readiness === "yellow"
          ? "Puedes entrenar, pero Fit33 ajustará la sesión según tu rendimiento."
          : "Hoy toca proteger la recuperación y mantener el hábito.",
    workout: {
      type,
      variant: template.variant ?? 1,
      slug: typeToSlug(type),
      intensity,
      recoveryScore: input.recovery.score,
      exercises,
      summary,
    },
  };
}

function typeToSlug(type: WorkoutType) {
  const map: Record<WorkoutType, string> = {
    Push: "push",
    "Pierna A": "pierna-a",
    Pull: "pull",
    "Pierna B + hombro": "pierna-b-hombro",
  };
  return map[type];
}
