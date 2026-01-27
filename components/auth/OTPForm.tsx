"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

const otpSchema = z.object({
  otp: z
    .string()
    .min(1, { error: "Boş bırakılamaz" })
    .regex(/^[0-9]+$/, "Doğrulama kodu rakamlardan oluşmalı")
    .length(6, "Doğrulama kodu 6 haneden oluşmalı"),
});

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const sp = useSearchParams();
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(data: z.infer<typeof otpSchema>) {
    const email = sp.get("eposta");
    if (!email) {
      return toast.error("Bir hata oluştu");
    }
    const { error } = await authClient.signIn.emailOtp({
      email,
      otp: data.otp,
    });

    if (error) {
      console.log(error);
      if (error.status === 429) {
        return toast.error(
          "Çok sık istek gönderiyorsunuz. Lütfen biraz bekleyip tekrar deneyin.",
        );
      }
      return toast.error(error.message);
    }

    router.replace(sp.get("redirectURL") || "/");
  }
  return (
    <Card {...props} className="w-full px-8 text-sm">
      <CardHeader>
        <CardTitle className="sr-only">Onay kodunu giriniz</CardTitle>
        <CardDescription className="sr-only">
          6 haneli onay kodunuzu e-postanıza gönderdik. Geçerlilik süresi 5
          dakikadır.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="otp-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-3">
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="otp"
                    className="text-2xl text-violet-700 font-semibold tracking-tighter"
                  >
                    DOĞRULAMA KODU
                  </FieldLabel>
                  <InputOTP
                    {...field}
                    id="otp"
                    aria-invalid={fieldState.invalid}
                    maxLength={6}
                    autoComplete="off"
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup className="w-full justify-between *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription className="font-medium">
                    E-postanıza gelen 6 haneli doğrulama kodunu giriniz
                  </FieldDescription>
                </Field>
              )}
            />
            <FieldGroup className="gap-3!">
              <Button
                type="submit"
                form="otp-form"
                className="w-full bg-violet-700 hover:cursor-pointer hover:bg-violet-800"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "ONAYLA"
                )}
              </Button>
              <FieldDescription className="text-right font-medium">
                Kod gelmedi mi?{" "}
                <Link href="/giris-yap" className="text-foreground">
                  Tekrar Gönder
                </Link>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
