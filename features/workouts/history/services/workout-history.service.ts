import type {
  WorkoutExerciseComparison,
  WorkoutHistoryExercise,
  WorkoutHistoryItem,
  WorkoutHistorySet,
} from "@/features/workouts/history/types";

type RawWorkoutSet = {
  id: string;
  set_number: number | null;
  weight: number | string | null;
  reps: number | null;
  rir: number | null;
  completed: boolean | null;
};

type RawWorkoutExercise = {
  id: string;
  exercise_name: string;
  muscle_group: string | null;
  exercise_order: number | null;
  sets: RawWorkoutSet[] | null;
};

export type RawWorkoutHistoryItem = {
  id: string;
  workout_type: string;
  started_at: string | null;
  finished_at: string | null;
  duration: number | null;
  notes: string | null;
  exercises: RawWorkoutExercise[] | null;
};

function normalizeSet(set: RawWorkoutSet): WorkoutHistorySet {
  return {
    id: set.id,
    setNumber: set.set_number ?? 0,
    weight: Number(set.weight ?? 0),
    reps: Number(set.reps ?? 0),
    rir: set.rir,
    completed: Boolean(set.completed),
  };
}

function normalizeExercise(
  exercise: RawWorkoutExercise,
): WorkoutHistoryExercise {
  return {
    id: exercise.id,
    name: exercise.exercise_name,
    muscleGroup: exercise.muscle_group,
    order: exercise.exercise_order ?? 0,
    sets: (exercise.sets ?? [])
      .map(normalizeSet)
      .filter((set) => set.completed)
      .sort((a, b) => a.setNumber - b.setNumber),
  };
}

export function normalizeWorkoutHistoryItem(
  workout: RawWorkoutHistoryItem,
): WorkoutHistoryItem {
  return {
    id: workout.id,
    workoutType: workout.workout_type,
    startedAt:
      workout.started_at ?? workout.finished_at ?? new Date(0).toISOString(),
    finishedAt: workout.finished_at,
    durationMinutes: workout.duration ?? 0,
    notes: workout.notes,
    exercises: (workout.exercises ?? [])
      .map(normalizeExercise)
      .filter((exercise) => exercise.sets.length > 0)
      .sort((a, b) => a.order - b.order),
  };
}

export function getExerciseVolume(exercise: WorkoutHistoryExercise) {
  return exercise.sets.reduce((total, set) => total + set.weight * set.reps, 0);
}

export function getWorkoutStats(workout: WorkoutHistoryItem) {
  const completedSets = workout.exercises.flatMap((exercise) => exercise.sets);

  return {
    exercises: workout.exercises.length,
    sets: completedSets.length,
    volume: completedSets.reduce(
      (total, set) => total + set.weight * set.reps,
      0,
    ),
    maxWeight: completedSets.reduce(
      (maximum, set) => Math.max(maximum, set.weight),
      0,
    ),
  };
}

export function compareWorkoutExercises(
  current: WorkoutHistoryItem,
  previous: WorkoutHistoryItem | null,
): WorkoutExerciseComparison[] {
  const previousByName = new Map(
    (previous?.exercises ?? []).map((exercise) => [exercise.name, exercise]),
  );

  return current.exercises.map((exercise) => {
    const previousExercise = previousByName.get(exercise.name) ?? null;
    const currentVolume = getExerciseVolume(exercise);
    const previousVolume = previousExercise
      ? getExerciseVolume(previousExercise)
      : null;
    const currentMaxWeight = exercise.sets.reduce(
      (maximum, set) => Math.max(maximum, set.weight),
      0,
    );
    const previousMaxWeight = previousExercise
      ? previousExercise.sets.reduce(
          (maximum, set) => Math.max(maximum, set.weight),
          0,
        )
      : null;

    return {
      name: exercise.name,
      currentVolume,
      previousVolume,
      volumeDifference:
        previousVolume === null ? null : currentVolume - previousVolume,
      currentMaxWeight,
      previousMaxWeight,
      maxWeightDifference:
        previousMaxWeight === null
          ? null
          : currentMaxWeight - previousMaxWeight,
      currentSets: exercise.sets.length,
      previousSets: previousExercise?.sets.length ?? null,
    };
  });
}

export function getHistorySummary(workouts: WorkoutHistoryItem[]) {
  const totalVolume = workouts.reduce(
    (total, workout) => total + getWorkoutStats(workout).volume,
    0,
  );
  const totalMinutes = workouts.reduce(
    (total, workout) => total + workout.durationMinutes,
    0,
  );

  return {
    sessions: workouts.length,
    totalVolume,
    averageDuration:
      workouts.length === 0 ? 0 : Math.round(totalMinutes / workouts.length),
    totalSets: workouts.reduce(
      (total, workout) => total + getWorkoutStats(workout).sets,
      0,
    ),
  };
}
