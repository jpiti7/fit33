import type { SupabaseClient } from "@supabase/supabase-js";

import {
  deleteWorkout,
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
  completedExercises: number;
  durationMinutes: number;
};

export async function saveWorkout(
  supabase: SupabaseClient,
  input: SaveWorkoutInput,
): Promise<WorkoutSaveResult> {
  const finishedAt = new Date();
  const startedTime = new Date(input.startedAt).getTime();

  if (!Number.isFinite(startedTime)) {
    throw new Error("La hora de inicio del entrenamiento no es válida.");
  }

  const durationMinutes = Math.max(
    1,
    Math.round((finishedAt.getTime() - startedTime) / 60_000),
  );

  const completedExercises = input.values.exercises.filter((exercise) =>
    exercise.sets.some((set) => set.completed),
  );

  const completedSets = completedExercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0,
  );

  if (completedSets === 0) {
    throw new Error(
      "Marca al menos una serie como completada antes de finalizar.",
    );
  }

  const totalVolume = completedExercises.reduce(
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

  try {
    for (const exercise of completedExercises) {
      const completedExerciseSets = exercise.sets.filter(
        (set) => set.completed,
      );

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
  } catch (error) {
    await deleteWorkout(supabase, workout.id);
    throw error;
  }

  return {
    workoutId: workout.id,
    totalVolume,
    completedSets,
    completedExercises: completedExercises.length,
    durationMinutes,
  };
}
