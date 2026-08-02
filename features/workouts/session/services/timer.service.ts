export function getElapsedMilliseconds(input: {
  accumulatedMs: number;
  resumedAt: string | null;
  isRunning: boolean;
  now?: number;
}) {
  const now = input.now ?? Date.now();

  if (!input.isRunning || !input.resumedAt) {
    return Math.max(0, input.accumulatedMs);
  }

  return Math.max(
    0,
    input.accumulatedMs + (now - new Date(input.resumedAt).getTime()),
  );
}

export function getRemainingSeconds(
  restEndsAt: string | null,
  now = Date.now(),
) {
  if (!restEndsAt) {
    return 0;
  }

  return Math.max(0, Math.ceil((new Date(restEndsAt).getTime() - now) / 1_000));
}

export function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3_600);
  const minutes = Math.floor((safeSeconds % 3_600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  return [minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}
