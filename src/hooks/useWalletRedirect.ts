"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseWalletRedirectProps {
  isConnected: boolean;
}

export function useWalletRedirect({ isConnected }: UseWalletRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/assets-list");
    }
  }, [isConnected, router]);
}
