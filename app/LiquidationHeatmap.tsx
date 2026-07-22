"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import PerpMarketArtifact from "../contracts/PerpMarket.json";

type Bucket = {
  priceLabel: string;
  longSize: number;
  shortSize: number;
};

export function LiquidationHeatmap({ marketAddress }: { marketAddress: `0x${string}` }) {
  const publicClient = usePublicClient();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [markPrice, setMarkPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!publicClient) return;

    async function loadHeatmap() {
      setLoading(true);
      try {
        // 1. Find every address that has ever opened a position on this market
        const logs = await publicClient!.getContractEvents({
          address: marketAddress,
          abi: PerpMarketArtifact.abi,
          eventName: "PositionOpened",
          fromBlock: 0n,
          toBlock: "latest",
        });

        const addresses = Array.from(
          new Set(logs.map((log) => (log.args as { user?: string }).user).filter(Boolean))
        ) as `0x${string}`[];

        // 2. Get current mark price
        const price = (await publicClient!.readContract({
          address: marketAddress,
          abi: PerpMarketArtifact.abi,
          functionName: "getMarkPrice",
        })) as bigint;
        const priceNum = Number(price) / 1e18;
        setMarkPrice(priceNum);

        // 3. For each address, check if their position is still open, and if so, get details
        const positions = await Promise.all(
          addresses.map(async (user) => {
            const pos = (await publicClient!.readContract({
              address: marketAddress,
              abi: PerpMarketArtifact.abi,
              functionName: "positions",
              args: [user],
            })) as [boolean, bigint, bigint, bigint, boolean];

            const [isLong, , size, , isOpen] = pos;
            if (!isOpen) return null;

            const liqPrice = (await publicClient!.readContract({
              address: marketAddress,
              abi: PerpMarketArtifact.abi,
              functionName: "getLiquidationPrice",
              args: [user],
            })) as bigint;

            return {
              isLong,
              size: Number(size) / 1e18,
              liqPrice: Number(liqPrice) / 1e18,
            };
          })
        );

        const openPositions = positions.filter(
          (p): p is { isLong: boolean; size: number; liqPrice: number } => p !== null
        );

        // 4. Bucket liquidation prices into 5% bands around the mark price, -30% to +30%
        const bandCount = 12;
        const rangePct = 0.3;
        const newBuckets: Bucket[] = [];

        for (let i = 0; i < bandCount; i++) {
          const bandStartPct = -rangePct + (i * (2 * rangePct)) / bandCount;
          const bandEndPct = -rangePct + ((i + 1) * (2 * rangePct)) / bandCount;
          const bandStart = priceNum * (1 + bandStartPct);
          const bandEnd = priceNum * (1 + bandEndPct);

          let longSize = 0;
          let shortSize = 0;

          for (const p of openPositions) {
            if (p.liqPrice >= bandStart && p.liqPrice < bandEnd) {
              if (p.isLong) longSize += p.size;
              else shortSize += p.size;
            }
          }

          newBuckets.push({
            priceLabel: bandStart.toFixed(0),
            longSize,
            shortSize,
          });
        }

        setBuckets(newBuckets);
      } catch (err) {
        console.error("Failed to load liquidation heatmap:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHeatmap();
    const interval = setInterval(loadHeatmap, 8000);
    return () => clearInterval(interval);
  }, [publicClient, marketAddress]);

  const maxSize = Math.max(...buckets.map((b) => Math.max(b.longSize, b.shortSize)), 1);

  return (
    <div className="w-full max-w-md kesh-card p-6">
      <h3 className="font-display text-sm font-semibold tracking-wide text-[#8B9198] uppercase mb-4">
        Liquidation Heatmap
      </h3>

      {loading ? (
        <p className="text-sm text-[#8B9198] font-body">Scanning positions...</p>
      ) : buckets.every((b) => b.longSize === 0 && b.shortSize === 0) ? (
        <p className="text-sm text-[#8B9198] font-body">No open positions to display yet.</p>
      ) : (
        <div className="flex items-end gap-1 h-40">
          {buckets.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              {b.longSize > 0 && (
                <div
                  className="w-full bg-[#1E7F4C] rounded-t"
                  style={{ height: `${(b.longSize / maxSize) * 100}%` }}
                />
              )}
              {b.shortSize > 0 && (
                <div
                  className="w-full bg-[#A2222E] rounded-t"
                  style={{ height: `${(b.shortSize / maxSize) * 100}%` }}
                />
              )}
              <div className="absolute -bottom-6 text-[9px] font-mono text-[#8B9198] rotate-0 whitespace-nowrap">
                ${b.priceLabel}
              </div>
            </div>
          ))}
        </div>
      )}

      {markPrice && (
        <p className="text-xs text-[#8B9198] font-body mt-8 text-center">
          Current price: <span className="text-[#C9A24B] font-mono">${markPrice.toFixed(2)}</span>
        </p>
      )}

      <div className="flex justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#1E7F4C]" />
          <span className="text-xs text-[#8B9198] font-body">Long liquidations</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#A2222E]" />
          <span className="text-xs text-[#8B9198] font-body">Short liquidations</span>
        </div>
      </div>
    </div>
  );
}