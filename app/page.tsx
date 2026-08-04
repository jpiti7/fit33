import { getTodayDataAction, TodayOverview } from "@/features/today";

export default async function Home() {
  const data = await getTodayDataAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <TodayOverview data={data} />
      </div>
    </main>
  );
}
