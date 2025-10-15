"use client";

import { ConnectButton } from "@/web3auth/ConnectButton";
import { DisconnectButton } from "@/web3auth/DisconnectButton";
import { UserInfo } from "@/web3auth/UserInfo";
import { useWeb3AuthLogs } from "@/web3auth/useWeb3AuthLogs";

export default function HomePage() {
  useWeb3AuthLogs();

  return (
    <div>
      <UserInfo />
      <ConnectButton />
      <DisconnectButton />
    </div>
  );
}
