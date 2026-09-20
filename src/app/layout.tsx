import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GFL — Global Farming League",
  description:
    "Unlock the ultimate Clash of Clans progression strategy. Join 135+ active clans participating in synchronized farming wars with guaranteed massive loot payouts every 48 hours.",
  keywords: [
    "GFL",
    "Global Farming League",
    "Clash of Clans",
    "farming wars",
    "clan wars",
    "cooperative gaming",
  ],
  icons: {
    icon: "/assets/gfl-logo.png",
  },
  openGraph: {
    title: "GFL — Global Farming League",
    description:
      "Cooperative Clash of Clans clan war community. 135+ clans, synchronized farming wars, massive loot payouts every 48 hours.",
    siteName: "Global Farming League",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
