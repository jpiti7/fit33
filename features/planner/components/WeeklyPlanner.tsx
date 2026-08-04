import Link from "next/link";
import { CalendarDays, Moon, Play } from "lucide-react";

import type { WeeklyPlan } from "@/features/planner/types";

export function WeeklyPlanner({ plan }: { plan: WeeklyPlan }) {
  return (
    <div className="space-y-4">
      {plan.sessions.map((session) => (
        <article
          key={`${session.date}-${session.slug}`}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="capitalize text-sm font-semibold text-emerald-300">
                {session.day} · {session.date}
              </p>
              <h2 className="mt-2 text-xl font-bold">{session.type}</h2>
              <p className="mt-1 text-sm text-slate-400">{session.focus}</p>
              <p className="mt-3 text-sm text-slate-300">{session.reason}</p>
            </div>
            <CalendarDays className="h-6 w-6 text-slate-500" />
          </div>
          <Link
            href={`/entrenos/${session.slug}`}
            className="mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 font-bold text-slate-950"
          >
            <Play className="mr-2 h-4 w-4" />
            Abrir sesión
          </Link>
        </article>
      ))}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-3">
          <Moon className="h-5 w-5 text-indigo-300" />
          <h2 className="font-bold">Recuperación programada</h2>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          {plan.recoveryDays.join(" · ")}
        </p>
      </div>
    </div>
  );
}
