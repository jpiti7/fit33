import { z } from "zod";

const workoutSetSchema = z.object({
  weight: z
    .number({
      error: "Introduce el peso.",
    })
    .min(0, "El peso no puede ser negativo."),

  reps: z
    .number({
      error: "Introduce las repeticiones.",
    })
    .int("Las repeticiones deben ser un número entero.")
    .min(1, "Haz al menos una repetición."),

  rir: z
    .number({
      error: "Introduce el RIR.",
    })
    .int("El RIR debe ser un número entero.")
    .min(0, "El RIR mínimo es 0.")
    .max(5, "El RIR máximo es 5."),

  completed: z.boolean(),
});

const workoutExerciseSchema = z.object({
  name: z.string().min(1),
  muscleGroup: z.string().min(1),
  order: z.number().int().min(0),
  targetReps: z.string(),
  sets: z
    .array(workoutSetSchema)
    .min(1, "Cada ejercicio necesita al menos una serie."),
});

export const workoutFormSchema = z.object({
  workoutType: z.string().min(1),
  notes: z.string().max(500).optional(),
  exercises: z
    .array(workoutExerciseSchema)
    .min(1, "El entrenamiento necesita ejercicios."),
});

export type WorkoutFormValues = z.infer<typeof workoutFormSchema>;
