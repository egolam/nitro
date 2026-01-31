import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { getSettings } from "@/data/settings/getSettings";
import { db } from "@/db";
import { saleStatus } from "@/db/schema/sale_status";
import { settings } from "@/db/schema/settings";

export default async function SettingsPage() {
  const currentSettings = await getSettings();
  const allStatuses = await db.select().from(saleStatus);

  // Default values if no settings exist
  const defaultSettings = {
    id: 0,
    saleNumber: 0,
    discount: 0.2, // 20%
    vat: 0.2, // 20%
    profitMargin: 0.2, // 20%
    exchangeRate: 43.58,
    shippingPrice: 120,
    saleStatusId: allStatuses.find((s) => s.name === "open")?.id ?? null,
  };

  const initialSettings = currentSettings || defaultSettings;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-violet-700 leading-none">Ayarlar</h1>
      </div>
      <SettingsForm
        initialSettings={initialSettings as typeof settings.$inferSelect}
        saleStatuses={allStatuses}
      />
    </div>
  );
}
