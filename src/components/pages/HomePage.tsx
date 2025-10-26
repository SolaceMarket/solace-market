"use client";

import { MemoCard } from "@/components/web3/solana/memo-card";
import { WalletConnectButton } from "@/components/web3/solana/wallet-connect-button";
import { ConnectButton } from "@/web3auth/ConnectButton";
import { DisconnectButton } from "@/web3auth/DisconnectButton";
import { UserInfo } from "@/web3auth/UserInfo";
import { useWeb3AuthLogs } from "@/web3auth/useWeb3AuthLogs";
import { CreditCardForm, type CreditCardFormData } from "../forms/credit-card";
import { SolanaTransaction } from "../solana/SolanaTransaction";

export function HomePage() {
  useWeb3AuthLogs();

  const handleCreditCardSubmit = (data: CreditCardFormData) => {
    console.log("Credit card data received:", data);
    // Here you would typically send the data to your payment processor
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Ethereum Wallet</h1>
        <UserInfo />
        <ConnectButton />
        <DisconnectButton />
      </section>

      <section>
        <h1 className="text-3xl font-bold mb-4">Solana Wallet</h1>
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
        <MemoCard />
      </section>

      <section>
        <h1 className="text-3xl font-bold mb-4">Solana Transaction</h1>
        <SolanaTransaction />
      </section>

      <section>
        <h1 className="text-3xl font-bold mb-4">Payment Method</h1>
        <CreditCardForm onSubmit={handleCreditCardSubmit} />
      </section>
    </div>
  );
}
