import { useWeb3Auth } from "@web3auth/modal/react";

export function useWeb3AuthLogs() {
  const { web3Auth, isConnected, isInitializing, provider, status, initError } =
    useWeb3Auth();

  if (isConnected) {
    // User is connected
    console.log("Connected with provider:", provider);
  }
  if (isInitializing) {
    // Web3Auth is initializing
    console.log("Web3Auth is initializing");
  }
  if (provider) {
    // Web3Auth provider is connected
    console.log("Web3Auth provider is connected");
  }
  if (status) {
    // Web3Auth status
    console.log("Web3Auth status:", status);
  }
  if (initError) {
    // Web3Auth initialization error
    console.log("Web3Auth initialization error:", initError);
  }
}
