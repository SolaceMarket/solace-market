"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { SolanaProvider } from "@/components/web3/solana/SolanaProvider";
import { queryClient } from "@/lib/queryClient";
import { DevTools } from "./DevTools";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SolanaProvider>
          {children}

          <DevTools />
        </SolanaProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
