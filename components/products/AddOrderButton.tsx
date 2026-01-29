"use client";
import { Button } from "../ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";
import { addOrderAction } from "@/actions/shop/orders/addOrderAction";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { ProductWithMeta } from "@/data/products/getProducts";

interface AddOrderButtonProps {
  productId: string;
  minBuyGrams: number;
  disabled?: boolean;
}

export function AddOrderButton({
  productId,
  minBuyGrams,
  disabled,
}: AddOrderButtonProps) {
  const { draftOrders, setDraftOrder, removeDraftOrder } = useOrderStore();
  const quantity = draftOrders[productId];
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleStart = () => {
    setDraftOrder(productId, minBuyGrams);
  };

  const handleIncrement = () => {
    setDraftOrder(productId, (quantity || 0) + minBuyGrams);
  };

  const handleDecrement = () => {
    if (quantity && quantity > minBuyGrams) {
      setDraftOrder(productId, quantity - minBuyGrams);
    } else {
      removeDraftOrder(productId);
    }
  };

  const handleConfirm = () => {
    if (!quantity) return;

    startTransition(async () => {
      const result = await addOrderAction(productId, quantity);
      if (result.error) {
        toast.error(result.error);
        removeDraftOrder(productId);
      } else {
        toast.success("Talep oluşturuldu");
        removeDraftOrder(productId);

        if (result.success && result.newTotalDemand !== undefined) {
          queryClient.setQueriesData<InfiniteData<{ data: ProductWithMeta[] }>>(
            { queryKey: ["products"] },
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.map((product) => {
                    if (product.id === productId) {
                      return {
                        ...product,
                        totalDemand: result.newTotalDemand!,
                        minBuyThreshold: result.minBuyThreshold!,
                      };
                    }
                    return product;
                  }),
                })),
              };
            },
          );
        }
      }
    });
  };

  if (!quantity) {
    return (
      <Button
        onClick={handleStart}
        disabled={disabled}
        className="flex-1 h-8 bg-violet-700 hover:cursor-pointer hover:bg-violet-600 rounded font-normal text-white"
      >
        TALEP EKLE
      </Button>
    );
  }

  return (
    <div className="flex-1 flex gap-2 h-8">
      <div className="flex items-center flex-1 bg-violet-50 rounded border border-violet-200 justify-between px-1">
        <button
          onClick={handleDecrement}
          disabled={isPending}
          className="p-1 hover:bg-violet-100 rounded text-violet-700 hover:cursor-pointer disabled:opacity-50"
        >
          <Minus size={14} />
        </button>
        <span className="text-xs font-medium text-violet-900">{quantity}g</span>
        <button
          onClick={handleIncrement}
          disabled={isPending}
          className="p-1 hover:bg-violet-100 rounded text-violet-700 hover:cursor-pointer disabled:opacity-50"
        >
          <Plus size={14} />
        </button>
      </div>
      <Button
        onClick={handleConfirm}
        disabled={isPending}
        className="w-12 h-8 bg-green-600 hover:bg-green-500 rounded text-white p-0 disabled:opacity-70"
      >
        <Check size={16} />
      </Button>
    </div>
  );
}
