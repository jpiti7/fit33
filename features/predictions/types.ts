export type WeightPrediction = {
  currentWeight: number | null;
  targetWeight: number | null;
  weeklyChangeKg: number | null;
  estimatedWeeks: number | null;
  estimatedDate: string | null;
  confidence: "low" | "medium" | "high";
  message: string;
};

export type StrengthPrediction = {
  exercise: string;
  currentBestWeight: number;
  predictedWeight: number;
  horizonWeeks: number;
  message: string;
};

export type PredictionSummary = {
  weight: WeightPrediction;
  strength: StrengthPrediction[];
};
