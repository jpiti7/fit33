import type { WorkoutType } from "@/types/workout";

export type ProgressionAction = "increase" | "maintain" | "decrease" | "start";

export type AdaptiveExercise = {
  name: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: string;
  action: ProgressionAction;
  suggestedWeight: number | null;
  reason: string;
  previousWeight: number | null;
  previousReps: number | null;
};

export type AdaptiveWorkout = {
  type: WorkoutType;
  variant: number;
  slug: string;
  intensity: "normal" | "reduced";
  recoveryScore: number;
  exercises: AdaptiveExercise[];
  summary: string;
};

export type AdaptiveSummary = {
  recoveryScore: number;
  recoveryLabel: string;
  adherencePercent: number;
  nutritionPercent: number;
  readiness: "green" | "yellow" | "red";
  headline: string;
  workout: AdaptiveWorkout;
};
