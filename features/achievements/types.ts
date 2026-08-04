export type AchievementCategory =
  "training" | "consistency" | "strength" | "progress";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  target: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
};

export type AchievementSummary = {
  unlocked: number;
  total: number;
  level: number;
  points: number;
  achievements: Achievement[];
};
