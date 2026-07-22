"use client";

import Link from "next/link";
import { useReadContract } from "wagmi";
import PredictionMarketArtifact from "../../contracts/PredictionMarket.json";
import { PREDICTION_MARKETS } from "../../contracts/addresses";

function PredictionCard({ market }: { market: (typeof PREDICTION_MARKETS)[number] }) {
  const { data: question } = useReadContract({
    address: market.address as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "question",
  });

  const { data: yesPrice } = useReadContract({
    address: market.address as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "getYesPrice",
    query: { refetchInterval: 5000 },
  });

  const formatPct = (val: unknown) => {
    if (val === undefined) return "50.0";
    return ((Number(val as bigint) / 1e18) * 100).toFixed(1);
  };

  return (
    <Link
      href={`/predictions/${market.id}`}
      className="kesh-card p-5 sm:p-6 flex flex-col hover:border-[#C9A24B] transition-colors"
    >
      <span className="text-sm text-[#EDEAE2] font-body mb-4">
        {(question as string) || "Loading..."}
      </span>
      <div className="flex gap-3 mb-4">
        <div className="flex-1 p-2 rounded bg-[#0F1113] border border-[#1E7F4C] text-center">
          <div className="text-xs text-[#8B9198] font-body">YES</div>
          <div className="font-mono text-[#1E7F4C] font-semibold">{formatPct(yesPrice)}%</div>
        </div>
        <div className="flex-1 p-2 rounded bg-[#0F1113] border border-[#A2222E] text-center">
          <div className="text-xs text-[#8B9198] font-body">NO</div>
          <div className="font-mono text-[#A2222E] font-semibold">
            {(100 - Number(formatPct(yesPrice))).toFixed(1)}%
          </div>
        </div>
      </div>
      <span className="text-sm font-body font-medium text-[#C9A24B]">Trade →</span>
    </Link>
  );
}

export default function PredictionsPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 sm:px-8 py-10 sm:py-16">
      <div className="max-w-xl text-center mb-10 fade-in">
        <h2 className="text-2xl font-display font-semibold text-[#EDEAE2] mb-2">
          Prediction Markets
        </h2>
        <p className="text-[#8B9198] font-body">
          Bet on real-world outcomes with market-driven odds.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {PREDICTION_MARKETS.map((market, i) => (
          <div key={market.id} className={i < 2 ? "fade-in-delay-1" : "fade-in-delay-2"}>
            <PredictionCard market={market} />
          </div>
        ))}
      </div>
    </main>
  );
}