export type DashboardTrend = {
  value: number | null;
  label: string;
};

export type DashboardSummary = {
  weeklySessions: number;
  weeklyVolume: number;
  weeklyDurationMinutes: number;
  weeklyCompletedSets: number;
  averageSessionDurationMinutes: number;
  sessionTrend: DashboardTrend;
  volumeTrend: DashboardTrend;
  durationTrend: DashboardTrend;
};

export type DashboardMuscleFocus = {
  muscleGroup: string;
  sessions: number;
  completedSets: number;
  volume: number;
} | null;

export type DashboardRecord = {
  exerciseName: string;
  muscleGroup: string | null;
  maxWeight: number;
  estimatedOneRepMax: number;
  achievedAt: string;
};

export type DashboardCoachMessage = {
  id: string;
  tone: "positive" | "warning" | "neutral";
  title: string;
  message: string;
};

export type DashboardTrainingData = {
  summary: DashboardSummary;
  muscleFocus: DashboardMuscleFocus;
  recentRecords: DashboardRecord[];
  coachMessages: DashboardCoachMessage[];
};
