import Link from "next/link";
import { LoginButton } from "./LoginButton";
import { Navigation } from "./Navigation";
import { UserNavigation } from "./UserNavigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Saira } from "next/font/google";
import { cn } from "@/lib/utils";
import { SaleStatusBadge } from "../settings/SaleStatusBadge";

const saira = Saira({
  subsets: ["latin"],
  weight: ["400"],
});

export function Header() {
  return (
    <header className="flex flex-col items-center justify-center border-t-4 border-t-violet-700">
      <div className="w-full flex items-center justify-center bg-background">
        <div className="max-w-7xl px-2 sm:px-0 h-16 w-full flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="text-violet-700 size-8 hover:cursor-pointer rounded hover:text-violet-500" />
            <h1
              className={cn(
                "text-2xl text-violet-700 leading-none font-bold tracking-tight",
                saira.className,
              )}
            >
              <Link href="/">MARESANS</Link>
            </h1>
          </div>
          <Navigation />
          <nav className="flex flex-1 justify-end">
            <ul className="flex items-center gap-2">
              <li className="flex items-center justify-center">
                <UserNavigation />
                <LoginButton />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <SaleStatusBadge />
    </header>
  );
}
