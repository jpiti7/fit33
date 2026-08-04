import { afterEach, describe, expect, it, vi } from "vitest";

import { triggerHaptic } from "@/lib/haptics";

describe("Haptics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("envía un patrón de éxito cuando la vibración está disponible", () => {
    const vibrate = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: vibrate,
    });

    triggerHaptic("success");

    expect(vibrate).toHaveBeenCalledWith([35, 45, 55]);
  });
});
