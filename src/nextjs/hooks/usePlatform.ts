import { useEffect, useState } from "react";

export type Platform = "client" | "server";

/**
 * React hook to determine on which platform the code is running.
 *
 * It checks if the code is executing on one of the following platforms:
 * - a browser environment (client-side)
 * - or on the server (server-side).
 * @returns {[boolean, Platform]} A tuple where the first element indicates if the platform has been determined,
 * and the second element is the platform type.
 */
export function usePlatform(): [boolean, Platform] {
  const [isDetermined, setIsDetermined] = useState(false);
  const [platform, setPlatform] = useState<Platform>("server");

  useEffect(() => {
    setPlatform(typeof window !== "undefined" ? "client" : "server");
    setIsDetermined(true);
  }, []);

  return [isDetermined, platform];
}
