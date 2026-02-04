import type { Metadata } from "next";
import {
  Google_Sans,
  Jost,
  Raleway,
  Plus_Jakarta_Sans,
  Urbanist,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/providers";

// poppins raleway outfit bak
const outfit = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maresans",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased min-h-dvh flex flex-col bg-accent`}
      >
        <Providers>{children}</Providers>
        <Toaster richColors theme="light" position="top-center" />
      </body>
    </html>
  );
}
