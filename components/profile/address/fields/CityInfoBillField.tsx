import { Controller, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { addressSchema } from "@/schemas/address";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { districtsByProvince, provinces } from "@/lib/locations";

type AddressFormValues = z.infer<typeof addressSchema>;

export function CityInfoBillField({
  form,
  isEditing,
}: {
  form: UseFormReturn<AddressFormValues>;
  isEditing?: boolean;
}) {
  const province = form.watch("provinceBill");

  useEffect(() => {
    if (!province) return;

    form.setValue("districtBill", isEditing ? form.getValues("districtBill") : "", {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });

    form.clearErrors("districtBill");
  }, [province, form, isEditing]);

  const districts = province ? (districtsByProvince[province] ?? []) : [];
  return (
    <FieldGroup className="flex-row gap-2">
      <Controller
        name="provinceBill"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="provinceBill"
              className="text-muted-foreground"
            >
              İL
            </FieldLabel>
            <Select
              {...field}
              onValueChange={(v) => form.setValue("provinceBill", v)}
            >
              <SelectTrigger className="rounded">
                <SelectValue placeholder="İl seçiniz" />
              </SelectTrigger>
              <SelectContent className="rounded">
                {provinces.map((p) => (
                  <SelectItem key={p} value={String(p)}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} className="text-xs" />
            )}
          </Field>
        )}
      />
      <Controller
        name="districtBill"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="districtBill"
              className="text-muted-foreground"
            >
              İLÇE
            </FieldLabel>
            <Select
              {...field}
              value={form.watch("districtBill") || ""}
              disabled={!districts.length}
              onValueChange={(v) =>
                form.setValue("districtBill", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="rounded">
                <SelectValue placeholder="İlçe seçiniz" />
              </SelectTrigger>
              <SelectContent className="rounded">
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} className="text-xs" />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
