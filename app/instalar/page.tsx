import Link from "next/link";

import { InstallApp } from "@/components/pwa/install-app";

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
        >
          ← Volver al inicio
        </Link>

        <header className="mt-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.4rem] bg-emerald-400 text-2xl font-black tracking-tight text-slate-950 shadow-lg shadow-emerald-400/20">
            F33
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Aplicación móvil
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Lleva Fit33 en tu iPhone
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-slate-400">
            Instálala desde Safari para acceder a tus entrenamientos, nutrición,
            progreso y Coach Fit33 desde un icono en la pantalla de inicio.
          </p>
        </header>

        <div className="mt-8">
          <InstallApp />
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            [
              "Pantalla completa",
              "Se abre sin la barra habitual del navegador.",
            ],
            [
              "Acceso rápido",
              "Un icono F33 directamente en tu pantalla de inicio.",
            ],
            [
              "Misma cuenta",
              "Tus datos siguen sincronizados mediante Supabase.",
            ],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <h2 className="font-bold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
