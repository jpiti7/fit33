export type HealthPermissionState =
  "unknown" | "authorized" | "unavailable" | "error";

export type AppleHealthSnapshot = {
  recordedOn: string;
  steps: number;
  activeEnergyKcal: number;
  restingHeartRate: number | null;
  sleepMinutes: number;
  bodyMassKg: number | null;
  workoutMinutes: number;
  workoutCount: number;
  source: "apple-health";
};

export type StoredHealthSnapshot = AppleHealthSnapshot & {
  id: string;
  userId: string;
  syncedAt: string;
};

export type HealthBridge = {
  isAvailable(): Promise<{ available: boolean }>;
  requestAuthorization(): Promise<{ authorized: boolean }>;
  readDailySummary(options?: { date?: string }): Promise<AppleHealthSnapshot>;
};
