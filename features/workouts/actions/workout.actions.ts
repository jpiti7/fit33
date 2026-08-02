"use server";

import { revalidatePath } from "next/cache";

import { saveWorkout } from "@/features/workouts/services/workout.service";
import {
  workoutFormSchema,
  type WorkoutFormValues,
} from "@/features/workouts/validations/workout.schema";
import { createClient } from "@/lib/supabase/server";

export type FinishWorkoutResult =
  | {
      success: true;
      workoutId: string;
      totalVolume: number;
      completedSets: number;
      completedExercises: number;
      durationMinutes: number;
    }
  | {
      success: false;
      message: string;
    };

export async function finishWorkoutAction(
  values: WorkoutFormValues,
  startedAt: string,
): Promise<FinishWorkoutResult> {
  try {
    const validatedValues = workoutFormSchema.parse(values);
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");
    }

    const result = await saveWorkout(supabase, {
      userId: user.id,
      startedAt,
      values: validatedValues,
    });

    revalidatePath("/");
    revalidatePath("/entrenos");
    revalidatePath("/entrenos/historial");
    revalidatePath("/progreso");

    return {
      success: true,
      ...result,
    };
  } catch (error: unknown) {
    console.error("Error al finalizar entrenamiento:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo guardar el entrenamiento.",
    };
  }
}
