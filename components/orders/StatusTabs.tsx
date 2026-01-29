"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStatusStore } from "@/store/useStatusStore";

export function StatusTabs() {
  const { status, setStatus } = useStatusStore();
  return (
    <Tabs
      defaultValue="all"
      value={status}
      onValueChange={(val) => setStatus(val as any)}
      className="items-end border rounded sm:w-72"
    >
      <TabsList className="grid w-full grid-cols-3 sm:max-w-100 bg-background">
        <TabsTrigger value="all" className="rounded-xs">
          TÜMÜ
        </TabsTrigger>
        <TabsTrigger value="valid" className="rounded-xs">
          GEÇERLİ
        </TabsTrigger>
        <TabsTrigger value="pending" className="rounded-xs">
          BEKLEYEN
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
