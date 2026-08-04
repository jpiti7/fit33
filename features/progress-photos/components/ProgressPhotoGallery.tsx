/* eslint-disable @next/next/no-img-element */
"use client";

import { useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteProgressPhotoAction } from "@/features/progress-photos/actions/progress-photo.actions";
import type { ProgressPhoto } from "@/features/progress-photos/types";

export function ProgressPhotoGallery({ photos }: { photos: ProgressPhoto[] }) {
  const [isPending, startTransition] = useTransition();

  if (photos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center text-slate-400">
        Tu línea temporal aparecerá aquí cuando guardes la primera fotografía.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <article
          key={photo.id}
          className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900"
        >
          <div className="relative aspect-[3/4] bg-slate-950">
            {photo.signedUrl ? (
              <img
                src={photo.signedUrl}
                alt={`Progreso del ${photo.takenAt}`}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-white">
                  {new Intl.DateTimeFormat("es-ES", {
                    dateStyle: "medium",
                  }).format(new Date(`${photo.takenAt}T12:00:00`))}
                </p>
                {photo.weight !== null && (
                  <p className="mt-1 text-sm text-emerald-300">
                    {photo.weight.toLocaleString("es-ES")} kg
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={isPending}
                aria-label="Eliminar fotografía"
                onClick={() => {
                  if (!window.confirm("¿Eliminar esta fotografía de progreso?"))
                    return;
                  startTransition(() => deleteProgressPhotoAction(photo.id));
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:border-red-400 hover:text-red-300"
              >
                {isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
            {photo.note && (
              <p className="mt-3 text-sm text-slate-400">{photo.note}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
