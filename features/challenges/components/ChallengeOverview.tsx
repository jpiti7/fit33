import { CheckCircle2, CircleDashed, Trophy } from "lucide-react";

import type { ChallengeSummary } from "@/features/challenges/types";

export function ChallengeOverview({ data }: { data: ChallengeSummary }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-amber-400/15 via-slate-900 to-slate-900 p-6">
        <Trophy className="h-8 w-8 text-amber-300" />
        <p className="mt-4 text-sm font-semibold text-amber-200">
          RETOS SEMANALES
        </p>
        <h1 className="mt-2 text-3xl font-black">
          {data.completed} de {data.total} completados
        </h1>
        <p className="mt-2 text-slate-400">
          Semana iniciada el {data.weekStart}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {data.challenges.map((item) => {
          const percentage = Math.min(
            100,
            Math.round((item.progress / Math.max(1, item.target)) * 100),
          );
          return (
            <article
              key={item.id}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.description}
                  </p>
                </div>
                {item.status === "completed" ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                ) : (
                  <CircleDashed className="h-6 w-6 text-slate-500" />
                )}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-semibold">
                {item.progress} / {item.target} {item.unit}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
