"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useTransition } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "../ui/input";
import { Loader2, Search } from "lucide-react";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Only update if the value changed relative to URL to avoid redundant pushes (though router.push handles some dedup)
    // Also consider if user is just landing or typing.
    // The debounce hook ensures this runs 500ms after typing stops.
    const currentQ = searchParams.get("q") || "";

    // Logic: Only search if >= 3 chars. If < 3, treat as empty (clear search).
    const targetQuery = debouncedQuery.length >= 3 ? debouncedQuery : "";

    if (targetQuery !== currentQ) {
      startTransition(() => {
        router.push(pathname + "?" + createQueryString("q", targetQuery));
      });
    }
  }, [debouncedQuery, router, pathname, createQueryString, searchParams]);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Ürün ara..."
        className="pl-8 w-full bg-background! text-sm rounded pr-8"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isPending && (
        <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
      )}
    </div>
  );
}
