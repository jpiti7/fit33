export type ChallengeStatus = "active" | "completed";

export type WeeklyChallenge = {
  id: string;
  title: string;
  description: string;
  metric: string;
  progress: number;
  target: number;
  unit: string;
  status: ChallengeStatus;
};

export type ChallengeSummary = {
  weekStart: string;
  completed: number;
  total: number;
  challenges: WeeklyChallenge[];
};
