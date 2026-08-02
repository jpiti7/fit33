const macros = [
  { label: "Calorías", current: 0, target: 2300, unit: "kcal" },
  { label: "Proteínas", current: 0, target: 180, unit: "g" },
  { label: "Carbohidratos", current: 0, target: 220, unit: "g" },
  { label: "Grasas", current: 0, target: 70, unit: "g" },
];

export default function NutritionPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33
          </p>

          <h1 className="mt-2 text-3xl font-bold">Nutrición</h1>

          <p className="mt-2 text-slate-400">
            Control diario de calorías y macronutrientes.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {macros.map((macro) => (
            <article
              key={macro.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-slate-400">{macro.label}</p>

              <p className="mt-2 text-3xl font-bold">
                {macro.current}
                <span className="ml-2 text-base font-normal text-slate-500">
                  / {macro.target} {macro.unit}
                </span>
              </p>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-0 rounded-full bg-emerald-400" />
              </div>
            </article>
          ))}
        </section>

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-emerald-400 px-5 py-4 font-semibold text-slate-950 sm:w-auto"
        >
          Registrar comida
        </button>
      </div>
    </main>
  );
}