"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const GoBackBTN = () => {
  const router = useRouter();
  return (
    <Button
      variant="link"
      size="icon-sm"
      onClick={() => router.back()}
      className="text-violet-700"
    >
      <ArrowLeft className="size-4.5"/>
      <p className="sr-only">Geri Dön</p>
    </Button>
  );
};
