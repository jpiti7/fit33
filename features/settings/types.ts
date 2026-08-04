export type UserPreferences = {
  userId: string;
  displayName: string;
  targetWeight: number | null;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetWaterMl: number;
  weeklyWorkouts: number;
  preferredTrainingTime: string | null;
  allergies: string[];
  dislikedFoods: string[];
};

export type HydrationDay = {
  date: string;
  amountMl: number;
  targetMl: number;
  percentage: number;
};

export type NotificationPreferences = {
  workoutReminders: boolean;
  weightReminders: boolean;
  nutritionReminders: boolean;
  coachSummary: boolean;
  reminderTime: string;
};
