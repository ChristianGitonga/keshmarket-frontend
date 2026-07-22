import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-16">
      <div className="max-w-xl text-center mb-14">
        <h2 className="text-3xl font-display font-semibold text-[#EDEAE2] mb-3">
          Leveraged Trading for Kenyan Markets
        </h2>
        <p className="text-lg text-[#8B9198]">
          Choose a market to get started.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/perpetuals"
          className="kesh-card p-8 flex flex-col items-start hover:border-[#C9A24B] transition-colors group"
        >
          <span className="text-xs font-body text-[#8B9198] uppercase tracking-wide mb-3">
            Leverage · 1x–20x
          </span>
          <h3 className="font-display text-2xl font-semibold text-[#EDEAE2] mb-2">
            Perpetual Contracts
          </h3>
          <p className="text-sm text-[#8B9198] font-body mb-6">
            Trade synthetic Kenyan equities with leverage, live PnL, and liquidations.
          </p>
          <span className="mt-auto text-sm font-body font-medium text-[#C9A24B] group-hover:underline">
            View Markets →
          </span>
        </Link>

        <Link
          href="/predictions"
          className="kesh-card p-8 flex flex-col items-start hover:border-[#C9A24B] transition-colors group"
        >
          <span className="text-xs font-body text-[#8B9198] uppercase tracking-wide mb-3">
            Binary Outcomes
          </span>
          <h3 className="font-display text-2xl font-semibold text-[#EDEAE2] mb-2">
            Prediction Markets
          </h3>
          <p className="text-sm text-[#8B9198] font-body mb-6">
            Bet YES or NO on real-world outcomes with live, market-driven odds.
          </p>
          <span className="mt-auto text-sm font-body font-medium text-[#C9A24B] group-hover:underline">
            View Markets →
          </span>
        </Link>
      </div>
    </main>
  );
}