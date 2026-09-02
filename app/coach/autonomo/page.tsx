import {
  AutonomousOverview,
  getAutonomousSummaryAction,
} from "@/features/autonomous";

export default async function AutonomousCoachPage() {
  const data = await getAutonomousSummaryAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 pb-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <AutonomousOverview data={data} />
      </div>
    </main>
  );
}
