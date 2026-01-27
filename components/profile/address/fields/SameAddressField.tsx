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

export function SameAddressField({
  form,
}: {
  form: UseFormReturn<AddressFormValues>;
}) {
  return (
    <FieldGroup className="flex-row gap-2">
      <Controller
        name="sameAddress"
        control={form.control}
        render={({ field }) => (
          <FieldLabel className="rounded bg-background" htmlFor="sameAddress">
            <Field orientation="horizontal">
              <Checkbox
                id="sameAddress"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldTitle className="font-semibold">
                  Bu adresi fatura bilgilerimde de kullan
                </FieldTitle>
                <FieldDescription className="text-sm">
                  Fatura için seçilen adres sadece bilgi amaçlıdır. Ürünlerimiz
                  “Teslimat adresi” bölümünde belirttiğiniz adrese teslim
                  edilir.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        )}
      />
    </FieldGroup>
  );
}
