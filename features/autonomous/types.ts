import type { CoachReport } from "@/features/coach/types";
import type { NutritionDay } from "@/features/nutrition/types";
import type { RecoveryState } from "@/features/recovery/types";

export type AutonomousActionKind =
  | "reorganize_training"
  | "reduce_training"
  | "nutrition_review"
  | "recovery_checkin";

export type AutonomousProposal = {
  id: string;
  kind: AutonomousActionKind;
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  cta: string;
};

export type AutonomousSummary = {
  score: number;
  headline: string;
  proposals: AutonomousProposal[];
  context: {
    adherencePercent: number;
    recoveryScore: number;
    proteinPercent: number;
    completedWorkouts: number;
    weeklyTarget: number;
  };
};

export type AutonomousContext = {
  coach: CoachReport;
  recovery: RecoveryState;
  nutrition: NutritionDay;
};
