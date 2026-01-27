import { Controller, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { addressSchema } from "@/schemas/address";
import { Textarea } from "@/components/ui/textarea";

type AddressFormValues = z.infer<typeof addressSchema>;

export function OpenAddressBillField({
  form,
}: {
  form: UseFormReturn<AddressFormValues>;
}) {
  return (
    <FieldGroup className="flex-row gap-2">
      <Controller
        name="addressLineBill"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="addressLineBill"
              className="text-muted-foreground"
            >
              ADRES
            </FieldLabel>
            <Textarea
              {...field}
              id="addressLineBill"
              placeholder=""
              className="rounded"
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
