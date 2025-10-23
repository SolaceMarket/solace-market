import type { User as FirebaseUser } from "firebase/auth";
import { useAuthenticatedQuery } from "@/lib/hooks/useAuthenticatedQuery";
import type { AssetDetails } from "../types";

interface UseAssetDetailsOptions {
  firebaseUser: FirebaseUser | null;
  assetId: string;
  enabled?: boolean;
}

interface AssetDetailsResponse {
  asset: AssetDetails;
}

export function useAssetDetails({
  firebaseUser,
  assetId,
  enabled = true,
}: UseAssetDetailsOptions) {
  return useAuthenticatedQuery<AssetDetailsResponse>({
    firebaseUser,
    endpoint: `/api/admin/assets/${assetId}`,
    queryKey: ["admin", "assets", assetId],
    enabled: enabled && !!assetId,
  });
}
