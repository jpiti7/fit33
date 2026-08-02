import { Plus, RotateCcw, TimerReset, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDuration } from "@/features/workouts/session/services/timer.service";

type RestTimerProps = {
  remainingSeconds: number;
  defaultSeconds: number;
  onStart: () => void;
  onStop: () => void;
  onAddSeconds: (seconds: number) => void;
};

export function RestTimer({
  remainingSeconds,
  defaultSeconds,
  onStart,
  onStop,
  onAddSeconds,
}: RestTimerProps) {
  const isActive = remainingSeconds > 0;

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        isActive
          ? "border-amber-400/40 bg-amber-400/10"
          : "border-slate-800 bg-slate-950"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <TimerReset className="h-4 w-4 text-amber-300" />
            Descanso
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-white">
            {formatDuration(isActive ? remainingSeconds : defaultSeconds)}
          </p>
        </div>

        <div className="flex gap-2">
          {isActive ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onAddSeconds(30)}
                className="border-slate-700 bg-transparent text-slate-300"
              >
                <Plus className="mr-1 h-4 w-4" />
                30 s
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onStop}
                aria-label="Cancelar descanso"
                className="text-slate-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onStart}
              className="border-slate-700 bg-transparent text-slate-300"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Iniciar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
