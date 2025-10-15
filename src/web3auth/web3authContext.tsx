import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
if (!clientId) {
  throw new Error(
    "Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID in environment variables",
  );
}

if (!process.env.NEXT_PUBLIC_ENV_KIND) {
  throw new Error("Missing NEXT_PUBLIC_ENV_KIND in environment variables");
}
if (!["testnet", "mainnet"].includes(process.env.NEXT_PUBLIC_ENV_KIND)) {
  throw new Error("NEXT_PUBLIC_ENV_KIND must be either 'testnet' or 'mainnet'");
}

const envKind = process.env.NEXT_PUBLIC_ENV_KIND;
const web3AuthNetwork =
  envKind === "mainnet"
    ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
    : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;

const web3AuthOptions: Web3AuthOptions = { clientId, web3AuthNetwork };

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
};

export default web3AuthContextConfig;
