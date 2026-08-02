export type WorkoutType = "Push" | "Pierna A" | "Pull" | "Pierna B + hombro";

export type WorkoutSetInput = {
  setNumber: number;
  weight: string;
  reps: string;
  rir: string;
  completed: boolean;
};

export type WorkoutExerciseInput = {
  name: string;
  muscleGroup: string;
  order: number;
  sets: WorkoutSetInput[];
};

export type WorkoutTemplate = {
  type: WorkoutType;
  day: string;
  description: string;
  exercises: {
    name: string;
    muscleGroup: string;
    targetSets: number;
    targetReps: string;
  }[];
};
