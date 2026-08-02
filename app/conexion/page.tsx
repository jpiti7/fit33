"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ConnectionPage() {
  const [status, setStatus] = useState(
    "Comprobando conexión...",
  );

  useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = createClient();

        const { error } = await supabase
          .from("weight_logs")
          .select("id")
          .limit(1);

        if (error) {
          const message = error.message.toLowerCase();

          if (
            message.includes("could not find") ||
            message.includes("does not exist")
          ) {
            setStatus(
              "Supabase está conectado. Falta crear la tabla weight_logs.",
            );
            return;
          }

          setStatus(
            `Supabase respondió: ${error.message}`,
          );
          return;
        }

        setStatus("Supabase conectado correctamente.");
      } catch (error) {
        setStatus(
          error instanceof Error
            ? error.message
            : "No se pudo comprobar la conexión.",
        );
      }
    }

    checkConnection();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Fit33
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Conexión con Supabase
        </h1>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-300">{status}</p>
        </div>
      </div>
    </main>
  );
}