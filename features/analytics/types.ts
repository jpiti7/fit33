export type AnalyticsPeriod = {
  start: string;
  end: string;
  sessions: number;
  completedSets: number;
  durationMinutes: number;
  volume: number;
};

export type AnalyticsComparison = {
  current: AnalyticsPeriod;
  previous: AnalyticsPeriod;
  sessionChangePercent: number | null;
  volumeChangePercent: number | null;
  durationChangePercent: number | null;
};

export type MuscleGroupAnalytics = {
  muscleGroup: string;
  sessions: number;
  completedSets: number;
  volume: number;
};

export type ExercisePersonalRecord = {
  exerciseName: string;
  muscleGroup: string | null;
  maxWeight: number;
  maxReps: number;
  maxSetVolume: number;
  estimatedOneRepMax: number;
  achievedAt: string;
};

export type TrainingAnalytics = {
  generatedAt: string;
  totalSessions: number;
  totalCompletedSets: number;
  totalVolume: number;
  averageDurationMinutes: number;
  week: AnalyticsComparison;
  month: AnalyticsPeriod;
  muscleGroups: MuscleGroupAnalytics[];
  personalRecords: ExercisePersonalRecord[];
};
