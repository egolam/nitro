import { Pencil } from "lucide-react";
import { DeleteAddress } from "./DeleteAddress";
import Link from "next/link";

export function AddressActionButtons({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <DeleteAddress id={id} />
      <Link
        href={`/profil/adreslerim/adres-duzenle?id=${id}`}
        className="bg-yellow-500 transition-colors hover:bg-yellow-400 size-6 flex items-center justify-center rounded-xs"
      >
        <p className="sr-only">Adresi düzenle</p>
        <Pencil className="size-3 text-muted" />
      </Link>
    </div>
  );
}
