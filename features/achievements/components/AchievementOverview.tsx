import { Award, Dumbbell, Flame, Lock, Trophy } from "lucide-react";

import type { AchievementSummary } from "@/features/achievements/types";

const categoryIcon = {
  training: Dumbbell,
  consistency: Flame,
  strength: Trophy,
  progress: Award,
};

export function AchievementOverview({
  summary,
}: {
  summary: AchievementSummary;
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-sm text-emerald-200">Nivel Fit33</p>
          <p className="mt-2 text-4xl font-black text-white">{summary.level}</p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Logros</p>
          <p className="mt-2 text-3xl font-black text-white">
            {summary.unlocked}/{summary.total}
          </p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Puntos</p>
          <p className="mt-2 text-3xl font-black text-white">
            {summary.points}
          </p>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {summary.achievements.map((achievement) => {
          const Icon = categoryIcon[achievement.category];
          const percent = Math.round(
            (achievement.progress / achievement.target) * 100,
          );

          return (
            <article
              key={achievement.id}
              className={`rounded-3xl border p-5 ${
                achievement.unlocked
                  ? "border-emerald-400/30 bg-emerald-400/10"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-emerald-300">
                  {achievement.unlocked ? (
                    <Icon className="h-6 w-6" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-400">
                  {percent}%
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                {achievement.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {achievement.description}
              </p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {achievement.progress.toLocaleString("es-ES")} /{" "}
                {achievement.target.toLocaleString("es-ES")}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
