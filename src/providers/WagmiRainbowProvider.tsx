"use client";
import React from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, configureChains } from "wagmi";
import { createConfig, http } from "@wagmi/core";
import { mainnet, goerli } from "wagmi/chains";
// import { publicProvider } from "wagmi/providers/public";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "023273df73ec4ca74113daab45e545ef";

if (!projectId && process.env.NODE_ENV !== "production") {
  console.warn(
    "[WagmiRainbowProvider] No NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID provided. WalletConnect v2 requires a projectId."
  );
}

// configure chains and public client (wagmi v2)
const chains = [mainnet, goerli] as const;

const { connectors } = getDefaultWallets({
  appName: "RealSlice",
  chains,
  projectId,
});

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
  },
  connectors: connectors,
});

export default function WagmiRainbowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
