import { UserAddress } from "@/db/schema";
import { cn } from "@/lib/utils";
import { AddressActionButtons } from "./AddressActionButtons";

export function AddressItem({ item }: { item: UserAddress }) {
  return (
    <div
      key={item.id}
      className={cn(
        "text-sm border rounded p-2 bg-background flex flex-col gap-2",
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-sm text-muted-foreground truncate">
            Teslimat Adresi
          </h4>
          {item.isDefault && (
            <div className="text-sm bg-violet-700 text-muted px-2 rounded-xs">
              Varsayılan
            </div>
          )}
        </div>
        <div className="pl-2">
          <p className="truncate pt-1">{item.addressLine}</p>
          <div className="flex gap-2">
            <p className="capitalize truncate">{item.district}</p>
            <span>/</span>
            <p className=" truncate">{item.province.toLocaleUpperCase()}</p>
          </div>
        </div>
      </div>
      {item.sameAddress ? (
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-muted-foreground truncate">
              Fatura Adresi (
              {item.userType === "individual" ? "Bireysel" : "Kurumsal"})
            </h4>
          </div>
          <div className="pl-2">
            <p className="truncate pt-1">{item.addressLine}</p>
            <div className="flex gap-2">
              <p className="capitalize truncate">{item.district}</p>
              <span>/</span>
              <p className=" truncate">{item.province.toLocaleUpperCase()}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-xs text-muted-foreground truncate">
              Fatura Adresi (
              {item.userType === "individual" ? "Bireysel" : "Kurumsal"})
            </h4>
          </div>
          <div className="pl-2">
            <p className="truncate pt-1">{item.addressLineBill}</p>
            <div className="flex gap-2">
              <p className="capitalize truncate">{item.districtBill}</p>
              <span>/</span>
              <p className=" truncate">
                {item.provinceBill.toLocaleUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}
      <AddressActionButtons id={item.id} />
    </div>
  );
}
