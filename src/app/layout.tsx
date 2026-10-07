import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeInit } from "@/components/theme/theme-toggle";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PH Healthcare",
  description:
    "Book an approved doctor, pay with bKash, and keep prescriptions with the visit.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <Providers>
        <body className="min-h-full flex flex-col">
          <ThemeInit />
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
