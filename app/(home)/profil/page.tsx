import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaAddressCard,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaComment,
} from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
const profileNav = [
  {
    id: 0,
    href: "/profil/uyelik-bilgilerim",
    title: "ÜYELİK BİLGİLERİM",
    icon: <FaAddressCard />,
  },
  {
    id: 1,
    href: "/profil/adreslerim",
    title: "ADRESLERİM",
    icon: <FaMapMarkerAlt />,
  },
  { id: 2, href: "/taleplerim", title: "TALEPLERİM", icon: <FaShoppingCart /> },
  {
    id: 3,
    href: "/profil/favorilerim",
    title: "FAVORİLERİM",
    icon: <MdFavorite />,
  },
  {
    id: 4,
    href: "/profil/yorumlarim",
    title: "YORUMLARIM",
    icon: <FaComment />,
  },
];

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/giris-yap");
  }

  return (
    <section className="flex-1 flex flex-col gap-4">
      <header className="">
        <h3 className="text-violet-700 leading-none font-medium">PROFİL</h3>
      </header>
      <nav>
        <ul className="grid grid-cols-1 text-sm gap-2">
          {profileNav.map((item) => (
            <li key={item.id} className="h-8 flex items-center justify-center">
              <Link
                href={item.href}
                className="w-full h-full rounded flex items-center [&_svg]:size-4 gap-2 text-muted-foreground hover:text-violet-700 transition-colors"
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <LogoutButton />
    </section>
  );
}
