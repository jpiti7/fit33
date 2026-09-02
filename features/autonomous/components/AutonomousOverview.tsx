"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Dumbbell,
  HeartPulse,
  Utensils,
} from "lucide-react";
import type {
  AutonomousProposal,
  AutonomousSummary,
} from "@/features/autonomous/types";
import { acknowledgeAutonomousAction } from "@/features/autonomous/actions";

const icons = {
  reorganize_training: Dumbbell,
  reduce_training: HeartPulse,
  nutrition_review: Utensils,
  recovery_checkin: HeartPulse,
};

export function AutonomousOverview({ data }: { data: AutonomousSummary }) {
  const [accepted, setAccepted] = useState<string[]>([]);

  async function accept(proposal: AutonomousProposal) {
    await acknowledgeAutonomousAction(proposal.kind);
    setAccepted((current) => [...current, proposal.id]);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-400/15 via-slate-900 to-slate-900 p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-300 text-slate-950">
            <BrainCircuit className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
              Coach autónomo
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Fit33 detecta y propone
            </h1>
            <p className="mt-2 max-w-2xl text-slate-300">{data.headline}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Metric label="Estado" value={`${data.score}/100`} />
          <Metric
            label="Adherencia"
            value={`${data.context.adherencePercent}%`}
          />
          <Metric
            label="Recuperación"
            value={`${data.context.recoveryScore}/100`}
          />
          <Metric label="Proteína" value={`${data.context.proteinPercent}%`} />
        </div>
      </section>

      <section className="space-y-4">
        {data.proposals.map((proposal) => {
          const Icon = icons[proposal.kind];
          const done = accepted.includes(proposal.id);
          return (
            <article
              key={proposal.id}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">{proposal.title}</h2>
                    <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {proposal.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {proposal.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => accept(proposal)}
                    disabled={done}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-emerald-400 px-4 font-bold text-slate-950 disabled:cursor-default disabled:opacity-70"
                  >
                    {done ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    {done ? "Aceptado" : proposal.cta}
                  </button>
                  {done && (
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      {proposal.kind === "reorganize_training" && (
                        <Link
                          className="text-emerald-300"
                          href="/planificacion"
                        >
                          Abrir planificación →
                        </Link>
                      )}
                      {proposal.kind === "reduce_training" && (
                        <Link className="text-emerald-300" href="/adaptativo">
                          Abrir sesión adaptada →
                        </Link>
                      )}
                      {proposal.kind === "nutrition_review" && (
                        <Link className="text-emerald-300" href="/nutricion">
                          Abrir nutrición →
                        </Link>
                      )}
                      {proposal.kind === "recovery_checkin" && (
                        <Link className="text-emerald-300" href="/recuperacion">
                          Abrir recuperación →
                        </Link>
                      )}
                      {proposal.id === "maintain-course" && (
                        <Link className="text-emerald-300" href="/entrenos">
                          Ver entrenamientos →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-950/50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
