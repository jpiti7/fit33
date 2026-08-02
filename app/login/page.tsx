import Link from "next/link";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
            Fit33
          </p>

          <h1 className="mt-3 text-3xl font-bold">Iniciar sesión</h1>

          <p className="mt-2 text-sm text-slate-400">
            Accede a tu entrenamiento y progreso.
          </p>
        </div>

        <form
          action={login}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Correo electrónico
            </span>

            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-slate-300">
              Contraseña
            </span>

            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          {params.error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {params.error}
            </div>
          )}

          {params.message && (
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              {params.message}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-emerald-400">
            Crear cuenta
          </Link>
        </p>
      </div>
    </main>
  );
}
