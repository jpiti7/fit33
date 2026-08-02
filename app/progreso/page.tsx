const measurements = [
  { label: "Peso inicial", value: "82,0 kg" },
  { label: "Peso actual", value: "82,0 kg" },
  { label: "Objetivo", value: "75,0 kg" },
  { label: "Grasa corporal", value: "35 %" },
];

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33
          </p>

          <h1 className="mt-2 text-3xl font-bold">Progreso</h1>

          <p className="mt-2 text-slate-400">
            Evolución de tu peso, cintura y composición corporal.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {measurements.map((measurement) => (
            <article
              key={measurement.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">{measurement.label}</p>
              <p className="mt-2 text-2xl font-bold">{measurement.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Evolución del peso</h2>

          <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950">
            <p className="text-center text-sm text-slate-500">
              La gráfica aparecerá cuando registres tus primeros pesos.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
