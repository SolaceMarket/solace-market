"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SolanaProvider } from "@/components/web3/solana/SolanaProvider";
import { isDev } from "@/lib/dev/devEnv";
import { queryClient } from "@/lib/queryClient";
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
          {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </SolanaProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
