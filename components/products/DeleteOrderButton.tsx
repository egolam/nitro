"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteOrderAction } from "@/actions/shop/orders/deleteOrderAction";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteOrderButtonProps {
  productId: string;
}

export function DeleteOrderButton({ productId }: DeleteOrderButtonProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    // Optional: Add window.confirm for safety, though user asked for "soft" which implies undoable/less risk, but cancellation usually needs confirm.
    // I'll skip confirm for now or add a simple browser confirm.
    if (!confirm("Talebi iptal etmek istediğinize emin misiniz?")) return;

    startTransition(async () => {
      const result = await deleteOrderAction(productId);
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Talep iptal edildi");
      } else {
        toast.error(result.error || "Hata oluştu");
      }
    });
  };

  return (
    <Button
      size="icon"
      className="size-9 rounded-xs text-destructive bg-transparent hover:bg-destructive/10 hover:cursor-pointer"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Talebi İptal Et</span>
    </Button>
  );
}
