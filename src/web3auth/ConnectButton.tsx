import { useWeb3AuthConnect } from "@web3auth/modal/react";

export function ConnectButton() {
  const { connect, loading, isConnected, error } = useWeb3AuthConnect();

  return (
    <div>
      <button
        type="button"
        onClick={() => connect()}
        disabled={loading || isConnected}
      >
        {loading ? "Connecting..." : isConnected ? "Connected" : "Connect"}
      </button>
      {error && <div>{error.message}</div>}
    </div>
  );
}
