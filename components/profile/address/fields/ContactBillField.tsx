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

export function ContactBillField({
  form,
}: {
  form: UseFormReturn<AddressFormValues>;
}) {
  return (
    <FieldGroup className="flex-row gap-2">
      <Controller
        name="phoneBill"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="phoneBill" className="text-muted-foreground">
              TELEFON
            </FieldLabel>
            <Input
              {...field}
              id="phoneBill"
              aria-invalid={fieldState.invalid}
              placeholder="5XXXXXXXXX"
              autoComplete="off"
              className="text-sm rounded bg-background"
              onChange={(e) => {
                const value = e.target.value.startsWith("0")
                  ? ""
                  : e.target.value.trim().replaceAll(" ", "");
                field.onChange(value);

                let phone = value.replace(/\D/g, "");
                if (phone.length > 10) {
                  phone = phone.substring(0, 10);
                  field.onChange(phone);
                }
                field.onChange(phone);
              }}
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
