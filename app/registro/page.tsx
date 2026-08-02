import Link from "next/link";
import { signup } from "@/app/login/actions";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
            Fit33
          </p>

          <h1 className="mt-3 text-3xl font-bold">Crear cuenta</h1>

          <p className="mt-2 text-sm text-slate-400">
            Crea tu perfil para guardar tus datos de forma segura.
          </p>
        </div>

        <form
          action={signup}
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
              autoComplete="new-password"
              minLength={6}
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            />
          </label>

          {params.error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {params.error}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-emerald-400">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
