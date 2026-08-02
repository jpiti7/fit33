export type WorkoutType = "Push" | "Pierna A" | "Pull" | "Pierna B + hombro";

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rir: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: string;
  order: number;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  type: WorkoutType;
  startedAt: string;
  finishedAt?: string;
  exercises: WorkoutExercise[];
}
