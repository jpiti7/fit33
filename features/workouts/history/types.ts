export type WorkoutHistorySet = {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rir: number | null;
  completed: boolean;
};

export type WorkoutHistoryExercise = {
  id: string;
  name: string;
  muscleGroup: string | null;
  order: number;
  sets: WorkoutHistorySet[];
};

export type WorkoutHistoryItem = {
  id: string;
  workoutType: string;
  startedAt: string;
  finishedAt: string | null;
  durationMinutes: number;
  notes: string | null;
  exercises: WorkoutHistoryExercise[];
};

export type WorkoutExerciseComparison = {
  name: string;
  currentVolume: number;
  previousVolume: number | null;
  volumeDifference: number | null;
  currentMaxWeight: number;
  previousMaxWeight: number | null;
  maxWeightDifference: number | null;
  currentSets: number;
  previousSets: number | null;
};
