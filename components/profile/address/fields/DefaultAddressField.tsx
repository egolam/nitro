import { Controller, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import { addressSchema } from "@/schemas/address";
import { Checkbox } from "@/components/ui/checkbox";

type AddressFormValues = z.infer<typeof addressSchema>;

export function DefaultAddressField({
  form,
}: {
  form: UseFormReturn<AddressFormValues>;
}) {
  return (
    <FieldGroup className="flex-row gap-2">
      <Controller
        name="isDefault"
        control={form.control}
        render={({ field }) => (
          <FieldLabel
            className="rounded bg-background hover:cursor-pointer"
            htmlFor="defaultAddress"
          >
            <Field orientation="horizontal">
              <Checkbox
                id="defaultAddress"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldTitle className="font-semibold">
                  Varsayılan Adres
                </FieldTitle>
                <FieldDescription className="text-sm">
                  Siparişlerimde bu adres kullanılsın
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        )}
      />
    </FieldGroup>
  );
}
