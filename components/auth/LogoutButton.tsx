"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }
  return (
    <Button
      onClick={() => logout()}
      type="button"
      variant="secondary"
      className="rounded w-fit hover:cursor-pointer p-0 h-8 text-destructive hover:underline"
    >
      ÇIKIŞ YAP
    </Button>
  );
}
