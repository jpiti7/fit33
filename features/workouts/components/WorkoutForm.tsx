"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, Dumbbell, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseCard } from "@/features/workouts/components/ExerciseCard";
import {
  workoutFormSchema,
  type WorkoutFormValues,
} from "@/features/workouts/validations/workout.schema";
import type { WorkoutTemplate } from "@/types/workout";

type WorkoutFormProps = {
  template: WorkoutTemplate;
};

function createDefaultValues(template: WorkoutTemplate): WorkoutFormValues {
  return {
    workoutType: template.type,
    notes: "",
    exercises: template.exercises.map((exercise, exerciseIndex) => ({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      order: exerciseIndex,
      targetReps: exercise.targetReps,
      sets: Array.from({ length: exercise.targetSets }, () => ({
        weight: 0,
        reps: 1,
        rir: 2,
        completed: false,
      })),
    })),
  };
}

export function WorkoutForm({ template }: WorkoutFormProps) {
  const defaultValues = useMemo(
    () => createDefaultValues(template),
    [template],
  );

  const [message, setMessage] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const exercises = watch("exercises");

  const totalSets = exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  const completedSets = exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0,
  );

  const totalVolume = exercises.reduce(
    (exerciseTotal, exercise) =>
      exerciseTotal +
      exercise.sets.reduce(
        (setTotal, set) =>
          setTotal + (Number(set.weight) || 0) * (Number(set.reps) || 0),
        0,
      ),
    0,
  );

  async function onSubmit(values: WorkoutFormValues) {
    setMessage("");

    console.log("Entrenamiento preparado:", values);

    setMessage(
      "Formulario validado correctamente. En el siguiente paso lo guardaremos en Supabase.",
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-400">
                {template.day}
              </p>

              <CardTitle className="mt-1 text-3xl">{template.type}</CardTitle>

              <p className="mt-2 text-sm text-slate-400">
                {template.description}
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm text-slate-300">
              <Clock3 className="h-4 w-4 text-emerald-400" />
              Sesión activa
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Ejercicios</p>

              <p className="mt-1 text-xl font-bold">{exercises.length}</p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Series completadas</p>

              <p className="mt-1 text-xl font-bold">
                {completedSets} / {totalSets}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">Volumen provisional</p>

              <p className="mt-1 text-xl font-bold">
                {totalVolume.toLocaleString("es-ES")} kg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {template.exercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={`${exercise.name}-${exerciseIndex}`}
            exerciseIndex={exerciseIndex}
            control={control}
            register={register}
            errors={errors}
            name={exercise.name}
            muscleGroup={exercise.muscleGroup}
            targetReps={exercise.targetReps}
          />
        ))}
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardContent className="pt-6">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Observaciones de la sesión
            </span>

            <textarea
              {...register("notes")}
              rows={4}
              placeholder="Sensaciones, molestias, cambios de ejercicios..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
            />
          </label>

          {errors.notes?.message && (
            <p className="mt-2 text-sm text-red-400">{errors.notes.message}</p>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
          >
            <Save className="mr-2 h-4 w-4" />

            {isSubmitting ? "Procesando..." : "Finalizar entrenamiento"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
