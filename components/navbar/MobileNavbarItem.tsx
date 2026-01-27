"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";

interface NavbarProps {
  href: string;
  title: string;
  icon: JSX.Element;
}

export function MobileNavbarItem({ href, title, icon }: NavbarProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        "flex-1 h-full flex flex-col gap-1 items-center text-muted-foreground justify-center text-xs [&_svg]:size-4 transition-colors",
        pathname === href ? "text-violet-700" : "hover:text-violet-500",
      )}
    >
      {icon}
      {title}
    </Link>
  );
}
