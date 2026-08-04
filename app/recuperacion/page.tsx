import {
  getLatestRecoveryAction,
  RecoveryCheckinForm,
} from "@/features/recovery";

export default async function RecoveryPage() {
  const latest = await getLatestRecoveryAction();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Fit33 Recovery
        </p>
        <h1 className="mt-2 text-3xl font-bold">Cómo llegas hoy</h1>
        <p className="mt-2 mb-8 text-slate-400">
          Registra sueño, energía, estrés y molestias para adaptar la semana.
        </p>
        <RecoveryCheckinForm initial={latest} />
      </div>
    </main>
  );
}
