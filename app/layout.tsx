import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ConnectWallet } from "./ConnectWallet";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeshMarket",
  description: "Leveraged trading for Kenyan markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#0F1113] text-[#EDEAE2] font-body antialiased">
        <Providers>
          <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[#2A2E33]">
            <Link href="/" className="text-xl font-display font-bold tracking-tight text-[#EDEAE2]">
              Kesh<span className="text-[#C9A24B]">Market</span>
            </Link>
            <ConnectWallet />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}