import Link from "next/link";
import { LuLogIn } from "react-icons/lu";

export function Header() {
  return (
    <header className="px-4 h-16             flex items-center justify-between border-t-4 border-t-violet-700">
      <h1 className="text-2xl text-violet-700 leading-none">
        <Link href="/">MARESANS</Link>
      </h1>
      <nav className="h-8 flex">
        <ul className="flex items-center gap-2">
          <li className="flex items-center justify-center">
            <Link
              href="/giris-yap"
              className="text-violet-700 flex items-center justify-center"
            >
              <span className="">GİRİŞ YAP</span>
              <LuLogIn size={20} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
