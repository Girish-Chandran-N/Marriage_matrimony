import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premly Matchmaking",
  description: "Trusted career-focused matrimonial platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Premly Matchmaking",
  },
  openGraph: {
    title: "Premly Matchmaking",
    description: "Find your perfect life partner. The trusted, career-focused matrimonial platform.",
    url: "https://premly.com", // You can update this to the actual domain later
    siteName: "Premly Matchmaking",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Premly Matchmaking Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premly Matchmaking",
    description: "Trusted career-focused matrimonial platform for professionals.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-[#09090b] lg:bg-slate-50`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className="hidden md:block">
            <Navbar />
          </div>
          <main className="flex-1 flex flex-col w-full pb-[70px] md:pb-0">
            {children}
          </main>
          <div className="hidden md:block">
            <Footer />
          </div>
          <MobileBottomNav />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
