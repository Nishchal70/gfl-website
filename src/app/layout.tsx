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
  metadataBase: new URL("https://gfl-website.vercel.app"),
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
    apple: "/assets/gfl-logo.png",
  },
  openGraph: {
    title: "GFL — Global Farming League",
    description:
      "Cooperative Clash of Clans clan war community. 135+ clans, synchronized farming wars, massive loot payouts every 48 hours.",
    siteName: "Global Farming League",
    type: "website",
    images: [
      {
        url: "/assets/gfl-logo.png",
        width: 1536,
        height: 1024,
        alt: "GFL — Global Farming League",
      },
    ],
  },
};

// JSON-LD structured data so search engines see the organization entity.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Global Farming League",
  alternateName: "GFL",
  url: "https://gfl-website.vercel.app",
  logo: "https://gfl-website.vercel.app/assets/gfl-logo.png",
  description:
    "Clash of Clans farming-war league community. 135+ clans, synchronized farming wars, massive loot payouts every 48 hours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/anton-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
