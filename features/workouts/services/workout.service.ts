import type { SupabaseClient } from "@supabase/supabase-js";

import {
  insertExercise,
  insertSets,
  insertWorkout,
} from "@/features/workouts/repositories/workout.repository";
import type { WorkoutFormValues } from "@/features/workouts/validations/workout.schema";

type SaveWorkoutInput = {
  userId: string;
  startedAt: string;
  values: WorkoutFormValues;
};

export type WorkoutSaveResult = {
  workoutId: string;
  totalVolume: number;
  completedSets: number;
  durationMinutes: number;
};

export async function saveWorkout(
  supabase: SupabaseClient,
  input: SaveWorkoutInput,
): Promise<WorkoutSaveResult> {
  const finishedAt = new Date();

  const startedTime = new Date(input.startedAt).getTime();
  const finishedTime = finishedAt.getTime();

  const durationMinutes = Math.max(
    1,
    Math.round((finishedTime - startedTime) / 60_000),
  );

  const completedSets = input.values.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0,
  );

  if (completedSets === 0) {
    throw new Error(
      "Marca al menos una serie como completada antes de finalizar.",
    );
  }

  const totalVolume = input.values.exercises.reduce(
    (exerciseTotal, exercise) =>
      exerciseTotal +
      exercise.sets.reduce((setTotal, set) => {
        if (!set.completed) {
          return setTotal;
        }

        return setTotal + set.weight * set.reps;
      }, 0),
    0,
  );

  const workout = await insertWorkout(supabase, {
    userId: input.userId,
    workoutType: input.values.workoutType,
    startedAt: input.startedAt,
    finishedAt: finishedAt.toISOString(),
    duration: durationMinutes,
    notes: input.values.notes?.trim() || null,
  });

  for (const exercise of input.values.exercises) {
    const completedExerciseSets = exercise.sets.filter((set) => set.completed);

    if (completedExerciseSets.length === 0) {
      continue;
    }

    const savedExercise = await insertExercise(supabase, {
      workoutId: workout.id,
      exerciseName: exercise.name,
      exerciseOrder: exercise.order,
      muscleGroup: exercise.muscleGroup,
    });

    await insertSets(
      supabase,
      completedExerciseSets.map((set, setIndex) => ({
        exerciseId: savedExercise.id,
        setNumber: setIndex + 1,
        weight: set.weight,
        reps: set.reps,
        rir: set.rir,
        completed: true,
      })),
    );
  }

  return {
    workoutId: workout.id,
    totalVolume,
    completedSets,
    durationMinutes,
  };
}
