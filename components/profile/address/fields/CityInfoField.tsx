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

export function CityInfoField({
  form,
  isEditing,
}: {
  form: UseFormReturn<AddressFormValues>;
  isEditing?: boolean;
}) {
  const province = form.watch("province");

  useEffect(() => {
    if (!province) return;

    form.setValue("district", isEditing ? form.getValues("district") : "", {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });

    form.clearErrors("district");
  }, [province, form, isEditing]);

  const districts = province ? (districtsByProvince[province] ?? []) : [];
  return (
    <FieldGroup className="flex-row gap-2">
      <Controller
        name="province"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="province" className="text-muted-foreground">
              İL
            </FieldLabel>
            <Select
              {...field}
              onValueChange={(v) => form.setValue("province", v)}
            >
              <SelectTrigger className="rounded hover:cursor-pointer">
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
        name="district"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="district" className="text-muted-foreground">
              İLÇE
            </FieldLabel>
            <Select
              {...field}
              value={form.watch("district") || ""}
              disabled={!districts.length}
              onValueChange={(v) =>
                form.setValue("district", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="rounded hover:cursor-pointer">
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
