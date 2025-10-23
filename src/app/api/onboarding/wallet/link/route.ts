import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import {
  saveWallet,
  updateOnboardingStep,
  getUser,
  isWalletAlreadyLinked,
} from "@/lib/tursoUsers";
import type {
  WalletLinkRequest,
  WalletLinkResponse,
  UserWallet,
} from "@/types/onboarding";

// Verify Solana wallet signature (simplified for now - TODO: add proper crypto verification)
function verifySignature(
  publicKey: string,
  signature: string,
  message: string,
): boolean {
  try {
    // Basic validation checks
    if (!publicKey || !signature || !message) return false;

    // TODO: Implement proper Solana signature verification with tweetnacl and bs58
    // For now, we'll do basic format validation

    // Check if publicKey looks like a Solana address (base58, ~44 chars)
    if (publicKey.length < 32 || publicKey.length > 44) return false;

    // Check if signature looks valid (base58, ~88 chars)
    if (signature.length < 64 || signature.length > 88) return false;

    // For development, accept the signature
    console.log("Mock signature verification", {
      publicKey: publicKey.substring(0, 8) + "...",
      message,
    });
    return true;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    const body: WalletLinkRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    if (!body.publicKey || !body.signature || !body.message) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "publicKey, signature, and message are required",
        },
        { status: 400 },
      );
    }

    // Verify user exists and KYC is approved (for security)
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    // Allow wallet linking if KYC is approved OR if this is a generated wallet
    const kycApproved = user.kyc?.status === "approved";
    if (!kycApproved && !body.isGenerated) {
      return NextResponse.json(
        {
          error: "Precondition failed",
          message: "KYC approval required for external wallet linking",
        },
        { status: 412 },
      );
    }

    // Verify signature (skip for generated wallets as they're created server-side)
    if (!body.isGenerated) {
      const signatureValid = verifySignature(
        body.publicKey,
        body.signature,
        body.message,
      );
      if (!signatureValid) {
        return NextResponse.json(
          { error: "Validation error", message: "Invalid wallet signature" },
          { status: 400 },
        );
      }
    }

    // Check if wallet is already linked to another user
    const alreadyLinked = await isWalletAlreadyLinked(body.publicKey, uid);
    if (alreadyLinked) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "Wallet is already linked to another account",
        },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const walletData: UserWallet = {
      chain: "solana",
      publicKey: body.publicKey,
      verifiedAt: now,
      isGenerated: body.isGenerated || false,
    };

    // Save wallet data
    await saveWallet(uid, walletData);

    // Update onboarding step
    await updateOnboardingStep(uid, "wallet", true);

    // TODO: Fire analytics event
    console.log("Wallet linked", {
      uid,
      publicKey: body.publicKey.substring(0, 8) + "...", // Log partial key for privacy
      isGenerated: body.isGenerated,
    });

    const response: WalletLinkResponse = {
      success: true,
      wallet: walletData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Wallet link error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to link wallet",
      },
      { status: 500 },
    );
  }
}
