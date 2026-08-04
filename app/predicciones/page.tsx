import {
  getPredictionSummaryAction,
  PredictionOverview,
} from "@/features/predictions";

export default async function PredictionsPage() {
  const data = await getPredictionSummaryAction();
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <PredictionOverview data={data} />
      </div>
    </main>
  );
}
