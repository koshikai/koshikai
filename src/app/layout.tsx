import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Next.js",
  description: "Personal portfolio built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        {/* Global scroll-reveal effects */}
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
