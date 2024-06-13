import type { Metadata } from "next";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Provider from "@/providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Honest Opinions",
  description: " - Where Anonymity meets Authenticity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <Provider>{children}</Provider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
