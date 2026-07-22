"use client";

import Link from "next/link";
import { PredictionPanel } from "../../PredictionPanel";

export default function PredictionDetailPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-8 py-16">
      <div className="w-full max-w-md mb-6">
        <Link href="/predictions" className="text-sm text-[#8B9198] hover:text-[#C9A24B] font-body transition-colors">
          ← All markets
        </Link>
      </div>

      <div className="w-full flex flex-col items-center gap-6">
        <PredictionPanel />
      </div>
    </main>
  );
}