import Link from "next/link";
import { WeightForm } from "@/components/forms/weight-form";

export default function RegisterWeightPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Volver al inicio
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Registrar progreso
          </h1>

          <p className="mt-2 text-slate-400">
            Guarda tu peso, cintura y porcentaje de grasa corporal.
          </p>
        </header>

        <section className="mt-8">
          <WeightForm />
        </section>
      </div>
    </main>
  );
}