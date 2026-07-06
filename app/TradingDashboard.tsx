"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";
import MockUSDCArtifact from "../contracts/MockUSDC.json";
import VaultArtifact from "../contracts/Vault.json";
import { MOCK_USDC_ADDRESS, VAULT_ADDRESS } from "../contracts/addresses";

export function TradingDashboard() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("100");

  const { data: walletBalance } = useReadContract({
    address: MOCK_USDC_ADDRESS as `0x${string}`,
    abi: MockUSDCArtifact.abi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: !!address },
  });

  const { data: vaultBalance } = useReadContract({
    address: VAULT_ADDRESS as `0x${string}`,
    abi: VaultArtifact.abi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: !!address },
  });

  const { writeContract: faucet, data: faucetHash } = useWriteContract();
  const { isLoading: faucetPending } = useWaitForTransactionReceipt({ hash: faucetHash });

  const { writeContract: approve, data: approveHash } = useWriteContract();
  const { isLoading: approvePending } = useWaitForTransactionReceipt({ hash: approveHash });

  const { writeContract: deposit, data: depositHash } = useWriteContract();
  const { isLoading: depositPending } = useWaitForTransactionReceipt({ hash: depositHash });

  const handleFaucet = () => {
    faucet({
      address: MOCK_USDC_ADDRESS as `0x${string}`,
      abi: MockUSDCArtifact.abi,
      functionName: "faucet",
      args: [1000n * 10n ** 18n],
    });
  };

  const handleApproveAndDeposit = () => {
    const amount = BigInt(Math.floor(Number(depositAmount) * 1e18));
    approve({
      address: MOCK_USDC_ADDRESS as `0x${string}`,
      abi: MockUSDCArtifact.abi,
      functionName: "approve",
      args: [VAULT_ADDRESS, amount],
    });
  };

  const handleDeposit = () => {
    const amount = BigInt(Math.floor(Number(depositAmount) * 1e18));
    deposit({
      address: VAULT_ADDRESS as `0x${string}`,
      abi: VaultArtifact.abi,
      functionName: "deposit",
      args: [amount],
    });
  };

  if (!isConnected) {
    return <p className="text-center text-[#8B9198] font-body">Connect your wallet to trade.</p>;
  }

  const formatBalance = (val: unknown) => {
    if (val === undefined) return "0.00";
    return (Number(val as bigint) / 1e18).toFixed(2);
  };

  return (
    <div className="w-full max-w-md kesh-card p-6">
      <h3 className="font-display text-sm font-semibold tracking-wide text-[#8B9198] uppercase mb-4">
        Collateral
      </h3>

      <div className="flex justify-between mb-2">
        <span className="text-sm text-[#8B9198] font-body">Wallet mUSDC</span>
        <span className="font-mono text-[#EDEAE2]">{formatBalance(walletBalance)}</span>
      </div>
      <div className="flex justify-between mb-5 pb-5 border-b border-[#2A2E33]">
        <span className="text-sm text-[#8B9198] font-body">Vault Balance</span>
        <span className="font-mono text-[#C9A24B]">{formatBalance(vaultBalance)}</span>
      </div>

      <button
        onClick={handleFaucet}
        disabled={faucetPending}
        className="w-full mb-3 px-4 py-2.5 font-body text-sm font-medium bg-[#1E7F4C] text-white rounded hover:bg-[#25955a] transition-colors disabled:opacity-50"
      >
        {faucetPending ? "Minting..." : "Get 1000 Test mUSDC"}
      </button>

      <input
        type="number"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        className="w-full mb-3 px-3 py-2.5 font-mono text-sm bg-[#0F1113] border border-[#2A2E33] rounded text-[#EDEAE2] focus:outline-none focus:border-[#C9A24B]"
        placeholder="Amount to deposit"
      />

      <div className="flex gap-2">
        <button
          onClick={handleApproveAndDeposit}
          disabled={approvePending}
          className="flex-1 px-4 py-2.5 font-body text-sm font-medium bg-[#181B1F] border border-[#2A2E33] text-[#EDEAE2] rounded hover:border-[#C9A24B] transition-colors disabled:opacity-50"
        >
          {approvePending ? "Approving..." : "1. Approve"}
        </button>

        <button
          onClick={handleDeposit}
          disabled={depositPending}
          className="flex-1 px-4 py-2.5 font-body text-sm font-medium bg-[#C9A24B] text-[#0F1113] rounded hover:bg-[#dbb35f] transition-colors disabled:opacity-50"
        >
          {depositPending ? "Depositing..." : "2. Deposit"}
        </button>
      </div>
    </div>
  );
}