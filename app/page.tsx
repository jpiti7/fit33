import Link from "next/link";
import { DashboardData } from "@/components/dashboard/dashboard-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Fit33
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Buenos días, Jesús
            </h1>

            <p className="mt-2 text-slate-400">
              Continúa avanzando hacia tu mejor versión.
            </p>
          </div>

          <Link
            href="/registrar-peso"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Registrar peso
          </Link>
        </header>

        <DashboardData />
      </div>
    </main>
  );
}