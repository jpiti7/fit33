"use client";

import { Eye, EyeOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RestTimer } from "@/features/workouts/session/components/RestTimer";
import { WorkoutTimer } from "@/features/workouts/session/components/WorkoutTimer";
import { useWakeLock } from "@/features/workouts/session/hooks/useWakeLock";
import type { WorkoutSessionStatus } from "@/features/workouts/session/types";

type SessionHeaderProps = {
  elapsedSeconds: number;
  status: WorkoutSessionStatus;
  remainingRestSeconds: number;
  restDurationSeconds: number;
  onPause: () => void;
  onResume: () => void;
  onStartRest: () => void;
  onStopRest: () => void;
  onAddRestSeconds: (seconds: number) => void;
  onCancel: () => void;
};

export function SessionHeader(props: SessionHeaderProps) {
  const wakeLock = useWakeLock();

  return (
    <Card className="workout-session-header sticky top-[max(0.5rem,env(safe-area-inset-top))] z-30 overflow-hidden border-slate-700/80 bg-slate-900/90 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
      <CardContent className="space-y-3 p-3 sm:p-5">
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <WorkoutTimer
            elapsedSeconds={props.elapsedSeconds}
            status={props.status}
            onPause={props.onPause}
            onResume={props.onResume}
          />
          <RestTimer
            remainingSeconds={props.remainingRestSeconds}
            defaultSeconds={props.restDurationSeconds}
            onStart={props.onStartRest}
            onStop={props.onStopRest}
            onAddSeconds={props.onAddRestSeconds}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          {wakeLock.isSupported ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                wakeLock.isActive
                  ? void wakeLock.release()
                  : void wakeLock.request()
              }
              className="min-h-11 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              {wakeLock.isActive ? (
                <Eye className="mr-2 h-4 w-4 text-emerald-400" />
              ) : (
                <EyeOff className="mr-2 h-4 w-4" />
              )}
              {wakeLock.isActive ? "Pantalla activa" : "Mantener pantalla"}
            </Button>
          ) : (
            <span className="text-xs text-slate-600">Modo entrenamiento</span>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={props.onCancel}
            className="min-h-11 text-xs text-slate-500 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
