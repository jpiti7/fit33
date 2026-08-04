import Link from "next/link";
import { CloudOff, Dumbbell } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10">
          <CloudOff className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Estás sin conexión</h1>
        <p className="mt-3 text-slate-400">
          Las rutinas que hayas abierto antes siguen disponibles. Los
          entrenamientos terminados se guardarán en el iPhone y se sincronizarán
          al recuperar Internet.
        </p>
        <Link
          href="/entrenos"
          className="mt-6 inline-flex items-center rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950"
        >
          <Dumbbell className="mr-2 h-4 w-4" />
          Ir a entrenamientos
        </Link>
      </div>
    </main>
  );
}
