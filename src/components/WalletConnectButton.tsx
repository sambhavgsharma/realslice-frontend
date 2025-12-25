"use client";

import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnectButton() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ConnectButton.Custom>
      {(props: any) => (
        !props.account ? (
          <button onClick={props.openConnectModal} className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition">
            Connect Wallet
          </button>
        ) : (
          <div className="px-5 py-2 rounded-full bg-green-500/20 border border-green-500/50 text-green-200 font-semibold">
            ✓ Connected
          </div>
        )
      )}
    </ConnectButton.Custom>
  );
}

export function WalletConnectButtonMobile() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />;
}
