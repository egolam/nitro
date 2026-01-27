"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Check, Filter } from "lucide-react";

export function TagFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mapping: URL Value <-> Internal Value
  const tagMapping: Record<string, string> = {
    new: "yeni",
    delux: "delux",
  };

  const reverseMapping: Record<string, string> = {
    yeni: "new",
    delux: "delux",
  };

  const currentUrlTags = searchParams.get("filtre")?.split(",") || [];
  const currentInternalTags = currentUrlTags.map((t) => reverseMapping[t] || t);

  const [optimisticTags, setOptimisticTags] =
    useState<string[]>(currentInternalTags);

  useEffect(() => {
    setOptimisticTags(currentInternalTags);
  }, [searchParams]); // Sync with URL changes

  const toggleTag = useCallback(
    (internalTag: string) => {
      // Optimistic update
      setOptimisticTags((prev) => {
        const next = new Set(prev);
        if (next.has(internalTag)) {
          next.delete(internalTag);
        } else {
          next.add(internalTag);
        }
        return Array.from(next);
      });

      const params = new URLSearchParams(searchParams.toString());
      const newInternalTags = new Set(optimisticTags); // Use current state base calculation is slightly riskier if distinct from rendered, but usually safe here or better use functional update logic repeated.

      // Re-calculate for URL based on the *intended* change to ensure consistency with the optimistic update
      // Actually simpler: Calculate the *new* list first, then update both state and URL.
      let nextTags = [...optimisticTags];
      if (nextTags.includes(internalTag)) {
        nextTags = nextTags.filter((t) => t !== internalTag);
      } else {
        nextTags.push(internalTag);
      }

      // Update State (redundant if using setOptimisticTags above but we need variable for URL)
      // Let's adhere to the logic:

      const newUrlTags = nextTags.map((t) => tagMapping[t]).filter(Boolean);

      if (newUrlTags.length > 0) {
        params.set("filtre", newUrlTags.join(","));
      } else {
        params.delete("filtre");
      }

      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [searchParams, optimisticTags, router, pathname, tagMapping],
  );

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filtrele:</span>
      </div>
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleTag("new")}
          className={cn(
            "transition-colors border-dashed hover:cursor-pointer rounded bg-background! flex-1",
            optimisticTags.includes("new") &&
              "bg-violet-50 border-violet-700 text-violet-700 border-solid hover:bg-violet-100 hover:text-violet-800",
          )}
        >
          <div
            className={cn(
              "w-4 h-4 mr-2 border rounded flex items-center justify-center transition-colors",
              optimisticTags.includes("new")
                ? "bg-violet-700 border-violet-700 text-white"
                : "border-muted-foreground/30",
            )}
          >
            {optimisticTags.includes("new") && <Check className="w-3 h-3" />}
          </div>
          YENİ
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleTag("delux")}
          className={cn(
            "transition-colors border-dashed hover:cursor-pointer rounded bg-background! flex-1",
            optimisticTags.includes("delux") &&
              "bg-violet-50 border-violet-700 text-violet-700 border-solid hover:bg-violet-100 hover:text-violet-800",
          )}
        >
          <div
            className={cn(
              "w-4 h-4 mr-2 border rounded flex items-center justify-center transition-colors",
              optimisticTags.includes("delux")
                ? "bg-violet-700 border-violet-700 text-white"
                : "border-muted-foreground/30",
            )}
          >
            {optimisticTags.includes("delux") && <Check className="w-3 h-3" />}
          </div>
          DELUX
        </Button>
      </div>
    </div>
  );
}
