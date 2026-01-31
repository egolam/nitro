"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { toggleFavorite } from "@/actions/shop/products/toggleFavorite";
import { Button } from "../ui/button";

export function FavoriteButton({
  productId,
  isFavorite: initialIsFavorite,
}: {
  productId: string;
  isFavorite: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [pending, startTransition] = useTransition();

  const queryClient = useQueryClient();

  function onToggle() {
    if (pending) return;
    setIsFavorite((prev) => !prev);

    startTransition(async () => {
      const res = await toggleFavorite(productId);

      if (!res?.success) {
        setIsFavorite((prev) => !prev);
        toast.error("Bir hata oluştu");
      } else {
        queryClient.invalidateQueries({
          queryKey: ["products", null, { favoritesOnly: true }],
        });
      }
    });
  }

  return (
    <Button
      onClick={onToggle}
      disabled={pending}
      className="bg-red-500/10 size-9 rounded text-red-500 hover:bg-red-500/20 hover:cursor-pointer"
    >
      <Heart className={`transition ${isFavorite && "fill-red-500"}`} />
    </Button>
  );
}
