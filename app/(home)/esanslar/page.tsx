import { Grid2X2, Mars, MoveRight, Venus, VenusAndMars } from "lucide-react";
import Link from "next/link";

export default function EsanslarPage() {
  return (
    <section className="flex flex-col gap-4 max-w-5xl flex-1 pt-4">
      <header className="flex justify-between items-center">
        <h3 className="text-violet-700 leading-none font-medium">ESANSLAR</h3>
      </header>
      <nav>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <li>
            <Link
              href="/"
              className="flex items-center gap-4 h-16 border bg-violet-700/10 text-violet-700 px-4 rounded transition-colors group"
            >
              <Grid2X2 />
              <span className="flex-1 group-hover:underline">TÜMÜ</span>
              <MoveRight className="-translate-x-1 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
          <li>
            <Link
              href="/esanslar/erkek"
              className="flex items-center gap-4 h-16 border bg-blue-700/10 text-blue-700 px-4 rounded transition-colors group"
            >
              <Mars />
              <span className="flex-1 group-hover:underline">ERKEK</span>
              <MoveRight className="-translate-x-1 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
          <li>
            <Link
              href="/esanslar/kadin"
              className="flex items-center gap-4 h-16 border bg-pink-700/10 text-pink-700 px-4 rounded transition-colors group"
            >
              <Venus />
              <span className="flex-1 group-hover:underline">KADIN</span>
              <MoveRight className="-translate-x-1 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
          <li>
            <Link
              href="/esanslar/unisex"
              className="flex items-center gap-4 h-16 border bg-neutral-700/10 text-neutral-700 px-4 rounded transition-colors group"
            >
              <VenusAndMars />
              <span className="flex-1 group-hover:underline">UNISEX</span>
              <MoveRight className="-translate-x-1 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
