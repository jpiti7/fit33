import {
  AchievementOverview,
  getAchievementSummaryAction,
} from "@/features/achievements";

export default async function AchievementsPage() {
  const summary = await getAchievementSummaryAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33 v2
          </p>
          <h1 className="mt-2 text-3xl font-black">Logros y nivel</h1>
          <p className="mt-2 text-slate-400">
            Tu constancia también merece ser visible.
          </p>
        </header>
        <div className="mt-8">
          <AchievementOverview summary={summary} />
        </div>
      </div>
    </main>
  );
}
