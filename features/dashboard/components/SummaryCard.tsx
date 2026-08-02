import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardTrend } from "@/features/dashboard/types";

type SummaryCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  trend?: DashboardTrend;
};

function Trend({ trend }: { trend: DashboardTrend }) {
  if (trend.value === null) {
    return <p className="text-xs text-slate-500">Sin referencia previa</p>;
  }

  const value = trend.value;
  const className =
    value > 0
      ? "text-emerald-400"
      : value < 0
        ? "text-amber-400"
        : "text-slate-400";

  return (
    <p className={`text-xs font-semibold ${className}`}>
      {value > 0 ? "+" : ""}
      {value.toLocaleString("es-ES", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}{" "}
      % {trend.label}
    </p>
  );
}

export function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
}: SummaryCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-900 text-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
          <span className="rounded-xl bg-emerald-400/10 p-2 text-emerald-400">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <div className="mt-3">
          {trend ? (
            <Trend trend={trend} />
          ) : (
            <p className="text-xs text-slate-500">{detail}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
