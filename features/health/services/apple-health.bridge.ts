"use client";

import type { HealthBridge } from "@/features/health/types";

type CapacitorWindow = Window & {
  Capacitor?: {
    Plugins?: {
      HealthKit?: HealthBridge;
    };
  };
};

function plugin(): HealthBridge {
  const bridge = (window as CapacitorWindow).Capacitor?.Plugins?.HealthKit;
  if (!bridge) {
    throw new Error(
      "Apple Health solo está disponible dentro de la app iOS de Fit33.",
    );
  }
  return bridge;
}

export const AppleHealth: HealthBridge = {
  isAvailable: () => plugin().isAvailable(),
  requestAuthorization: () => plugin().requestAuthorization(),
  readDailySummary: (options) => plugin().readDailySummary(options),
};

export async function isAppleHealthAvailable() {
  try {
    return (await AppleHealth.isAvailable()).available;
  } catch {
    return false;
  }
}
