/* eslint-disable @typescript-eslint/no-unused-vars */

// TODO: remove unused vars if not needed

import type { Chain } from "wagmi";
import { configureChains, createClient } from "wagmi";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const fantomChain: Chain = {
  id: 250,
  name: "Fantom",
  network: "fantom",
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  rpcUrls: {
    public: { http: ["https://rpc.ftm.tools/"] },
    default: { http: ["https://rpc.ftm.tools/"] },
  },
  blockExplorers: {
    default: { name: "FtmScan", url: "https://ftmscan.com" },
  },
  testnet: false,
};

const sonicChain: Chain = {
  id: 146,
  name: "Sonic",
  network: "sonic",
  nativeCurrency: {
    decimals: 18,
    name: "Sonic",
    symbol: "S",
  },
  rpcUrls: {
    public: { http: ["https://rpc.soniclabs.com"] },
    default: { http: ["https://rpc.soniclabs.com"] },
  },
  blockExplorers: {
    default: { name: "SonicScan", url: "https://sonicscan.org/" },
  },
  testnet: false,
};

// export const { chains, provider, webSocketProvider } = configureChains(
//   [fantomChain, sonicChain],
//   [publicProvider()]
// );
export const { chains, provider, webSocketProvider } = configureChains(
  [sonicChain],
  [publicProvider()]
);
// export const { chains, provider, webSocketProvider } = configureChains(
//   [fantomChain],
//   [publicProvider()]
// );

const { connectors } = getDefaultWallets({
  appName: "beetswars live",
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'dummy',
});

export const client = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider,
});
