"use client";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { SocialLoginBTN } from "./SocialLoginBTN";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const magicSchema = z.object({
  email: z.email({ error: "Geçerli bir e-posta giriniz" }),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof magicSchema>>({
    resolver: zodResolver(magicSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof magicSchema>) {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: data.email,
      type: "sign-in",
    });

    if (error) {
      if (error.status === 429) {
        return toast.error(
          "Çok sık istek gönderiyorsunuz. Lütfen biraz bekleyip tekrar deneyin."
        );
      }
      return toast.error(error.message);
    }

    router.replace(`/otp-dogrulama?eposta=${data.email}`);
  }

  return (
    <Card className="w-full px-8 gap-4">
      <CardHeader>
        <CardTitle className="text-2xl text-violet-700 font-semibold tracking-tighter">
          MARESANS{" "}
          <span className="text-sm text-violet-700 tracking-normal">
            &apos;a hoş geldiniz
          </span>
        </CardTitle>
        <CardDescription className="text-sm">
          Şifresiz giriş yapmak için lütfen e-postanızı giriniz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="magic-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="magic">E-POSTA</FieldLabel>
                  <Input
                    {...field}
                    id="magic"
                    aria-invalid={fieldState.invalid}
                    placeholder="merhaba@marsans.com"
                    autoComplete="off"
                    className="text-sm"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Field orientation="horizontal">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full bg-violet-700 hover:cursor-pointer hover:bg-violet-800"
            form="magic-form"
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "GİRİŞ YAP"
            )}
          </Button>
        </Field>
        <FieldSeparator className="w-full">Ya da</FieldSeparator>
        <Field orientation="horizontal">
          <SocialLoginBTN state={form.formState.isSubmitting} />
        </Field>
      </CardFooter>
    </Card>
  );
}
