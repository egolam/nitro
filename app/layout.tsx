import type { Metadata } from "next";
import { Google_Sans, Google_Sans_Code, Jost, Outfit, Raleway } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/providers";

// poppins raleway outfit bak
const outfit = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        <Toaster richColors theme="light" position="top-center"/>
      </body>
    </html>
  );
}
