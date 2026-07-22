"use client";

import { useParams } from "next/navigation";
import { TradePanel } from "../../TradePanel";
import { TradingDashboard } from "../../TradingDashboard";
import { LiquidationHeatmap } from "../../LiquidationHeatmap";
import { MARKETS } from "../../../contracts/addresses";
import Link from "next/link";

export default function PerpetualDetailPage() {
  const params = useParams();
  const marketId = params.id as string;
  const market = MARKETS.find((m) => m.id === marketId);

  if (!market) {
    return (
      <main className="flex flex-1 flex-col items-center px-8 py-16">
        <p className="text-[#8B9198] font-body">Market not found.</p>
        <Link href="/perpetuals" className="text-[#C9A24B] font-body mt-4">
          ← Back to markets
        </Link>
      </main>
    );
  }

  return (
   <main className="flex flex-1 flex-col items-center px-4 sm:px-8 py-10 sm:py-16">
      <div className="w-full max-w-md mb-6">
        <Link href="/perpetuals" className="text-sm text-[#8B9198] hover:text-[#C9A24B] font-body transition-colors">
          ← All markets
        </Link>
      </div>

     <div className="w-full flex flex-col items-center gap-4 sm:gap-6 fade-in">
        <TradingDashboard />
        <TradePanel initialMarketId={market.id} />
        <LiquidationHeatmap marketAddress={market.address as `0x${string}`} />
      </div>
    </main>
  );
}