export type HapticPattern = "light" | "success" | "warning";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 20,
  success: [35, 45, 55],
  warning: [80, 50, 80],
};

export function triggerHaptic(pattern: HapticPattern = "light") {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) {
    return;
  }

  navigator.vibrate(patterns[pattern]);
}
