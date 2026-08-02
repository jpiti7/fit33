import type { WorkoutFormValues } from "@/features/workouts/validations/workout.schema";

export type WorkoutSessionStatus = "running" | "paused";

export type WorkoutSessionDraft = {
  version: 1;
  workoutType: string;
  startedAt: string;
  accumulatedMs: number;
  resumedAt: string | null;
  status: WorkoutSessionStatus;
  restEndsAt: string | null;
  restDurationSeconds: number;
  formValues: WorkoutFormValues;
  savedAt: string;
};
