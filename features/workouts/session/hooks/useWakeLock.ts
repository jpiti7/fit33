/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: "release", listener: () => void) => void;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: "screen") => Promise<WakeLockSentinelLike>;
  };
};

export function useWakeLock() {
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isSupported] = useState(
    () => typeof navigator !== "undefined" && "wakeLock" in navigator,
  );

  const release = useCallback(async () => {
    const sentinel = sentinelRef.current;
    sentinelRef.current = null;

    if (sentinel && !sentinel.released) {
      await sentinel.release();
    }

    setIsActive(false);
  }, []);

  const request = useCallback(async () => {
    const navigatorWithWakeLock = navigator as NavigatorWithWakeLock;

    if (
      !navigatorWithWakeLock.wakeLock ||
      document.visibilityState !== "visible"
    ) {
      return;
    }

    try {
      const sentinel = await navigatorWithWakeLock.wakeLock.request("screen");
      sentinelRef.current = sentinel;
      setIsActive(true);
      sentinel.addEventListener("release", () => setIsActive(false));
    } catch {
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      if (
        document.visibilityState === "visible" &&
        sentinelRef.current === null
      ) {
        void request();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    void request();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void release();
    };
  }, [release, request]);

  return { isActive, isSupported, request, release };
}
