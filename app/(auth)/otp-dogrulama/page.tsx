import { auth } from "@/auth";
import { OTPForm } from "@/components/auth/OTPForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OTPVerificationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <OTPForm />;
}
