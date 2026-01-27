import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SocialLoginBTN({ state }: { state: boolean }) {
  const [loading, setLoading] = useState(false);
  async function googleLogin() {
    if (state === true) {
      return;
    }
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      if (error.status === 429) {
        setLoading(false);
        return toast.error(
          "Bu kadar sık istek göndremezsiniz. Lütfen biraz bekleyin.",
        );
      }
      setLoading(false);
      return toast.error(error.message);
    }

    setLoading(false);
  }

  return (
    <Button
      onClick={() => googleLogin()}
      type="button"
      variant="outline"
      disabled={loading || state === true}
      className={cn(
        "w-full rounded hover:cursor-pointer hover:underline hover:bg-background font-normal",
      )}
    >
      {loading ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <>
          <FaGoogle />
          Google ile devam et
        </>
      )}
    </Button>
  );
}
