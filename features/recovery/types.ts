export type RecoveryCheckin = {
  id: string;
  userId: string;
  recordedOn: string;
  sleepHours: number;
  sleepQuality: number;
  soreness: number;
  stress: number;
  energy: number;
  restingHeartRate: number | null;
  notes: string | null;
  score: number;
};

export type RecoveryInput = Omit<RecoveryCheckin, "id" | "userId" | "score">;

export type RecoveryState = {
  score: number;
  status: "ready" | "moderate" | "low";
  label: string;
  recommendation: string;
};
