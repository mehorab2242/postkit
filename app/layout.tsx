import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";

import { Footer } from "@/components/shell/Footer";
import { Analytics } from "@/components/shell/Analytics";
import { ConsentBanner } from "@/components/shell/ConsentBanner";
import { Header } from "@/components/shell/Header";
import { SITE_URL } from "@/lib/tools";
import "./globals.css";

/** Two families, two font files — that is the whole budget. */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Postkit — Free browser tools for creators",
  description:
    "Split carousels, plan your grid, crop a profile picture and more. Every tool runs in your browser — nothing is uploaded.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
