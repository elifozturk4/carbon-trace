import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/AppContext";
import WalletConnect from "@/components/WalletConnect";

export const metadata: Metadata = {
  title: "Carbon Trace — Stellar dApp",
  description: "Düşük karbonlu aktivitelerini Stellar blok zincirinde kaydet. Yeşil Puan kazan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <AppProvider>
          <WalletConnect />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
