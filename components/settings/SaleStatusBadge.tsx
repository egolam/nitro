import { getSettings } from "@/data/settings/getSettings";
import { cn } from "@/lib/utils";
import { Banknote, CircleCheck, ScrollText, Truck } from "lucide-react";

export async function SaleStatusBadge() {
  const settings = await getSettings();
  const status = settings?.saleStatus?.name || "open";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "open":
        return {
          label: "Talep Toplanıyor",
          bg: "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200",
          text: "text-yellow-700",
          icon: ScrollText,
        };
      case "partial":
        return {
          label: "Liste Oluşturuluyor",
          bg: "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200",
          text: "text-yellow-700",
          icon: ScrollText,
        };
      case "confirmed":
        return {
          label: "Listeler Onaylandı",
          bg: "bg-gradient-to-r from-lime-200 via-lime-300 to-lime-200",
          text: "text-lime-700",
          icon: CircleCheck,
        };
      case "payment":
        return {
          label: "Ödeme Bekleniyor",
          bg: "bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200",
          text: "text-blue-700",
          icon: Banknote,
        };
      case "completed":
        return {
          label: "Sipariş Oluşturuldu",
          bg: "bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200",
          text: "text-orange-700",
          icon: Truck,
        };
      default:
        return {
          label: status,
          bg: "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400",
          text: "text-foreground",
          icon: ScrollText,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={cn(
        "w-full flex items-center justify-between sm:justify-center sm:gap-2 h-9 px-4",
        config.bg,
        config.text,
      )}
    >
      <div className="flex items-center gap-2">
        <config.icon className="size-4" />
        <p className="text-sm whitespace-nowrap">Sipariş Durumu:</p>
      </div>

      <p className="text-sm whitespace-nowrap uppercase font-medium">
        {config.label}
      </p>
    </div>
  );
}
