"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WeightHistory } from "@/components/charts/weight-history";
import type { WeightLog } from "@/types/weight-log";
import { PROFILE } from "@/constants/profile";

const START_WEIGHT = PROFILE.startWeightKg;
const TARGET_WEIGHT = PROFILE.targetWeightKg;

function formatNumber(value: number, decimals = 1) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function DashboardData() {
  const [latestLog, setLatestLog] = useState<WeightLog | null>(null);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("weight_logs")
          .select(
            "id, user_id, created_at, weight, waist, body_fat, notes",
          )
          .order("created_at", { ascending: false })
          .limit(30);

        if (error) {
          throw error;
        }

        const parsedLogs = (data ?? []).map((log) => ({
          ...log,
          weight: Number(log.weight),
          waist: log.waist === null ? null : Number(log.waist),
          body_fat:
            log.body_fat === null ? null : Number(log.body_fat),
        })) as WeightLog[];

        setLogs(parsedLogs);
        setLatestLog(parsedLogs[0] ?? null);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
        ) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("No se pudieron cargar los datos.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const progress = useMemo(() => {
    if (!latestLog) {
      return 0;
    }

    const totalToLose = START_WEIGHT - TARGET_WEIGHT;
    const lostWeight = START_WEIGHT - latestLog.weight;

    return Math.min(
      100,
      Math.max(0, (lostWeight / totalToLose) * 100),
    );
  }, [latestLog]);

  const weightLost = latestLog
    ? START_WEIGHT - latestLog.weight
    : 0;

  const averageWeight = useMemo(() => {
    if (logs.length === 0) {
      return null;
    }

    const total = logs.reduce(
      (sum, log) => sum + log.weight,
      0,
    );

    return total / logs.length;
  }, [logs]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">
          Cargando tus datos...
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
        <p className="font-semibold text-red-300">
          No se pudo cargar el dashboard
        </p>

        <p className="mt-2 text-sm text-red-200">
          {errorMessage}
        </p>
      </section>
    );
  }

  if (!latestLog) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-lg font-semibold text-white">
          Todavía no hay registros
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Registra tu primer peso para empezar a ver tu evolución.
        </p>
      </section>
    );
  }

  const stats = [
    {
      label: "Peso actual",
      value: `${formatNumber(latestLog.weight)} kg`,
      detail: `Objetivo: ${TARGET_WEIGHT} kg`,
    },
    {
      label: "Cintura",
      value:
        latestLog.waist !== null
          ? `${formatNumber(latestLog.waist)} cm`
          : "Sin registrar",
      detail: "Última medición",
    },
    {
      label: "Grasa corporal",
      value:
        latestLog.body_fat !== null
          ? `${formatNumber(latestLog.body_fat)} %`
          : "Sin registrar",
      detail: "Dato orientativo",
    },
    {
      label: "Registros",
      value: String(logs.length),
      detail: "Últimos 30",
    },
  ];

  return (
    <div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
          >
            <p className="text-sm text-slate-400">
              {stat.label}
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {stat.value}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {stat.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Progreso de peso
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Objetivo de recomposición
              </h2>
            </div>

            <span className="w-fit rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-400">
              {weightLost >= 0 ? "-" : "+"}
              {formatNumber(Math.abs(weightLost))} kg
            </span>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex justify-between text-sm text-slate-300">
              <span>{START_WEIGHT} kg</span>
              <span>{TARGET_WEIGHT} kg</span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-4 text-sm text-slate-400">
              Has completado el {formatNumber(progress, 0)} % del objetivo.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">
                Último registro
              </p>

              <p className="mt-1 font-bold text-white">
                {formatDate(latestLog.created_at)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">
                Media registrada
              </p>

              <p className="mt-1 font-bold text-white">
                {averageWeight !== null
                  ? `${formatNumber(averageWeight)} kg`
                  : "Sin datos"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">
                Faltan
              </p>

              <p className="mt-1 font-bold text-white">
                {formatNumber(
                  Math.max(0, latestLog.weight - TARGET_WEIGHT),
                )}{" "}
                kg
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-semibold text-emerald-400">
            Última actualización
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {formatNumber(latestLog.weight)} kg
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Registrado el {formatDate(latestLog.created_at)}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3">
              <span className="text-sm text-slate-400">
                Cintura
              </span>

              <span className="font-semibold text-white">
                {latestLog.waist !== null
                  ? `${formatNumber(latestLog.waist)} cm`
                  : "Sin dato"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3">
              <span className="text-sm text-slate-400">
                Grasa
              </span>

              <span className="font-semibold text-white">
                {latestLog.body_fat !== null
                  ? `${formatNumber(latestLog.body_fat)} %`
                  : "Sin dato"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 px-4 py-3">
              <p className="text-sm text-slate-400">
                Observaciones
              </p>

              <p className="mt-1 text-sm text-white">
                {latestLog.notes || "Sin observaciones"}
              </p>
            </div>
          </div>
        </article>
      </section>
    <WeightHistory logs={logs} />
    </div>
  );
}