import Link from "next/link";
import { Camera, ChevronRight, Trophy } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: logs } = user
    ? await supabase
        .from("weight_logs")
        .select("weight, waist, body_fat, created_at")
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: [] };

  const normalized = (logs ?? []).map((log) => ({
    weight: Number(log.weight),
    waist: log.waist === null ? null : Number(log.waist),
    bodyFat: log.body_fat === null ? null : Number(log.body_fat),
    createdAt: log.created_at,
  }));
  const latest = normalized[0];
  const oldest = normalized.at(-1);
  const change = latest && oldest ? latest.weight - oldest.weight : null;

  const measurements = [
    {
      label: "Peso inicial",
      value: oldest ? `${oldest.weight.toLocaleString("es-ES")} kg` : "—",
    },
    {
      label: "Peso actual",
      value: latest ? `${latest.weight.toLocaleString("es-ES")} kg` : "—",
    },
    {
      label: "Cambio registrado",
      value:
        change === null
          ? "—"
          : `${change > 0 ? "+" : ""}${change.toLocaleString("es-ES")} kg`,
    },
    {
      label: "Grasa corporal",
      value:
        latest?.bodyFat === null || latest?.bodyFat === undefined
          ? "—"
          : `${latest.bodyFat.toLocaleString("es-ES")} %`,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Fit33 v2
          </p>
          <h1 className="mt-2 text-3xl font-black">Progreso</h1>
          <p className="mt-2 text-slate-400">
            Peso, composición, fotos y logros en una sola línea temporal.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {measurements.map((measurement) => (
            <article
              key={measurement.label}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">{measurement.label}</p>
              <p className="mt-2 text-2xl font-black">{measurement.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/progreso/fotos"
            className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-400/40"
          >
            <Camera className="h-7 w-7 text-emerald-400" />
            <h2 className="mt-5 text-xl font-bold">Fotos de progreso</h2>
            <p className="mt-2 text-sm text-slate-400">
              Crea una línea temporal privada y compara tu evolución visual.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-300">
              Abrir galería <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/logros"
            className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-400/40"
          >
            <Trophy className="h-7 w-7 text-emerald-400" />
            <h2 className="mt-5 text-xl font-bold">Logros y nivel</h2>
            <p className="mt-2 text-sm text-slate-400">
              Convierte la constancia, la fuerza y el progreso en objetivos
              visibles.
            </p>
            <span className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-300">
              Ver logros <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Últimos registros</h2>
          {normalized.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              Registra tu primer peso para comenzar la línea temporal.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {normalized.slice(0, 8).map((log) => (
                <div
                  key={log.createdAt}
                  className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">
                      {log.weight.toLocaleString("es-ES")} kg
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Intl.DateTimeFormat("es-ES", {
                        dateStyle: "medium",
                      }).format(new Date(log.createdAt))}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    {log.waist !== null && (
                      <p>Cintura {log.waist.toLocaleString("es-ES")} cm</p>
                    )}
                    {log.bodyFat !== null && (
                      <p>Grasa {log.bodyFat.toLocaleString("es-ES")} %</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
