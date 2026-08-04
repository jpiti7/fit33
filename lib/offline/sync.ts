import { finishWorkoutAction } from "@/features/workouts/actions/workout.actions";
import {
  dequeueWorkout,
  listQueuedWorkouts,
  markWorkoutSyncFailure,
} from "@/lib/offline/queue";
import { isOnline } from "@/lib/offline/network";

let activeSync: Promise<number> | null = null;

async function performSync() {
  if (!isOnline()) {
    return 0;
  }

  let synced = 0;
  const pending = await listQueuedWorkouts();

  for (const item of pending) {
    try {
      const result = await finishWorkoutAction(
        item.values,
        item.startedAt,
        item.clientId,
      );

      if (!result.success) {
        await markWorkoutSyncFailure(item, result.message);
        continue;
      }

      await dequeueWorkout(item.id);
      synced += 1;
    } catch (error) {
      await markWorkoutSyncFailure(
        item,
        error instanceof Error ? error.message : "Error de sincronización.",
      );
      break;
    }
  }

  return synced;
}

export function syncPendingWorkouts() {
  if (!activeSync) {
    activeSync = performSync().finally(() => {
      activeSync = null;
    });
  }

  return activeSync;
}
