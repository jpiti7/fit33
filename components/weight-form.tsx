"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function WeightForm() {
  const [weight, setWeight] = useState("82");
  const [waist, setWaist] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [notes, setNotes] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setHasError(false);

    const parsedWeight = Number(weight.replace(",", "."));

    const parsedWaist = waist
      ? Number(waist.replace(",", "."))
      : null;

    const parsedBodyFat = bodyFat
      ? Number(bodyFat.replace(",", "."))
      : null;

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      setHasError(true);
      setMessage("Introduce un peso válido.");
      return;
    }

    if (
      parsedWaist !== null &&
      (!Number.isFinite(parsedWaist) || parsedWaist <= 0)
    ) {
      setHasError(true);
      setMessage("Introduce una cintura válida.");
      return;
    }

    if (
      parsedBodyFat !== null &&
      (!Number.isFinite(parsedBodyFat) ||
        parsedBodyFat <= 0 ||
        parsedBodyFat > 100)
    ) {
      setHasError(true);
      setMessage("Introduce un porcentaje de grasa válido.");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("weight_logs").insert({
        weight: parsedWeight,
        waist: parsedWaist,
        body_fat: parsedBodyFat,
        notes: notes.trim() || null,
      });

      if (error) {
        throw error;
      }

      setMessage("Registro guardado correctamente.");
      setWeight("");
      setWaist("");
      setBodyFat("");
      setNotes("");
    } catch (error: unknown) {
      setHasError(true);

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        setMessage(error.message);
      } else {
        setMessage("No se pudo guardar el registro.");
      }

      console.error("Error al guardar el peso:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div>
        <p className="text-sm font-semibold text-emerald-400">
          Nuevo registro
        </p>

        <h2 className="mt-1 text-2xl font-bold text-white">
          Registra tu progreso
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Introduce los datos tomados por la mañana y en condiciones similares.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">
            Peso corporal
          </span>

          <div className="relative mt-2">
            <input
              type="text"
              inputMode="decimal"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="82,0"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              kg
            </span>
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">
            Cintura
          </span>

          <div className="relative mt-2">
            <input
              type="text"
              inputMode="decimal"
              value={waist}
              onChange={(event) => setWaist(event.target.value)}
              placeholder="95,0"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              cm
            </span>
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">
            Grasa corporal
          </span>

          <div className="relative mt-2">
            <input
              type="text"
              inputMode="decimal"
              value={bodyFat}
              onChange={(event) => setBodyFat(event.target.value)}
              placeholder="35,0"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              %
            </span>
          </div>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">
            Observaciones
          </span>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ejemplo: pesaje en ayunas, buena energía..."
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
          />
        </label>
      </div>

      {message && (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            hasError
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-6 w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "Guardando..." : "Guardar registro"}
      </button>
    </form>
  );
}