import { Controller, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addressSchema } from "@/schemas/address";

type AddressFormValues = z.infer<typeof addressSchema>;

export function CorporateInfoField({
  form,
}: {
  form: UseFormReturn<AddressFormValues>;
}) {
  return (
    <FieldGroup className="gap-2">
      <Controller
        name="firmName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="firmName" className="text-muted-foreground">
              FİRMA ADI
            </FieldLabel>
            <Input
              {...field}
              id="firmName"
              aria-invalid={fieldState.invalid}
              placeholder=""
              autoComplete="off"
              className="text-sm rounded bg-background"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} className="text-xs" />
            )}
          </Field>
        )}
      />
      <Controller
        name="taxOffice"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="taxOffice" className="text-muted-foreground">
              VERGİ DAİRESİ
            </FieldLabel>
            <Input
              {...field}
              id="taxOffice"
              aria-invalid={fieldState.invalid}
              placeholder=""
              autoComplete="off"
              className="text-sm rounded bg-background"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} className="text-xs" />
            )}
          </Field>
        )}
      />
      <Controller
        name="taxId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="taxId" className="text-muted-foreground">
              VERGİ NUMARASI
            </FieldLabel>
            <Input
              {...field}
              id="taxId"
              aria-invalid={fieldState.invalid}
              placeholder=""
              autoComplete="off"
              className="text-sm rounded bg-background"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} className="text-xs" />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
