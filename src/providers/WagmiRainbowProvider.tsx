"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "023273df73ec4ca74113daab45e545ef";

if (!projectId && process.env.NODE_ENV !== "production") {
  console.warn(
    "[WagmiRainbowProvider] No NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID provided. WalletConnect v2 requires a projectId."
  );
}

// Create wagmi config
const createWagmiConfig = () => {
  const chains = [mainnet, goerli] as const;

  const { connectors } = getDefaultWallets({
    appName: "RealSlice",
    projectId,
  });

  return createConfig({
    chains,
    connectors,
    transports: {
      [mainnet.id]: http(),
      [goerli.id]: http(),
    },
  });
};

let config: ReturnType<typeof createConfig> | null = null;

export default function WagmiRainbowProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [wagmiConfig, setWagmiConfig] = useState<ReturnType<typeof createConfig> | null>(null);

  useEffect(() => {
    // Initialize config on client-side only
    if (!config) {
      config = createWagmiConfig();
    }
    setWagmiConfig(config);
    setMounted(true);
  }, []);

  // Show nothing until client-side hydration is complete
  if (!mounted || !wagmiConfig) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
