import { Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardRecord } from "@/features/dashboard/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function PRCard({ records }: { records: DashboardRecord[] }) {
  return (
    <Card className="border-slate-800 bg-slate-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-emerald-400" />
          Marcas recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-slate-400">
            Completa entrenamientos para generar referencias de rendimiento.
          </p>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <article
                key={record.exerciseName}
                className="rounded-xl bg-slate-950 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{record.exerciseName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {record.muscleGroup ?? "Sin grupo"} ·{" "}
                      {formatDate(record.achievedAt)}
                    </p>
                  </div>
                  <p className="text-right text-sm font-bold text-emerald-400">
                    {record.maxWeight.toLocaleString("es-ES", {
                      maximumFractionDigits: 1,
                    })}{" "}
                    kg
                  </p>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  1RM estimado:{" "}
                  {record.estimatedOneRepMax.toLocaleString("es-ES", {
                    maximumFractionDigits: 1,
                  })}{" "}
                  kg
                </p>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
