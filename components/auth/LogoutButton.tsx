"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ImExit } from "react-icons/im";

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
    <button
      onClick={() => logout()}
      type="button"
      className="flex items-center gap-4 h-9 px-4 text-destructive hover:underline hover:cursor-pointer"
    >
      <ImExit />
      ÇIKIŞ YAP
    </button>
  );
}
