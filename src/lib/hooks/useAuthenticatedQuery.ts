import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { User as FirebaseUser } from "firebase/auth";

interface AuthenticatedFetchOptions {
  firebaseUser: FirebaseUser | null;
  endpoint: string;
  queryKey: (string | number)[];
  enabled?: boolean;
}

export function useAuthenticatedQuery<TData = unknown>(
  {
    firebaseUser,
    endpoint,
    queryKey,
    enabled = true,
  }: AuthenticatedFetchOptions,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn" | "enabled">,
) {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<TData> => {
      if (!firebaseUser) {
        throw new Error("User not authenticated");
      }

      const token = await firebaseUser.getIdToken();
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Resource not found");
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 403) {
          throw new Error("Forbidden");
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      return response.json();
    },
    enabled: enabled && !!firebaseUser,
    ...options,
  });
}
