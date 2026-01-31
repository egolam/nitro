"use client";

import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { handleFirstName } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

const nameRegexTR = /^[A-Za-zÇĞİÖŞÜçğıöşü]+(?:[ '\-][A-Za-zÇĞİÖŞÜçğıöşü]+)*$/;

const magicSchema = z.object({
  name: z
    .string({ error: "Geçerli bir ad girin" })
    .trim()
    .min(2, { error: "En az 2 harften oluşmalı" })
    .max(64, { error: "En fazla 64 harften oluşabilir" })
    .regex(nameRegexTR, { error: "Geçerli bir ad girin" }),

  surname: z
    .string({ error: "Geçerli bir soyad girin" })
    .trim()
    .min(2, { error: "En az 2 harften oluşmalı" })
    .max(64, { error: "En fazla 64 harften oluşabilir" })
    .regex(nameRegexTR, { error: "Geçerli bir soyad girin" }),
});

export function EditProfileForm({ name }: { name: string | undefined }) {
  const nameArr = !name ? [""] : name.split(" ");

  const firstName = handleFirstName(nameArr);
  const lastName = nameArr[nameArr.length - 1];

  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof magicSchema>>({
    resolver: zodResolver(magicSchema),
    defaultValues: {
      name: firstName,
      surname: nameArr.length < 2 ? "" : lastName,
    },
  });

  async function onSubmit(data: z.infer<typeof magicSchema>) {
    if (!isEditing || !form.formState.isDirty) return;

    const { error } = await authClient.updateUser({
      name: data.name + " " + data.surname,
    });

    if (error) {
      if (error.status === 429) {
        return toast.error(
          "Çok sık istek gönderiyorsunuz. Lütfen biraz bekleyip tekrar deneyin.",
        );
      }
      return toast.error(error.message);
    }

    setIsEditing(false);
    location.reload();
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <form
        id="edit-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FieldGroup className="flex-row gap-2">
          <Controller
            name="name"
            control={form.control}
            disabled={!isEditing}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name" className="text-muted-foreground">
                  AD
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="merhaba"
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
            name="surname"
            disabled={!isEditing}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="surname" className="text-muted-foreground">
                  SOYAD
                </FieldLabel>
                <Input
                  {...field}
                  id="surname"
                  aria-invalid={fieldState.invalid}
                  placeholder="maresans"
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
      </form>

      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-24 rounded bg-violet-700 font-normal hover:bg-violet-600 hover:cursor-pointer"
          >
            DÜZENLE
          </Button>
        ) : (
          <>
            <Field className="w-24">
              <Button
                variant="default"
                type="submit"
                form="edit-form"
                className="rounded bg-green-700 font-normal hover:bg-green-600 hover:cursor-pointer"
                disabled={
                  !form.formState.isDirty ||
                  form.formState.isSubmitting ||
                  form.formState.isLoading
                }
              >
                {form.formState.isSubmitting ? (
                  <LoaderCircle className="size-3 text-muted animate-spin" />
                ) : (
                  "EKLE"
                )}
              </Button>
            </Field>
            <Button
              type="button"
              onClick={() => {
                form.reset();
                setIsEditing(false);
              }}
              variant="destructive"
              className="w-24 rounded font-normal hover:cursor-pointer hover:bg-red-500"
            >
              İPTAL
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
