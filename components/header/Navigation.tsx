"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "TÜMÜ", value: "all" },
  { href: "/esanslar/erkek", label: "ERKEK", value: "male" },
  { href: "/esanslar/kadin", label: "KADIN", value: "female" },
  { href: "/esanslar/unisex", label: "UNISEX", value: "unisex" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex items-center gap-6 h-full">
      {links.map((link) => {
        let isActive = false;
        if (link.href === "/") {
          isActive = pathname === "/";
        } else {
          isActive = pathname.startsWith(link.href);
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm transition-colors h-full flex items-center",
              isActive
                ? "text-violet-700"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
