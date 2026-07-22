"use client";

import Link from "next/link";
import { useReadContract } from "wagmi";
import PerpMarketArtifact from "../../contracts/PerpMarket.json";
import { MARKETS } from "../../contracts/addresses";

function MarketCard({ market }: { market: (typeof MARKETS)[number] }) {
  const { data: markPrice } = useReadContract({
    address: market.address as `0x${string}`,
    abi: PerpMarketArtifact.abi,
    functionName: "getMarkPrice",
    query: { refetchInterval: 5000 },
  });

  const formatUsd = (val: unknown) => {
    if (val === undefined) return "—";
    return (Number(val as bigint) / 1e18).toFixed(2);
  };

  return (
    <Link
      href={`/perpetuals/${market.id}`}
     className="kesh-card p-5 sm:p-6 flex flex-col hover:border-[#C9A24B] transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-display font-semibold text-[#EDEAE2]">{market.symbol}</span>
        <span className="pulse-dot" />
      </div>
      <span className="text-xs text-[#8B9198] font-body mb-4">{market.label}</span>
      <span className="font-mono text-2xl text-[#EDEAE2]">${formatUsd(markPrice)}</span>
      <span className="mt-4 text-sm font-body font-medium text-[#C9A24B]">Trade →</span>
    </Link>
  );
}

export default function PerpetualsPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 sm:px-8 py-10 sm:py-16">
      <div className="max-w-xl text-center mb-10 fade-in">
        <h2 className="text-2xl font-display font-semibold text-[#EDEAE2] mb-2">
          Perpetual Contracts
        </h2>
        <p className="text-[#8B9198] font-body">
          Select a market to trade with up to 20x leverage.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {MARKETS.map((market, i) => (
          <div key={market.id} className={i === 0 ? "fade-in-delay-1" : "fade-in-delay-2"}>
            <MarketCard market={market} />
          </div>
        ))}
      </div>
    </main>
  );
}