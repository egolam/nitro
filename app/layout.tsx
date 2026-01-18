import type { Metadata } from "next";
import {
  Abel,
  Exo,
  Kedebideri,
  Lexend,
  Quicksand,
  Rajdhani,
  Urbanist,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const rajd = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "300"],
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
        className={`${rajd.className} antialiased min-h-dvh flex flex-col font-medium`}
      >
        {children}
        <Toaster richColors theme="light" />
      </body>
    </html>
  );
}
