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

export function UserInfoBillField({
  form,
}: {
  form: UseFormReturn<AddressFormValues>;
}) {
  return (
    <FieldGroup className="flex-row gap-2">
      <Controller
        name="nameBill"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="nameBill" className="text-muted-foreground">
              AD
            </FieldLabel>
            <Input
              {...field}
              id="nameBill"
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
        name="surnameBill"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="surnameBill" className="text-muted-foreground">
              SOYAD
            </FieldLabel>
            <Input
              {...field}
              id="surnameBill"
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
