import {
  ChallengeOverview,
  getChallengeSummaryAction,
} from "@/features/challenges";

export default async function ChallengesPage() {
  const data = await getChallengeSummaryAction();
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <ChallengeOverview data={data} />
      </div>
    </main>
  );
}
