import type {
  RecoveryCheckin,
  RecoveryInput,
  RecoveryState,
} from "@/features/recovery/types";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function calculateRecoveryScore(input: RecoveryInput) {
  const sleepDuration = clamp((input.sleepHours / 8) * 100, 0, 100);
  const sleepQuality = clamp(input.sleepQuality * 20, 0, 100);
  const energy = clamp(input.energy * 20, 0, 100);
  const soreness = clamp((6 - input.soreness) * 20, 0, 100);
  const stress = clamp((6 - input.stress) * 20, 0, 100);

  return Math.round(
    sleepDuration * 0.3 +
      sleepQuality * 0.2 +
      energy * 0.2 +
      soreness * 0.15 +
      stress * 0.15,
  );
}

export function getRecoveryState(score: number): RecoveryState {
  if (score >= 75) {
    return {
      score,
      status: "ready",
      label: "Preparado",
      recommendation:
        "Puedes realizar la sesión prevista y progresar si mantienes una técnica sólida.",
    };
  }

  if (score >= 50) {
    return {
      score,
      status: "moderate",
      label: "Recuperación media",
      recommendation:
        "Mantén la sesión, pero evita llegar al fallo y reduce una serie si la fatiga aumenta.",
    };
  }

  return {
    score,
    status: "low",
    label: "Recuperación baja",
    recommendation:
      "Prioriza descanso, movilidad o una sesión reducida. Evita buscar récords hoy.",
  };
}

export function toRecoveryState(checkin: RecoveryCheckin | null) {
  return getRecoveryState(checkin?.score ?? 65);
}
