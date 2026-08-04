import type { TrainingAnalytics } from "@/features/analytics";
import type { WorkoutHistoryItem } from "@/features/workouts/history";
import type { WeightLog } from "@/types/weight-log";

export type CoachTone = "positive" | "warning" | "neutral";
export type CoachPriority = "high" | "medium" | "low";

export type CoachRecommendation = {
  id: string;
  category:
    | "adherence"
    | "frequency"
    | "volume"
    | "progression"
    | "weight"
    | "recovery";
  title: string;
  message: string;
  tone: CoachTone;
  priority: CoachPriority;
};

export type CoachContext = {
  analytics: TrainingAnalytics;
  workouts: WorkoutHistoryItem[];
  weightLogs: WeightLog[];
  now: Date;
};

export type CoachReport = {
  generatedAt: string;
  score: number;
  headline: string;
  weeklyTarget: number;
  completedWorkouts: number;
  adherencePercent: number;
  nextWorkout: {
    type: string;
    slug: string;
    reason: string;
  };
  weeklyBrief: {
    volume: number;
    durationMinutes: number;
    completedSets: number;
    strongestExercise: string | null;
  };
  recommendations: CoachRecommendation[];
};
