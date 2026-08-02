import { Clock3, Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDuration } from "@/features/workouts/session/services/timer.service";
import type { WorkoutSessionStatus } from "@/features/workouts/session/types";

type WorkoutTimerProps = {
  elapsedSeconds: number;
  status: WorkoutSessionStatus;
  onPause: () => void;
  onResume: () => void;
};

export function WorkoutTimer({
  elapsedSeconds,
  status,
  onPause,
  onResume,
}: WorkoutTimerProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950 p-4">
      <div>
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Clock3 className="h-4 w-4 text-emerald-400" />
          Tiempo de sesión
        </p>
        <p className="mt-1 font-mono text-2xl font-bold text-white">
          {formatDuration(elapsedSeconds)}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={status === "running" ? onPause : onResume}
        className="border-slate-700 bg-transparent text-slate-300"
      >
        {status === "running" ? (
          <>
            <Pause className="mr-2 h-4 w-4" /> Pausar
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" /> Continuar
          </>
        )}
      </Button>
    </div>
  );
}
