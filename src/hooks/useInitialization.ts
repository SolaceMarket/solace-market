"use client";

import { useEffect, useState } from "react";

interface UseInitializationReturn {
  isInitialized: boolean;
}

export function useInitialization(): UseInitializationReturn {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Use minimal delay to ensure DOM is ready but prevent artificial waiting
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 50); // Just enough to prevent hydration flicker, not artificial delay

    return () => clearTimeout(timer);
  }, []);

  return { isInitialized };
}
