"use client";

import Link from "next/link";
import {
  FaAddressCard,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaComment,
} from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";
import { LogoutButton } from "../auth/LogoutButton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const profileNav = [
  {
    id: 0,
    href: "/profil/uyelik-bilgilerim",
    title: "ÜYELİK BİLGİLERİM",
    icon: <FaAddressCard />,
  },
  {
    id: 1,
    href: "/profil/adreslerim",
    title: "ADRESLERİM",
    icon: <FaMapMarkerAlt />,
  },
  { id: 2, href: "/taleplerim", title: "TALEPLERİM", icon: <FaShoppingCart /> },
  {
    id: 5,
    href: "/profil/gecmis-siparislerim",
    title: "GEÇMİŞ SİPARİŞLERİM",
    icon: <FaClock />,
  },
  {
    id: 3,
    href: "/favorilerim",
    title: "FAVORİLERİM",
    icon: <MdFavorite />,
  },
  {
    id: 4,
    href: "/profil/yorumlarim",
    title: "YORUMLARIM",
    icon: <FaComment />,
  },
];

export function ProfileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border rounded overflow-hidden bg-background">
      <h2 className="font-medium text-violet-700 leading-none p-4">PROFİL</h2>
      <ul className="grid grid-cols-1 text-sm border-t p-2 gap-1">
        {profileNav.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-4 h-9 px-4 rounded text-muted-foreground transition-colors",
                {
                  "bg-violet-700 text-muted": pathname.startsWith(item.href),
                  "hover:bg-accent hover:text-accent-foreground":
                    pathname !== item.href,
                },
              )}
            >
              {item.icon} 
              {item.title}
            </Link>
          </li>
        ))}
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
}
