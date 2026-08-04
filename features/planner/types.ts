export type PlannedWorkout = {
  day: string;
  date: string;
  type: string;
  slug: string;
  focus: string;
  reason: string;
};

export type WeeklyPlan = {
  weekStart: string;
  sessions: PlannedWorkout[];
  recoveryDays: string[];
};
