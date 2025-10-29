"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { SolanaProvider } from "@/components/web3/solana/SolanaProvider";
import { queryClient } from "@/lib/queryClient";
import { usePlatform } from "@/nextjs/hooks/usePlatform";
import { DevTools } from "./DevTools";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isDetermined, platform] = usePlatform();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SolanaProvider>
          {children}

          {isDetermined && platform === "client" && <DevTools />}
        </SolanaProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
