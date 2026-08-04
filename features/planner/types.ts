export type PlannedWorkout = {
  day: string;
  date: string;
  type: string;
  slug: string;
  focus: string;
  reason: string;
  intensity: "normal" | "reduced";
};

export type WeeklyPlan = {
  weekStart: string;
  sessions: PlannedWorkout[];
  recoveryDays: string[];
  recoveryScore: number;
  adaptation: string;
};
