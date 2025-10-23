import { QueryClient } from "@tanstack/react-query";

// Create a single QueryClient instance to be shared across the app
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time of 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes after component unmounts
      gcTime: 10 * 60 * 1000,
      // Retry failed requests twice
      retry: 2,
      // Don't refetch on window focus in development
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
    },
  },
});
