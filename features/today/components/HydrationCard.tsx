"use client";

import { useState, useTransition } from "react";
import { Droplets, Plus } from "lucide-react";

import { addHydrationAction } from "@/features/settings";

export function HydrationCard({
  date,
  initialAmount,
  target,
}: {
  date: string;
  initialAmount: number;
  target: number;
}) {
  const [amount, setAmount] = useState(initialAmount);
  const [isPending, startTransition] = useTransition();
  const percentage = Math.min(100, Math.round((amount / target) * 100));

  function add(value: number) {
    startTransition(async () => {
      const result = await addHydrationAction(date, value);
      if (result.success) setAmount((current) => current + value);
    });
  }

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-200">Hidratación</p>
          <p className="mt-1 text-2xl font-bold">
            {amount}{" "}
            <span className="text-sm font-normal text-cyan-100/60">
              / {target} ml
            </span>
          </p>
        </div>
        <Droplets className="h-7 w-7 text-cyan-300" />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/50">
        <div
          className="h-full rounded-full bg-cyan-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[250, 500].map((value) => (
          <button
            key={value}
            type="button"
            disabled={isPending}
            onClick={() => add(value)}
            className="flex min-h-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-slate-950/30 text-sm font-semibold text-cyan-100 disabled:opacity-50"
          >
            <Plus className="mr-1 h-4 w-4" /> {value} ml
          </button>
        ))}
      </div>
    </section>
  );
}
