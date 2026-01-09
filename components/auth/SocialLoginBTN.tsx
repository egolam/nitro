import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SocialLoginBTN() {
  const [loading, setLoading] = useState(false);
  async function googleLogin() {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }

    setLoading(false);
  }

  return (
    <Button
      onClick={() => googleLogin()}
      type="button"
      variant="outline"
      disabled={loading}
      className={cn("w-full hover:cursor-pointer")}
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
