import type { WorkoutFormValues } from "@/features/workouts/validations/workout.schema";
import {
  getPendingWorkout,
  getPendingWorkouts,
  removePendingWorkout,
  savePendingWorkout,
} from "@/lib/offline/storage";
import type { PendingWorkout } from "@/lib/offline/types";

export function deduplicatePendingWorkouts(items: PendingWorkout[]) {
  return Array.from(
    new Map(items.map((item) => [item.clientId, item])).values(),
  );
}

export async function enqueueWorkout(input: {
  clientId: string;
  startedAt: string;
  values: WorkoutFormValues;
}) {
  const existing = await getPendingWorkout(input.clientId);

  const pending: PendingWorkout = {
    id: input.clientId,
    clientId: input.clientId,
    startedAt: input.startedAt,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    attempts: existing?.attempts ?? 0,
    lastError: null,
    values: input.values,
  };

  await savePendingWorkout(pending);
  window.dispatchEvent(new Event("fit33:offline-queue-change"));
  return pending;
}

export async function listQueuedWorkouts() {
  return deduplicatePendingWorkouts(await getPendingWorkouts());
}

export async function markWorkoutSyncFailure(
  item: PendingWorkout,
  error: string,
) {
  await savePendingWorkout({
    ...item,
    attempts: item.attempts + 1,
    lastError: error,
  });
  window.dispatchEvent(new Event("fit33:offline-queue-change"));
}

export async function dequeueWorkout(id: string) {
  await removePendingWorkout(id);
  window.dispatchEvent(new Event("fit33:offline-queue-change"));
}
