import { auth } from "@/auth";
import { EditProfileForm } from "@/components/profile/edit/EditProfileForm";
import { User } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
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
    <div className="flex flex-col gap-4 bg-background border rounded">
      <div className="flex flex-col border-b p-4 relative">
        <div className="flex gap-4">
          <div className="relative flex h-12 aspect-square items-center rounded justify-center overflow-hidden bg-muted-foreground">
            {!session.user.image ? (
              <User className="size-6 text-muted" />
            ) : (
              <Image
                src={session.user.image}
                alt="user-photo"
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-1">
              <p className="font-semibold capitalize">{session.user.name}</p>
              <RiVerifiedBadgeFill className="text-violet-700 size-4" />
            </div>

            <p className="text-sm text-muted-foreground leading-none">
              {session.user.email}
            </p>
          </div>
        </div>

        <div className="absolute right-1 md:right-2 bottom-0 md:bottom-1 flex justify-end items-end text-xs sm:text-sm gap-1 text-muted-foreground h-full">
          <p className="italic text-xs">Katıldığı tarih:</p>
          <p className="">
            {new Date(session.user.createdAt).toLocaleDateString("tr-TR")}
          </p>
        </div>
      </div>
      <EditProfileForm name={session?.user.name} />
    </div>
  );
}
