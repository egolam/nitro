"use client";

import { updateSettingsAction } from "@/actions/admin/settings/updateSettingsAction";
import { settingsSchema } from "@/lib/schemas/settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { settings } from "@/db/schema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { InferSelectModel } from "drizzle-orm";
import { Loader2, LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Settings = InferSelectModel<typeof settings>;

type SaleStatus = {
  id: number;
  name: string;
  description: string | null;
};

interface SettingsFormProps {
  initialSettings: Settings;
  saleStatuses: SaleStatus[];
}

export function SettingsForm({
  initialSettings,
  saleStatuses,
}: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      saleNumber: initialSettings.saleNumber,
      discount: initialSettings.discount,
      vat: initialSettings.vat,
      profitMargin: initialSettings.profitMargin,
      exchangeRate: initialSettings.exchangeRate,
      shippingPrice: initialSettings.shippingPrice,
      saleStatusId: initialSettings.saleStatusId ?? undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof settingsSchema>) => {
    startTransition(async () => {
      // Ensure numbers are sent as numbers (HTML inputs might return strings if not handled carefully,
      // but react-hook-form with zodResolver typically handles types if input type is number)
      const res = await updateSettingsAction(data);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Ayarlar güncellendi");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sale Status Card */}
        <Card className="bg-background p-4 rounded border gap-4">
          <CardHeader>
            <CardTitle className="text-violet-700 font-medium uppercase">
              Alım Durumu
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Mevcut alım aşamasını belirleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="saleStatusId"
              render={({ field }) => (
                <Field className="relative">
                  <FieldContent>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(val) => field.onChange(parseInt(val))}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full hover:cursor-pointer">
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {saleStatuses.map((status) => (
                          <SelectItem
                            key={status.id}
                            value={status.id.toString()}
                            className="hover:cursor-pointer"
                          >
                            <span className="capitalize">
                              {status.name === "open"
                                ? "Talep Toplanıyor"
                                : status.name === "partial"
                                  ? "Liste Oluşturuluyor"
                                  : status.name === "confirmed"
                                    ? "Listeler Onaylandı"
                                    : status.name === "payment"
                                      ? "Ödeme Bekleniyor"
                                      : "Sipariş Oluşturuldu"}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                  <FieldError
                    className="absolute -top-5 right-0 text-right"
                    errors={[form.formState.errors.saleStatusId]}
                  />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Sale Number Card */}
        <Card className="bg-background p-4 rounded border gap-4">
          <CardHeader>
            <CardTitle className="text-violet-700 font-medium uppercase">
              Alım Numarası
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Takip için kullanılan alım no
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="saleNumber"
              render={({ field }) => (
                <Field className="relative">
                  <FieldContent>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={isPending}
                    />
                  </FieldContent>
                  <FieldError
                    className="absolute -top-5 right-0 text-right"
                    errors={[form.formState.errors.saleNumber]}
                  />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Exchange Rate Card */}
        <Card className="bg-background p-4 rounded border gap-4">
          <CardHeader>
            <CardTitle className="text-violet-700 font-medium uppercase">
              Döviz Kuru (USD)
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Güncel Dolar kuru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="exchangeRate"
              render={({ field }) => (
                <Field className="relative">
                  <FieldContent>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={isPending}
                    />
                  </FieldContent>
                  <FieldError
                    className="absolute -top-5 right-0 text-right"
                    errors={[form.formState.errors.exchangeRate]}
                  />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* VAT Card */}
        <Card className="bg-background p-4 rounded border gap-4">
          <CardHeader>
            <CardTitle className="text-violet-700 font-medium uppercase">
              KDV Oranı
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Örn: 0.20 (%20)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="vat"
              render={({ field }) => (
                <Field className="relative">
                  <FieldContent>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={isPending}
                    />
                  </FieldContent>
                  <FieldError
                    className="absolute -top-5 right-0 text-right"
                    errors={[form.formState.errors.vat]}
                  />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Discount Card */}
        <Card className="bg-background p-4 rounded border gap-4">
          <CardHeader>
            <CardTitle className="text-violet-700 font-medium uppercase">
              Liste İndirimi
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Örn: 0.25 (%25)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="discount"
              render={({ field }) => (
                <Field className="relative">
                  <FieldContent>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={isPending}
                    />
                  </FieldContent>
                  <FieldError
                    className="absolute -top-5 right-0 text-right"
                    errors={[form.formState.errors.discount]}
                  />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Profit Margin Card */}
        <Card className="bg-background p-4 rounded border gap-4">
          <CardHeader>
            <CardTitle className="text-violet-700 font-medium uppercase">
              Kar Marjı
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Örn: 0.20 (%20)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="profitMargin"
              render={({ field }) => (
                <Field className="relative">
                  <FieldContent>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={isPending}
                    />
                  </FieldContent>
                  <FieldError
                    className="absolute -top-5 right-0 text-right"
                    errors={[form.formState.errors.profitMargin]}
                  />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Shipping Price Card */}
        <Card className="bg-background p-4 rounded border gap-4">
          <CardHeader>
            <CardTitle className="text-violet-700 font-medium uppercase">
              Kargo Ücreti
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sabit kargo ücreti (TL)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="shippingPrice"
              render={({ field }) => (
                <Field className="relative">
                  <FieldContent>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled={isPending}
                    />
                  </FieldContent>
                  <FieldError
                    className="absolute -top-5 right-0 text-right"
                    errors={[form.formState.errors.shippingPrice]}
                  />
                </Field>
              )}
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-violet-700 rounded font-normal hover:bg-violet-600"
        >
          {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Kaydet
        </Button>
      </div>
    </form>
  );
}
