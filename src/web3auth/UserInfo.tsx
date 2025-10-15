import { useWeb3Auth, useWeb3AuthUser } from "@web3auth/modal/react";

export function UserInfo() {
  const { userInfo, loading, error, isMFAEnabled, getUserInfo } =
    useWeb3AuthUser();

  const { web3Auth } = useWeb3Auth();

  if (loading) return <div>Loading user info...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!userInfo) return <div>No user info available.</div>;

  if (web3Auth === null) return <div>Web3Auth not initialized</div>;

  return (
    <div className="w-full">
      <div>
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        <div>MFA Enabled: {isMFAEnabled ? "Yes" : "No"}</div>
        <button type="button" onClick={() => getUserInfo()}>
          Refresh User Info
        </button>
      </div>
      {error && <div>{(error as Error)?.message}</div>}

      <div>
        <h1>Web3Auth</h1>
        <pre>Chain: {JSON.stringify(web3Auth.currentChain)}</pre>
      </div>
    </div>
  );
}
