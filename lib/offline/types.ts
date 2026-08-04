import type { WorkoutFormValues } from "@/features/workouts/validations/workout.schema";

export type PendingWorkout = {
  id: string;
  clientId: string;
  startedAt: string;
  createdAt: string;
  attempts: number;
  lastError: string | null;
  values: WorkoutFormValues;
};

export type OfflineQueueSnapshot = {
  pending: number;
  syncing: boolean;
  lastSyncedAt: string | null;
};
