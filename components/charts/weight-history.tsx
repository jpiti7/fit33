"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WeightLog } from "@/types/weight-log";

type WeightHistoryProps = {
  logs: WeightLog[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function WeightHistory({ logs }: WeightHistoryProps) {
  const chartData = [...logs].reverse().map((log) => ({
    date: formatDate(log.created_at),
    weight: log.weight,
  }));

  if (logs.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div>
          <p className="text-sm text-slate-400">Evolución</p>
          <h2 className="mt-1 text-xl font-bold text-white">
            Historial de peso
          </h2>
        </div>

        {logs.length < 2 ? (
          <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 px-6">
            <p className="max-w-sm text-center text-sm text-slate-500">
              Registra al menos dos pesos para visualizar la evolución.
            </p>
          </div>
        ) : (
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />

                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <YAxis
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                  }}
                  formatter={(value) => [
                    `${formatNumber(Number(value))} kg`,
                    "Peso",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#34d399",
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#6ee7b7",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Últimos registros</p>

        <h2 className="mt-1 text-xl font-bold text-white">Historial</h2>

        <div className="mt-6 max-h-72 space-y-3 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className="rounded-xl bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">
                    {formatNumber(log.weight)} kg
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatFullDate(log.created_at)}
                  </p>
                </div>

                <div className="text-right text-xs text-slate-400">
                  <p>
                    Cintura:{" "}
                    {log.waist !== null ? `${formatNumber(log.waist)} cm` : "—"}
                  </p>

                  <p className="mt-1">
                    Grasa:{" "}
                    {log.body_fat !== null
                      ? `${formatNumber(log.body_fat)} %`
                      : "—"}
                  </p>
                </div>
              </div>

              {log.notes && (
                <p className="mt-3 border-t border-slate-800 pt-3 text-sm text-slate-400">
                  {log.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
