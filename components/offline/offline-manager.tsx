"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, CloudOff, LoaderCircle } from "lucide-react";

import { subscribeToNetworkStatus } from "@/lib/offline/network";
import { listQueuedWorkouts } from "@/lib/offline/queue";
import { syncPendingWorkouts } from "@/lib/offline/sync";

export function OfflineManager() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const refreshQueue = useCallback(async () => {
    try {
      const queuedWorkouts = await listQueuedWorkouts();
      setPending(queuedWorkouts.length);
    } catch (error) {
      console.error("No se pudo consultar la cola offline:", error);

      setPending(0);
    }
  }, []);

  const runSync = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.onLine) {
      return;
    }

    setSyncing(true);

    try {
      await syncPendingWorkouts();
      await refreshQueue();
    } catch (error) {
      console.error(
        "No se pudieron sincronizar los entrenamientos pendientes:",
        error,
      );
    } finally {
      setSyncing(false);
    }
  }, [refreshQueue]);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      const isOnline = navigator.onLine;

      setOnline(isOnline);
      void refreshQueue();

      if (isOnline) {
        void runSync();
      }
    });

    const unsubscribe = subscribeToNetworkStatus((nextOnline) => {
      setOnline(nextOnline);

      if (nextOnline) {
        void runSync();
      }
    });

    function handleQueueChange() {
      void refreshQueue();
    }

    window.addEventListener("fit33:offline-queue-change", handleQueueChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);

      unsubscribe();

      window.removeEventListener(
        "fit33:offline-queue-change",
        handleQueueChange,
      );
    };
  }, [refreshQueue, runSync]);

  const statusText = syncing
    ? `Sincronizando${pending > 0 ? ` (${pending})` : ""}`
    : online
      ? pending > 0
        ? `${pending} pendiente${pending === 1 ? "" : "s"}`
        : "Online"
      : "Offline · guardado local";

  return (
    <div className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50">
      <div
        role="status"
        aria-live="polite"
        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur ${
          online
            ? "border-emerald-400/30 bg-slate-950/90 text-emerald-300"
            : "border-red-400/30 bg-slate-950/95 text-red-300"
        }`}
      >
        {syncing ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : online ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <CloudOff className="h-4 w-4" aria-hidden="true" />
        )}

        <span>{statusText}</span>
      </div>
    </div>
  );
}
