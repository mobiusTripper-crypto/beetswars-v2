import { Chain, configureChains, createClient } from "wagmi";

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
    default: {
      http: ["https://rpc.ftm.tools/"],
    },
  },
  blockExplorers: {
    default: { name: "FtmScan", url: "https://ftmscan.com" },
  },
  testnet: false,
};

export const { chains, provider, webSocketProvider } = configureChains(
  [fantomChain],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "beetswars live",
  chains,
});

export const client = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider,
});
