export type WeightLog = {
  id: string;
  user_id: string;
  created_at: string;
  weight: number;
  waist: number | null;
  body_fat: number | null;
  notes: string | null;
};
