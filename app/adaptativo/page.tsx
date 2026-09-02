import {
  AdaptiveOverview,
  getAdaptiveSummaryAction,
} from "@/features/adaptive";

export default async function AdaptivePage() {
  const data = await getAdaptiveSummaryAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 pb-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AdaptiveOverview data={data} />
      </div>
    </main>
  );
}
