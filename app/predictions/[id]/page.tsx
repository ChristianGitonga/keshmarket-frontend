"use client";

import Link from "next/link";
import { PredictionPanel } from "../../PredictionPanel";

export default function PredictionDetailPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 sm:px-8 py-10 sm:py-16">
      <div className="w-full max-w-md mb-6">
        <Link href="/predictions" className="text-sm text-[#8B9198] hover:text-[#C9A24B] font-body transition-colors">
          ← All markets
        </Link>
      </div>

      <div className="w-full flex flex-col items-center gap-4 sm:gap-6 fade-in">
        <PredictionPanel />
      </div>
    </main>
  );
}