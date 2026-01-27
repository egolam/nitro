"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function LoginButton() {
  const { data: session } = authClient.useSession();

  if (session) {
    return;
  }

  return (
    <Link
      href="/giris-yap"
      className="flex items-center font-normal text-sm justify-center rounded h-8 text-muted bg-violet-700 px-4 hover:bg-violet-600 transition-colors"
    >
      <span className="">GİRİŞ YAP</span>
      {/* <LuLogIn size={20} /> */}
    </Link>
  );
}
