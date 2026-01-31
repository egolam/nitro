"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const GoBackBTN = () => {
  const router = useRouter();
  return (
    <Button
      variant="link"
      onClick={() => router.back()}
      className="text-violet-700 hover:cursor-pointer size-9"
    >
      <ArrowLeft/>
      <p className="sr-only">Geri Dön</p>
    </Button>
  );
};
