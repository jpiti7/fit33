import type { SupabaseClient } from "@supabase/supabase-js";

type CreateWorkoutInput = {
  userId: string;
  workoutType: string;
  startedAt: string;
  finishedAt: string;
  duration: number;
  notes: string | null;
};

type CreateExerciseInput = {
  workoutId: string;
  exerciseName: string;
  exerciseOrder: number;
  muscleGroup: string;
};

type CreateSetInput = {
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rir: number;
  completed: boolean;
};

export async function insertWorkout(
  supabase: SupabaseClient,
  input: CreateWorkoutInput,
) {
  const { data, error } = await supabase
    .from("workouts")
    .insert({
      user_id: input.userId,
      workout_type: input.workoutType,
      started_at: input.startedAt,
      finished_at: input.finishedAt,
      duration: input.duration,
      completed: true,
      notes: input.notes,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`No se pudo crear el entrenamiento: ${error.message}`);
  }

  return data;
}

export async function insertExercise(
  supabase: SupabaseClient,
  input: CreateExerciseInput,
) {
  const { data, error } = await supabase
    .from("exercises")
    .insert({
      workout_id: input.workoutId,
      exercise_name: input.exerciseName,
      exercise_order: input.exerciseOrder,
      muscle_group: input.muscleGroup,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`No se pudo crear el ejercicio: ${error.message}`);
  }

  return data;
}

export async function insertSets(
  supabase: SupabaseClient,
  inputs: CreateSetInput[],
) {
  if (inputs.length === 0) {
    return;
  }

  const rows = inputs.map((input) => ({
    exercise_id: input.exerciseId,
    set_number: input.setNumber,
    weight: input.weight,
    reps: input.reps,
    rir: input.rir,
    completed: input.completed,
  }));

  const { error } = await supabase.from("sets").insert(rows);

  if (error) {
    throw new Error(`No se pudieron guardar las series: ${error.message}`);
  }
}

export async function deleteWorkout(
  supabase: SupabaseClient,
  workoutId: string,
) {
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId);

  if (error) {
    throw new Error(
      `No se pudo revertir el entrenamiento incompleto: ${error.message}`,
    );
  }
}

export async function listWorkouts(supabase: SupabaseClient, limit = 20) {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      `
        id,
        workout_type,
        started_at,
        finished_at,
        duration,
        notes,
        exercises (
          id,
          exercise_name,
          muscle_group,
          exercise_order,
          sets (
            id,
            set_number,
            weight,
            reps,
            rir,
            completed
          )
        )
      `,
    )
    .eq("completed", true)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`No se pudo cargar el historial: ${error.message}`);
  }

  return data ?? [];
}

export async function getWorkoutById(
  supabase: SupabaseClient,
  workoutId: string,
) {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      `
        id,
        workout_type,
        started_at,
        finished_at,
        duration,
        notes,
        exercises (
          id,
          exercise_name,
          muscle_group,
          exercise_order,
          sets (
            id,
            set_number,
            weight,
            reps,
            rir,
            completed
          )
        )
      `,
    )
    .eq("id", workoutId)
    .eq("completed", true)
    .single();

  if (error) {
    throw new Error(`No se pudo cargar el entrenamiento: ${error.message}`);
  }

  return data;
}

export async function getPreviousWorkoutOfType(
  supabase: SupabaseClient,
  workoutType: string,
  startedAt: string,
) {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      `
        id,
        workout_type,
        started_at,
        finished_at,
        duration,
        notes,
        exercises (
          id,
          exercise_name,
          muscle_group,
          exercise_order,
          sets (
            id,
            set_number,
            weight,
            reps,
            rir,
            completed
          )
        )
      `,
    )
    .eq("workout_type", workoutType)
    .eq("completed", true)
    .lt("started_at", startedAt)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo cargar la sesión anterior: ${error.message}`);
  }

  return data;
}
