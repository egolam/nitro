import { Controller, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { addressSchema } from "@/schemas/address";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type AddressFormValues = z.infer<typeof addressSchema>;

export function UserTypeField({
  form,
}: {
  form: UseFormReturn<AddressFormValues>;
}) {
  return (
    <Controller
      name="userType"
      control={form.control}
      render={({ field }) => (
        <RadioGroup
          name={field.name}
          defaultValue="individual"
          className="max-w-sm flex"
          value={field.value}
          onValueChange={field.onChange}
        >
          <FieldLabel
            htmlFor="individual"
            className="bg-background rounded [&>*]:data-[slot=field]:p-0 h-9 flex justify-center hover:cursor-pointer"
          >
            <Field orientation="horizontal" className="">
              <FieldContent className="flex items-center">
                <FieldTitle>Bireysel</FieldTitle>
              </FieldContent>
              <RadioGroupItem
                value="individual"
                id="individual"
                className="hidden"
              />
            </Field>
          </FieldLabel>
          <FieldLabel
            htmlFor="corporate"
            className="bg-background rounded [&>*]:data-[slot=field]:p-0 h-9 flex justify-center hover:cursor-pointer"
          >
            <Field orientation="horizontal" className="">
              <FieldContent className="flex items-center">
                <FieldTitle>Kurumsal</FieldTitle>
              </FieldContent>
              <RadioGroupItem
                value="corporate"
                id="corporate"
                className="hidden"
              />
            </Field>
          </FieldLabel>
        </RadioGroup>
      )}
    />
  );
}
