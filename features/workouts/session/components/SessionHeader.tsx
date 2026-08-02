import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RestTimer } from "@/features/workouts/session/components/RestTimer";
import { WorkoutTimer } from "@/features/workouts/session/components/WorkoutTimer";
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
  return (
    <Card className="sticky top-3 z-30 border-slate-800 bg-slate-900/95 text-white shadow-xl backdrop-blur">
      <CardContent className="space-y-3 pt-6">
        <div className="grid gap-3 md:grid-cols-2">
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

        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={props.onCancel}
            className="text-slate-500 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Cancelar sesión
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
