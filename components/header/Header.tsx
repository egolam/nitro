import Link from "next/link";
import { LoginButton } from "./LoginButton";
import { SidebarTrigger } from "../ui/sidebar";
import { Saira } from "next/font/google";
import { cn } from "@/lib/utils";

const saira = Saira({
  subsets: ["latin"],
  weight: ["400"],
});

export function Header() {
  return (
    <header className="px-4 h-16 gap-2 flex items-center border-t-4 border-t-violet-700 border-b shadow-md shadow-foreground/10 bg-background">
      <SidebarTrigger className="text-violet-700 size-8 hover:cursor-pointer rounded hover:text-violet-500" />
      <h1
        className={cn(
          "text-2xl text-violet-700 leading-none font-bold",
          saira.className,
        )}
      >
        <Link href="/">MARESANS</Link>
      </h1>
      <nav className="flex flex-1 justify-end">
        <ul className="flex items-center gap-2">
          <li className="flex items-center justify-center">
            <LoginButton />
          </li>
        </ul>
      </nav>
    </header>
  );
}
