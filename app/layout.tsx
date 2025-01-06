import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/global/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "@/components/ui/toaster";
import AppWalletProvider from "@/components/AppWalletProvider";
import Footer from "@/components/global/footer";
import { SessionProvider } from "next-auth/react";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bounty Quest",
  description: "Created for Solana Hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <AppWalletProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="min-h-screen pt-16">{children}</main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </AppWalletProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
