"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { UserInfoField } from "./fields/UserInfoField";
import { AddressFormValues, addressSchema } from "@/schemas/address";
import { ContactField } from "./fields/ContactField";
import { CityInfoField } from "./fields/CityInfoField";
import { OpenAddressField } from "./fields/OpenAddressField";
import { SameAddressField } from "./fields/SameAddressField";
import { UserTypeField } from "./fields/UserTypeField";
import { CorporateInfoField } from "./fields/CorporateInfoField";
import { useEffect } from "react";
import { UserInfoBillField } from "./fields/UserInfoBillField";
import { ContactBillField } from "./fields/ContactBillField";
import { CityInfoBillField } from "./fields/CityInfoBillField";
import { OpenAddressBillField } from "./fields/OpenAddressBillField";
import { addAddress } from "@/actions/profile/address/addAdress";
import { toast } from "sonner";
import { DefaultAddressField } from "./fields/DefaultAddressField";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { editAddress } from "@/actions/profile/address/editAddress";

export function AddAddressForm({
  isEditing = false,
  address,
  addressId,
}: {
  isEditing: boolean;
  address?: AddressFormValues;
  addressId?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    mode: "onSubmit",
    shouldUnregister: true,
    defaultValues: address || {
      isDefault: true,
      name: "",
      surname: "",
      phone: "",
      addressLine: "",
      sameAddress: true,
      userType: "individual",
    },
  });

  async function onSubmit(data: z.infer<typeof addressSchema>) {
    if (!isEditing) {
      const res = await addAddress(data);
      if (res.success) {
        router.push("/profil/adreslerim");
      } else {
        toast.error(res.message);
      }
    } else {
      if (!addressId) return;
      const res = await editAddress(data, addressId);
      if (res.success) {
        router.push("/profil/adreslerim");
      } else {
        toast.error(res.message);
      }
    }
  }

  const userType = form.watch("userType");
  const sameAddress = form.watch("sameAddress");

  useEffect(() => {
    if (userType === "individual") {
      form.resetField("firmName");
      form.resetField("taxOffice");
      form.resetField("taxId");
    }
  }, [userType, form]);

  return (
    <div className="flex flex-col gap-3">
      <form
        id="create-address-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FieldSet className="gap-3">
          <FieldLegend className="text-sm! mb-2">
            Teslimat Bilgileri
          </FieldLegend>
          <FieldDescription className="text-sm">
            Siparişlerinizi eksiksiz bir şekilde teslim edebilmek için teslimat
            bilgilerinize ihtiyacımız var
          </FieldDescription>
          <DefaultAddressField form={form} />
          <UserInfoField form={form} />
          <ContactField form={form} />
          <CityInfoField form={form} isEditing={isEditing} />
          <OpenAddressField form={form} />
          <SameAddressField form={form} />
        </FieldSet>
        <FieldSet className="gap-3">
          <FieldLegend className="text-sm! mb-2">Fatura Bilgilerim</FieldLegend>
          <FieldDescription className="text-sm">
            Fatura tipi seçiniz
          </FieldDescription>
          <UserTypeField form={form} />
          {userType === "corporate" && <CorporateInfoField form={form} />}
        </FieldSet>
        {!sameAddress && (
          <FieldSet className="gap-3">
            <FieldLegend className="text-sm! mb-2">
              Fatura Bilgileri
            </FieldLegend>
            <FieldDescription className="text-sm">
              Faturanızın gönderileceği adres bilgilerini giriniz
            </FieldDescription>
            <UserInfoBillField form={form} />
            <ContactBillField form={form} />
            <CityInfoBillField form={form} isEditing={isEditing} />
            <OpenAddressBillField form={form} />
          </FieldSet>
        )}
      </form>

      <div className="flex justify-end gap-2">
        <Field className="w-24">
          <Button
            variant="default"
            size="sm"
            type="submit"
            form="create-address-form"
            className="rounded bg-green-700 hover:bg-green-600 hover:cursor-pointer font-normal"
            disabled={
              !form.formState.isDirty ||
              form.formState.isSubmitting ||
              form.formState.isLoading
            }
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="size-3 text-muted animate-spin" />
            ) : isEditing ? (
              "DÜZENLE"
            ) : (
              "EKLE"
            )}
          </Button>
        </Field>
      </div>
    </div>
  );
}
