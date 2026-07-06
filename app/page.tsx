import { ConnectWallet } from "./ConnectWallet";
import { TradingDashboard } from "./TradingDashboard";
import { TradePanel } from "./TradePanel";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 font-body">
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#2A2E33]">
        <h1 className="text-xl font-display font-bold tracking-tight text-[#EDEAE2]">
          Kesh<span className="text-[#C9A24B]">Market</span>
        </h1>
        <ConnectWallet />
      </header>

      <main className="flex flex-1 flex-col items-center px-8 py-16">
        <div className="max-w-xl text-center mb-10">
          <h2 className="text-3xl font-display font-semibold text-[#EDEAE2] mb-3">
            Leveraged Trading for Kenyan Markets
          </h2>
          <p className="text-lg text-[#8B9198]">
            Connect your wallet to start trading perpetual contracts.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-6">
          <TradingDashboard />
          <TradePanel />
        </div>
      </main>
    </div>
  );
}