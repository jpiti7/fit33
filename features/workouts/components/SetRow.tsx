"use client";

import { Trash2 } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WorkoutFormValues } from "@/features/workouts/validations/workout.schema";

type SetRowProps = {
  exerciseIndex: number;
  setIndex: number;
  control: Control<WorkoutFormValues>;
  register: UseFormRegister<WorkoutFormValues>;
  errors: FieldErrors<WorkoutFormValues>;
  canDelete: boolean;
  onDelete: () => void;
  onCompleted?: () => void;
};

export function SetRow({
  exerciseIndex,
  setIndex,
  control,
  register,
  errors,
  canDelete,
  onDelete,
  onCompleted,
}: SetRowProps) {
  const setErrors = errors.exercises?.[exerciseIndex]?.sets?.[setIndex];

  return (
    <div className="grid grid-cols-[40px_1fr_1fr_1fr_42px_40px] items-start gap-2">
      <div className="flex h-10 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-slate-400">
        {setIndex + 1}
      </div>

      <div>
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.5"
          placeholder="kg"
          {...register(`exercises.${exerciseIndex}.sets.${setIndex}.weight`, {
            valueAsNumber: true,
          })}
          className="border-slate-700 bg-slate-950 text-white"
        />
        {setErrors?.weight?.message && (
          <p className="mt-1 text-xs text-red-400">
            {setErrors.weight.message}
          </p>
        )}
      </div>

      <div>
        <Input
          type="number"
          inputMode="numeric"
          min="1"
          placeholder="Reps"
          {...register(`exercises.${exerciseIndex}.sets.${setIndex}.reps`, {
            valueAsNumber: true,
          })}
          className="border-slate-700 bg-slate-950 text-white"
        />
        {setErrors?.reps?.message && (
          <p className="mt-1 text-xs text-red-400">{setErrors.reps.message}</p>
        )}
      </div>

      <div>
        <Input
          type="number"
          inputMode="numeric"
          min="0"
          max="5"
          placeholder="RIR"
          {...register(`exercises.${exerciseIndex}.sets.${setIndex}.rir`, {
            valueAsNumber: true,
          })}
          className="border-slate-700 bg-slate-950 text-white"
        />
        {setErrors?.rir?.message && (
          <p className="mt-1 text-xs text-red-400">{setErrors.rir.message}</p>
        )}
      </div>

      <Controller
        control={control}
        name={`exercises.${exerciseIndex}.sets.${setIndex}.completed`}
        render={({ field }) => (
          <button
            type="button"
            aria-label={`Marcar serie ${setIndex + 1} como completada`}
            aria-pressed={field.value}
            onClick={() => {
              const nextValue = !field.value;
              field.onChange(nextValue);
              if (nextValue) {
                onCompleted?.();
              }
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold transition ${
              field.value
                ? "border-emerald-400 bg-emerald-400 text-slate-950"
                : "border-slate-700 bg-slate-950 text-slate-500 hover:border-emerald-400 hover:text-emerald-400"
            }`}
          >
            ✓
          </button>
        )}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!canDelete}
        onClick={onDelete}
        aria-label={`Eliminar serie ${setIndex + 1}`}
        className="text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
