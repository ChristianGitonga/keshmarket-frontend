"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#181B1F] border border-[#2A2E33]">
          <span className="pulse-dot" />
          <span className="font-mono text-sm text-[#EDEAE2]">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </span>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1.5 text-sm font-body text-[#8B9198] border border-[#2A2E33] rounded hover:border-[#A2222E] hover:text-[#A2222E] transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="px-4 py-2 text-sm font-body font-medium bg-[#C9A24B] text-[#0F1113] rounded hover:bg-[#dbb35f] transition-colors"
        >
          Connect Wallet
        </button>
      ))}
    </div>
  );
}