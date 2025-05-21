import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Split Billz | Split Expenses Easily with Friends",
  description: "Split Billz is a modern web application that simplifies the process of splitting shared expenses among users. Upload receipts, detail expense items, assign them to specific participants, and manage payments easily.",
  keywords: "bill splitting, expense sharing, split bills, shared expenses, receipt upload, payment tracking",
  authors: [
    {
      name: "Split Billz Team",
    },
  ],
  openGraph: {
    title: "Split Billz | Split Expenses Easily with Friends",
    description: "Simplify the process of splitting shared expenses among friends and family",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
