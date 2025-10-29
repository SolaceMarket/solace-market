"use client";

import {
  Address,
  address,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getAddressFromPublicKey,
  getBase58Decoder,
  getSignatureFromTransaction,
  lamports,
  pipe,
  type Signature,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
import { getTransferSolInstruction } from "@solana-program/system";
import type { UiWalletAccount } from "@wallet-standard/react";
import { useSolana } from "@/components/web3/solana/SolanaProvider";
import { Button } from "../ui/forms/button";

export const ConnectedSolanaTransaction = ({
  account,
}: {
  account: UiWalletAccount;
}) => {
  const { rpc, chain } = useSolana();

  const signer = useWalletAccountTransactionSendingSigner(account, chain);
  const recipient = address("AJwMQ1fRUe63ohBmosGqC2ohGYHiYa9shNetqrTkJ1RQ");

  //   const recipient = await generateKeyPairSigner();

  const LAMPORTS_PER_SOL = 1_000_000_000n;
  const transferAmount = lamports(LAMPORTS_PER_SOL / 100n); // 0.01 SOL

  const sendSOL = async () => {
    const transferInstruction = getTransferSolInstruction({
      source: signer,
      //   destination: recipient.address,
      destination: recipient,
      amount: transferAmount,
    });

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(signer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
    );

    // const signedTransaction =
    //   await signTransactionMessageWithSigners(transactionMessage);

    // await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
    //   signedTransaction,
    //   { commitment: "confirmed" },
    // );
    // const transactionSignature = getSignatureFromTransaction(signedTransaction);
    // console.log("Transaction Signature:", transactionSignature);

    const signature =
      await signAndSendTransactionMessageWithSigners(transactionMessage);
    const signatureStr = getBase58Decoder().decode(signature) as Signature;

    console.log("Transaction Signature:", signatureStr);
  };

  return (
    <Button type="submit" onClick={sendSOL} variant="outline">
      Send 0.01 SOL
    </Button>
  );
};

// Main transfer component
export function SolanaTransaction() {
  const { selectedAccount, isConnected } = useSolana();

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Transfer Funds</h3>
      {isConnected && selectedAccount ? (
        <ConnectedSolanaTransaction account={selectedAccount} />
      ) : (
        <p className="text-gray-500 text-center py-4">
          Connect your wallet to transfer funds
        </p>
      )}
    </div>
  );
}
