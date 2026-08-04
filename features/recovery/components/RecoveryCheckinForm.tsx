"use client";

import { useState, useTransition } from "react";
import { BatteryCharging, HeartPulse, Moon, Save } from "lucide-react";

import { saveRecoveryAction } from "@/features/recovery/actions/recovery.actions";
import {
  calculateRecoveryScore,
  getRecoveryState,
} from "@/features/recovery/services/recovery.service";
import type { RecoveryCheckin } from "@/features/recovery/types";

type Props = { initial: RecoveryCheckin | null };

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function RecoveryCheckinForm({ initial }: Props) {
  const [sleepHours, setSleepHours] = useState(initial?.sleepHours ?? 7);
  const [sleepQuality, setSleepQuality] = useState(initial?.sleepQuality ?? 3);
  const [soreness, setSoreness] = useState(initial?.soreness ?? 2);
  const [stress, setStress] = useState(initial?.stress ?? 2);
  const [energy, setEnergy] = useState(initial?.energy ?? 3);
  const [restingHeartRate, setRestingHeartRate] = useState(
    initial?.restingHeartRate?.toString() ?? "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const input = {
    recordedOn: today(),
    sleepHours,
    sleepQuality,
    soreness,
    stress,
    energy,
    restingHeartRate: restingHeartRate ? Number(restingHeartRate) : null,
    notes: notes.trim() || null,
  };
  const state = getRecoveryState(calculateRecoveryScore(input));

  function submit() {
    setMessage("");
    startTransition(async () => {
      const result = await saveRecoveryAction(input);
      setMessage(result.success ? "Check-in guardado." : result.message);
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/15 to-slate-900 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Estado estimado</p>
            <h2 className="mt-1 text-2xl font-bold">{state.label}</h2>
            <p className="mt-2 text-sm text-slate-300">
              {state.recommendation}
            </p>
          </div>
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-emerald-400/30 text-2xl font-black text-emerald-300">
            {state.score}
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <Moon className="h-4 w-4" /> Horas de sueño
          </span>
          <input
            type="number"
            min="0"
            max="14"
            step="0.5"
            value={sleepHours}
            onChange={(event) => setSleepHours(Number(event.target.value))}
            className="min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4"
          />
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <HeartPulse className="h-4 w-4" /> Pulso en reposo (opcional)
          </span>
          <input
            type="number"
            min="30"
            max="220"
            value={restingHeartRate}
            onChange={(event) => setRestingHeartRate(event.target.value)}
            className="min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4"
          />
        </label>

        {[
          ["Calidad del sueño", sleepQuality, setSleepQuality],
          ["Dolor muscular", soreness, setSoreness],
          ["Estrés", stress, setStress],
          ["Energía", energy, setEnergy],
        ].map(([label, value, setter]) => (
          <label key={String(label)} className="space-y-2">
            <span className="text-sm text-slate-300">
              {String(label)} · {Number(value)}/5
            </span>
            <input
              type="range"
              min="1"
              max="5"
              value={Number(value)}
              onChange={(event) =>
                (setter as (value: number) => void)(Number(event.target.value))
              }
              className="w-full accent-emerald-400"
            />
          </label>
        ))}

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm text-slate-300">Notas</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={500}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4"
            placeholder="Molestias, sueño interrumpido, sensaciones…"
          />
        </label>
      </section>

      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-emerald-400 font-bold text-slate-950 disabled:opacity-50"
      >
        {isPending ? (
          <BatteryCharging className="mr-2 h-5 w-5 animate-pulse" />
        ) : (
          <Save className="mr-2 h-5 w-5" />
        )}
        Guardar check-in
      </button>

      {message && (
        <p className="text-center text-sm text-slate-300">{message}</p>
      )}
    </div>
  );
}
