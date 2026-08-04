import {
  AppleHealthPanel,
  getLatestHealthSnapshotAction,
} from "@/features/health";

export default async function HealthPage() {
  const latest = await getLatestHealthSnapshotAction();
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Fit33 Health
        </p>
        <h1 className="mt-2 text-3xl font-bold">Salud y actividad</h1>
        <p className="mt-2 mb-8 text-slate-400">
          Conecta el iPhone para que recuperación y Coach utilicen tus datos
          reales.
        </p>
        <AppleHealthPanel initial={latest} />
      </div>
    </main>
  );
}
