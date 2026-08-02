/* eslint-disable react-hooks/refs, react-hooks/purity, react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  clearWorkoutSessionDraft,
  loadWorkoutSessionDraft,
  saveWorkoutSessionDraft,
} from "@/features/workouts/session/services/session-storage";
import {
  getElapsedMilliseconds,
  getRemainingSeconds,
} from "@/features/workouts/session/services/timer.service";
import type {
  WorkoutSessionDraft,
  WorkoutSessionStatus,
} from "@/features/workouts/session/types";
import type { WorkoutFormValues } from "@/features/workouts/validations/workout.schema";

type UseWorkoutSessionInput = {
  workoutType: string;
  initialValues: WorkoutFormValues;
  onRestore: (values: WorkoutFormValues) => void;
};

export function useWorkoutSession({
  workoutType,
  initialValues,
  onRestore,
}: UseWorkoutSessionInput) {
  const initialStartedAt = useRef(new Date().toISOString());
  const [startedAt, setStartedAt] = useState(initialStartedAt.current);
  const [status, setStatus] = useState<WorkoutSessionStatus>("running");
  const [accumulatedMs, setAccumulatedMs] = useState(0);
  const [resumedAt, setResumedAt] = useState<string | null>(
    initialStartedAt.current,
  );
  const [restEndsAt, setRestEndsAt] = useState<string | null>(null);
  const [restDurationSeconds, setRestDurationSeconds] = useState(90);
  const [now, setNow] = useState(Date.now());
  const [isReady, setIsReady] = useState(false);
  const latestValuesRef = useRef(initialValues);

  useEffect(() => {
    const draft = loadWorkoutSessionDraft(workoutType);

    if (draft) {
      const shouldRestore = window.confirm(
        "Hemos encontrado una sesión en curso. ¿Quieres continuarla?",
      );

      if (shouldRestore) {
        setStartedAt(draft.startedAt);
        setStatus(draft.status);
        setAccumulatedMs(draft.accumulatedMs);
        setResumedAt(draft.status === "running" ? draft.resumedAt : null);
        setRestEndsAt(draft.restEndsAt);
        setRestDurationSeconds(draft.restDurationSeconds);
        latestValuesRef.current = draft.formValues;
        onRestore(draft.formValues);
      } else {
        clearWorkoutSessionDraft(workoutType);
      }
    }

    setIsReady(true);
  }, [onRestore, workoutType]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const elapsedMs = useMemo(
    () =>
      getElapsedMilliseconds({
        accumulatedMs,
        resumedAt,
        isRunning: status === "running",
        now,
      }),
    [accumulatedMs, now, resumedAt, status],
  );

  const remainingRestSeconds = useMemo(
    () => getRemainingSeconds(restEndsAt, now),
    [now, restEndsAt],
  );

  useEffect(() => {
    if (restEndsAt && remainingRestSeconds === 0) {
      setRestEndsAt(null);

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([180, 80, 180]);
      }
    }
  }, [remainingRestSeconds, restEndsAt]);

  const pauseSession = useCallback(() => {
    setAccumulatedMs((current) =>
      getElapsedMilliseconds({
        accumulatedMs: current,
        resumedAt,
        isRunning: status === "running",
      }),
    );
    setResumedAt(null);
    setStatus("paused");
  }, [resumedAt, status]);

  const resumeSession = useCallback(() => {
    setResumedAt(new Date().toISOString());
    setStatus("running");
  }, []);

  const startRest = useCallback(
    (seconds = restDurationSeconds) => {
      setRestDurationSeconds(seconds);
      setRestEndsAt(new Date(Date.now() + seconds * 1_000).toISOString());
    },
    [restDurationSeconds],
  );

  const stopRest = useCallback(() => setRestEndsAt(null), []);

  const addRestSeconds = useCallback((seconds: number) => {
    setRestEndsAt((current) => {
      const base = current
        ? Math.max(Date.now(), new Date(current).getTime())
        : Date.now();
      return new Date(base + seconds * 1_000).toISOString();
    });
  }, []);

  const saveDraft = useCallback(
    (formValues: WorkoutFormValues) => {
      latestValuesRef.current = formValues;

      const draft: WorkoutSessionDraft = {
        version: 1,
        workoutType,
        startedAt,
        accumulatedMs:
          status === "running"
            ? getElapsedMilliseconds({
                accumulatedMs,
                resumedAt,
                isRunning: true,
              })
            : accumulatedMs,
        resumedAt: status === "running" ? new Date().toISOString() : null,
        status,
        restEndsAt,
        restDurationSeconds,
        formValues,
        savedAt: new Date().toISOString(),
      };

      saveWorkoutSessionDraft(draft);
    },
    [
      accumulatedMs,
      restDurationSeconds,
      restEndsAt,
      resumedAt,
      startedAt,
      status,
      workoutType,
    ],
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const interval = window.setInterval(() => {
      saveDraft(latestValuesRef.current);
    }, 5_000);

    return () => window.clearInterval(interval);
  }, [isReady, saveDraft]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const handleBeforeUnload = () => {
      saveDraft(latestValuesRef.current);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isReady, saveDraft]);

  const updateLatestValues = useCallback((values: WorkoutFormValues) => {
    latestValuesRef.current = values;
  }, []);

  const cancelSession = useCallback(() => {
    clearWorkoutSessionDraft(workoutType);
  }, [workoutType]);

  const completeSession = useCallback(() => {
    clearWorkoutSessionDraft(workoutType);
  }, [workoutType]);

  return {
    isReady,
    startedAt,
    status,
    elapsedSeconds: Math.floor(elapsedMs / 1_000),
    isResting: remainingRestSeconds > 0,
    remainingRestSeconds,
    restDurationSeconds,
    pauseSession,
    resumeSession,
    startRest,
    stopRest,
    addRestSeconds,
    setRestDurationSeconds,
    saveDraft,
    updateLatestValues,
    cancelSession,
    completeSession,
  };
}
