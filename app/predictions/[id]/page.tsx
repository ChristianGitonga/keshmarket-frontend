"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PredictionPanel } from "../../PredictionPanel";
import { PREDICTION_MARKETS } from "../../../contracts/addresses";

export default function PredictionDetailPage() {
  const params = useParams();
  const marketId = params.id as string;
  const market = PREDICTION_MARKETS.find((m) => m.id === marketId);

  if (!market) {
    return (
      <main className="flex flex-1 flex-col items-center px-4 sm:px-8 py-10 sm:py-16">
        <p className="text-[#8B9198] font-body">Market not found.</p>
        <Link href="/predictions" className="text-[#C9A24B] font-body mt-4">
          ← Back to markets
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 sm:px-8 py-10 sm:py-16">
      <div className="w-full max-w-md mb-6">
        <Link href="/predictions" className="text-sm text-[#8B9198] hover:text-[#C9A24B] font-body transition-colors">
          ← All markets
        </Link>
      </div>

      <div className="w-full flex flex-col items-center gap-4 sm:gap-6 fade-in">
        <PredictionPanel marketAddress={market.address as `0x${string}`} />
      </div>
    </main>
  );
}