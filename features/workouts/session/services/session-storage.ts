import type { WorkoutSessionDraft } from "@/features/workouts/session/types";

const STORAGE_PREFIX = "fit33:workout-session:";

function getStorageKey(workoutType: string) {
  return `${STORAGE_PREFIX}${workoutType}`;
}

export function loadWorkoutSessionDraft(workoutType: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(getStorageKey(workoutType));

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as WorkoutSessionDraft;

    if (parsed.version !== 1 || parsed.workoutType !== workoutType) {
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(getStorageKey(workoutType));
    return null;
  }
}

export function saveWorkoutSessionDraft(draft: WorkoutSessionDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getStorageKey(draft.workoutType),
    JSON.stringify(draft),
  );
}

export function clearWorkoutSessionDraft(workoutType: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStorageKey(workoutType));
}
