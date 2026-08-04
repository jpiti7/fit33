"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, LoaderCircle } from "lucide-react";

import { uploadProgressPhotoAction } from "@/features/progress-photos/actions/progress-photo.actions";

export function ProgressPhotoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setMessage("");
        startTransition(async () => {
          try {
            await uploadProgressPhotoAction(formData);
            formRef.current?.reset();
            setMessage("Fotografía guardada correctamente.");
          } catch (error) {
            setMessage(
              error instanceof Error
                ? error.message
                : "No se pudo guardar la fotografía.",
            );
          }
        });
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
          <Camera className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Nueva foto</h2>
          <p className="text-sm text-slate-400">
            Mejor con luz, postura y distancia similares.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">Fotografía</span>
          <input
            required
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="user"
            className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-slate-300">Fecha</span>
          <input
            required
            name="takenAt"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-slate-300">
            Peso opcional
          </span>
          <input
            name="weight"
            inputMode="decimal"
            placeholder="80,4"
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">Nota</span>
          <textarea
            name="note"
            rows={3}
            placeholder="Sensaciones, semana del plan, postura..."
            className="mt-2 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </label>
      </div>

      {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}

      <button
        disabled={isPending}
        className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 font-bold text-slate-950 disabled:opacity-50"
      >
        {isPending ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          "Guardar fotografía"
        )}
      </button>
    </form>
  );
}
