const profileData = [
  { label: "Nombre", value: "Jesús" },
  { label: "Edad", value: "28 años" },
  { label: "Altura", value: "170 cm" },
  { label: "Peso inicial", value: "82 kg" },
  { label: "Objetivo", value: "75 kg" },
  { label: "Entrenamientos", value: "4 días por semana" },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33
          </p>

          <h1 className="mt-2 text-3xl font-bold">Perfil</h1>

          <p className="mt-2 text-slate-400">
            Información personal y configuración del plan.
          </p>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {profileData.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-4 px-5 py-4 ${
                index !== profileData.length - 1
                  ? "border-b border-slate-800"
                  : ""
              }`}
            >
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className="text-right font-semibold">{item.value}</span>
            </div>
          ))}
        </section>

        <button
          type="button"
          className="mt-6 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-emerald-400"
        >
          Editar perfil
        </button>
      </div>
    </main>
  );
}