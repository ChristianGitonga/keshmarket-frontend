"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";
import PredictionMarketArtifact from "../contracts/PredictionMarket.json";
import MockUSDCArtifact from "../contracts/MockUSDC.json";
import { PREDICTION_MARKET_ADDRESS, MOCK_USDC_ADDRESS } from "../contracts/addresses";

export function PredictionPanel() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("50");

  const { data: question } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "question",
  });

  const { data: adminAddress } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "admin",
  });

  const isAdmin = address && adminAddress && address.toLowerCase() === (adminAddress as string).toLowerCase();

  const { data: yesPrice } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "getYesPrice",
    query: { refetchInterval: 3000 },
  });

  const { data: noPrice } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "getNoPrice",
    query: { refetchInterval: 3000 },
  });

  const { data: resolved } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "resolved",
    query: { refetchInterval: 3000 },
  });

  const { data: outcome } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "outcome",
    query: { enabled: !!resolved },
  });

  const { data: myYesShares } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "yesShares",
    args: [address],
    query: { enabled: !!address, refetchInterval: 3000 },
  });

  const { data: myNoShares } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PredictionMarketArtifact.abi,
    functionName: "noShares",
    args: [address],
    query: { enabled: !!address, refetchInterval: 3000 },
  });

  const { writeContract: approve, data: approveHash } = useWriteContract();
  const { isLoading: approvePending } = useWaitForTransactionReceipt({ hash: approveHash });

  const { writeContract: buyShares, data: buyHash } = useWriteContract();
  const { isLoading: buyPending } = useWaitForTransactionReceipt({ hash: buyHash });

  const { writeContract: redeem, data: redeemHash } = useWriteContract();
  const { isLoading: redeemPending } = useWaitForTransactionReceipt({ hash: redeemHash });

  const { writeContract: resolveMarket, data: resolveHash } = useWriteContract();
  const { isLoading: resolvePending } = useWaitForTransactionReceipt({ hash: resolveHash });

  const handleApprove = () => {
    const amt = BigInt(Math.floor(Number(amount) * 1e18));
    approve({
      address: MOCK_USDC_ADDRESS as `0x${string}`,
      abi: MockUSDCArtifact.abi,
      functionName: "approve",
      args: [PREDICTION_MARKET_ADDRESS, amt],
      gas: 500000n,
    });
  };

  const handleBuy = (isYes: boolean) => {
    const amt = BigInt(Math.floor(Number(amount) * 1e18));
    buyShares({
      address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
      abi: PredictionMarketArtifact.abi,
      functionName: "buyShares",
      args: [isYes, amt],
      gas: 500000n,
    });
  };

  const handleRedeem = () => {
    redeem({
      address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
      abi: PredictionMarketArtifact.abi,
      functionName: "redeem",
      args: [],
      gas: 500000n,
    });
  };

  const handleResolve = (isYes: boolean) => {
    resolveMarket({
      address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
      abi: PredictionMarketArtifact.abi,
      functionName: "resolveMarket",
      args: [isYes],
      gas: 500000n,
    });
  };

  const formatPct = (val: unknown) => {
    if (val === undefined) return "50.0";
    return ((Number(val as bigint) / 1e18) * 100).toFixed(1);
  };

  const formatShares = (val: unknown) => {
    if (val === undefined) return "0.00";
    return (Number(val as bigint) / 1e18).toFixed(2);
  };

  if (!isConnected) {
    return <p className="text-center text-[#8B9198] font-body">Connect your wallet to trade.</p>;
  }

  const outcomeIsYes = outcome === 1;

  return (
    <div className="w-full max-w-md kesh-card p-6">
      <h3 className="font-display text-sm font-semibold tracking-wide text-[#8B9198] uppercase mb-2">
        Prediction Market
      </h3>
      <p className="text-sm text-[#EDEAE2] font-body mb-5 pb-5 border-b border-[#2A2E33]">
        {(question as string) || "Loading..."}
      </p>

      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-3 rounded bg-[#0F1113] border border-[#1E7F4C]">
          <div className="text-xs text-[#8B9198] font-body mb-1">YES</div>
          <div className="font-mono text-lg text-[#1E7F4C] font-semibold">{formatPct(yesPrice)}%</div>
        </div>
        <div className="flex-1 p-3 rounded bg-[#0F1113] border border-[#A2222E]">
          <div className="text-xs text-[#8B9198] font-body mb-1">NO</div>
          <div className="font-mono text-lg text-[#A2222E] font-semibold">{formatPct(noPrice)}%</div>
        </div>
      </div>

      {(Number(myYesShares) > 0 || Number(myNoShares) > 0) && (
        <div className="mb-5 p-3 rounded bg-[#0F1113] border border-[#2A2E33]">
          <div className="text-xs text-[#8B9198] font-body mb-2">Your Position</div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#8B9198] font-body">YES shares</span>
            <span className="font-mono text-[#1E7F4C]">{formatShares(myYesShares)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8B9198] font-body">NO shares</span>
            <span className="font-mono text-[#A2222E]">{formatShares(myNoShares)}</span>
          </div>
        </div>
      )}

      {resolved ? (
        <div>
          <div className="mb-4 p-3 rounded bg-[#181B1F] border border-[#C9A24B] text-center">
            <span className="font-body text-sm text-[#8B9198]">Market resolved: </span>
            <span className={`font-mono font-semibold ${outcomeIsYes ? "text-[#1E7F4C]" : "text-[#A2222E]"}`}>
              {outcomeIsYes ? "YES" : "NO"}
            </span>
          </div>
          <button
            onClick={handleRedeem}
            disabled={redeemPending}
            className="w-full px-4 py-2.5 font-body text-sm font-medium bg-[#C9A24B] text-[#0F1113] rounded hover:bg-[#dbb35f] transition-colors disabled:opacity-50"
          >
            {redeemPending ? "Redeeming..." : "Redeem Winnings"}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="flex justify-between text-sm mb-2">
              <span className="text-[#8B9198] font-body">Amount</span>
              <span className="font-mono text-[#EDEAE2]">{amount} mUSDC</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 font-mono text-sm bg-[#0F1113] border border-[#2A2E33] rounded text-[#EDEAE2] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>

          <button
            onClick={handleApprove}
            disabled={approvePending}
            className="w-full mb-3 px-4 py-2.5 font-body text-sm font-medium bg-[#181B1F] border border-[#2A2E33] text-[#EDEAE2] rounded hover:border-[#C9A24B] transition-colors disabled:opacity-50"
          >
            {approvePending ? "Approving..." : "1. Approve mUSDC"}
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => handleBuy(true)}
              disabled={buyPending}
              className="flex-1 px-4 py-3 font-body font-semibold bg-[#1E7F4C] hover:bg-[#25955a] text-white rounded transition-colors disabled:opacity-50"
            >
              {buyPending ? "Buying..." : "Buy YES"}
            </button>
            <button
              onClick={() => handleBuy(false)}
              disabled={buyPending}
              className="flex-1 px-4 py-3 font-body font-semibold bg-[#A2222E] hover:bg-[#b8323e] text-white rounded transition-colors disabled:opacity-50"
            >
              {buyPending ? "Buying..." : "Buy NO"}
            </button>
          </div>

          {isAdmin && (
            <div className="mt-5 pt-5 border-t border-[#2A2E33]">
              <div className="text-xs text-[#C9A24B] font-body mb-2 uppercase tracking-wide">
                Admin: Resolve Market
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleResolve(true)}
                  disabled={resolvePending}
                  className="flex-1 px-3 py-2 font-body text-sm bg-[#0F1113] border border-[#1E7F4C] text-[#1E7F4C] rounded hover:bg-[#1E7F4C] hover:text-white transition-colors disabled:opacity-50"
                >
                  {resolvePending ? "Resolving..." : "Resolve YES"}
                </button>
                <button
                  onClick={() => handleResolve(false)}
                  disabled={resolvePending}
                  className="flex-1 px-3 py-2 font-body text-sm bg-[#0F1113] border border-[#A2222E] text-[#A2222E] rounded hover:bg-[#A2222E] hover:text-white transition-colors disabled:opacity-50"
                >
                  {resolvePending ? "Resolving..." : "Resolve NO"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}