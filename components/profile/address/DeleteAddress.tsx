"use client";

import { deleteAddress } from "@/actions/profile/address/deleteAddress";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteAddress({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  function onDelete() {
    startTransition(async () => {
      const res = await deleteAddress(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  }
  return (
    <button
      onClick={onDelete}
      className="bg-destructive hover:bg-red-500 hover:cursor-pointer transition-colors size-6 flex items-center justify-center rounded-xs disabled:opacity-50"
      disabled={pending}
    >
      {pending ? (
        <LoaderCircle className="size-3 text-muted animate-spin" />
      ) : (
        <Trash2 className="size-3 text-muted" />
      )}
      <p className="sr-only">Adresi sil</p>
    </button>
  );
}
