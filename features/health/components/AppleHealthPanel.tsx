"use client";

import { useState } from "react";
import {
  Activity,
  Apple,
  HeartPulse,
  LoaderCircle,
  Moon,
  Scale,
} from "lucide-react";

import { saveHealthSnapshotAction } from "@/features/health/actions/health.actions";
import { AppleHealth } from "@/features/health/services/apple-health.bridge";
import type { StoredHealthSnapshot } from "@/features/health/types";

export function AppleHealthPanel({
  initial,
}: {
  initial: StoredHealthSnapshot | null;
}) {
  const [snapshot, setSnapshot] = useState(initial);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function connectAndSync() {
    setLoading(true);
    setMessage("");
    try {
      const availability = await AppleHealth.isAvailable();
      if (!availability.available) {
        setMessage(
          "Apple Health solo está disponible dentro de la app iOS de Fit33.",
        );
        return;
      }
      await AppleHealth.requestAuthorization();
      const healthSnapshot = await AppleHealth.readDailySummary();
      const result = await saveHealthSnapshotAction(healthSnapshot);
      if (!result.success) throw new Error(result.message);
      setSnapshot(result.snapshot);
      setMessage("Datos de Apple Health sincronizados correctamente.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo conectar Apple Health.",
      );
    } finally {
      setLoading(false);
    }
  }

  const metrics = [
    {
      label: "Pasos",
      value: snapshot?.steps.toLocaleString("es-ES") ?? "—",
      icon: Activity,
    },
    {
      label: "Calorías activas",
      value: snapshot ? `${Math.round(snapshot.activeEnergyKcal)} kcal` : "—",
      icon: Apple,
    },
    {
      label: "Pulso en reposo",
      value: snapshot?.restingHeartRate
        ? `${Math.round(snapshot.restingHeartRate)} ppm`
        : "—",
      icon: HeartPulse,
    },
    {
      label: "Sueño",
      value: snapshot
        ? `${Math.floor(snapshot.sleepMinutes / 60)} h ${snapshot.sleepMinutes % 60} min`
        : "—",
      icon: Moon,
    },
    {
      label: "Peso",
      value: snapshot?.bodyMassKg
        ? `${snapshot.bodyMassKg.toFixed(1)} kg`
        : "—",
      icon: Scale,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Apple Health</h2>
            <p className="mt-1 text-sm text-slate-400">
              Importa pasos, sueño, pulso, peso, calorías activas y
              entrenamientos desde Salud.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={connectAndSync}
          disabled={loading}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 font-bold text-slate-950 disabled:opacity-60"
        >
          {loading && <LoaderCircle className="h-5 w-5 animate-spin" />}
          {loading
            ? "Sincronizando…"
            : snapshot
              ? "Sincronizar ahora"
              : "Conectar Apple Health"}
        </button>
        {message && (
          <p className="mt-4 rounded-2xl bg-slate-950 p-3 text-sm text-slate-300">
            {message}
          </p>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
          >
            <Icon className="h-5 w-5 text-emerald-400" />
            <p className="mt-3 text-sm text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value}</p>
          </article>
        ))}
      </section>

      {snapshot && (
        <p className="text-center text-xs text-slate-500">
          Última sincronización:{" "}
          {new Date(snapshot.syncedAt).toLocaleString("es-ES")}
        </p>
      )}
    </div>
  );
}
