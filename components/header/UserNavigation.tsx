"use client";

import Link from "next/link";
import { User, Heart, ShoppingCart } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";

const userLinks = [
  { href: "/profil/favorilerim", label: "Favorilerim", icon: Heart },
  { href: "/taleplerim", label: "Taleplerim", icon: FaShoppingCart },
  { href: "/profil", label: "Hesabım", icon: User },
];

export function UserNavigation() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav className=" items-center gap-1 hidden sm:flex">
      {userLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "text-violet-700 bg-violet-50"
                : "text-muted-foreground",
            )}
          >
            <Icon className={cn("size-4 fill-current")} />
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
