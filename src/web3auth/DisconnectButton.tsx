import { useWeb3AuthDisconnect } from "@web3auth/modal/react";

export function DisconnectButton() {
  const { disconnect, loading, error } = useWeb3AuthDisconnect();

  return (
    <div>
      <button type="button" onClick={() => disconnect()} disabled={loading}>
        {loading ? "Disconnecting..." : "Disconnect"}
      </button>
      {error && <div>{error.message}</div>}
    </div>
  );
}
