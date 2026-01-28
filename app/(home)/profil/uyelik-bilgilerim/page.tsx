import { auth } from "@/auth";
import { EditProfileForm } from "@/components/profile/edit/EditProfileForm";
import { User } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default async function UserInfoPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/giris-yap?redirectURL=/profil/uyelik-bilgilerim");
  }

  return (
    <>
      <header className="pt-4">
        <h2 className="text-xl text-muted-foreground sr-only">HESABIM</h2>
        <div className="flex h-12">
          <div className="flex items-center rounded bg-muted-foreground justify-center aspect-square">
            <User className="text-background" />
          </div>
          <div className="flex flex-col justify-center flex-1 px-4">
            <div className="flex items-center gap-1">
              <p className="font-semibold capitalize">{session.user.name}</p>
              <RiVerifiedBadgeFill className="text-violet-700 size-4" />
            </div>

            <p className="text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </div>
      </header>
      <section className="flex flex-col gap-4">
        <header>
          <h3 className="text-violet-700 leading-none font-medium">
            ÜYELİK BİLGİLERİM
          </h3>
        </header>
        <EditProfileForm name={session?.user.name} />
      </section>
    </>
  );
}
