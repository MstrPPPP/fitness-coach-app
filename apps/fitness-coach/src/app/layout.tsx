import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@repo/ui/styles/globals";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitness Coach | Your Personal Fitness Guide",
  description:
    "Get personalised fitness coaching, workout advice, nutrition guidance, and motivation from your AI-powered fitness coach.",
  keywords: [
    "fitness",
    "coach",
    "workout",
    "nutrition",
    "exercise",
    "health",
    "gym",
    "training",
  ],
  authors: [{ name: "Fitness Coach App" }],
  openGraph: {
    title: "Fitness Coach | Your Personal Fitness Guide",
    description:
      "Get personalised fitness coaching and guidance from your AI-powered fitness coach.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
