import { IoHomeSharp } from "react-icons/io5";
import { MobileNavbarItem } from "./MobileNavbarItem";
import { TbVaccineBottle } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const navItems = [
  { id: 3, href: "/", title: "ANA SAYFA", icon: <IoHomeSharp /> },
  { id: 2, href: "/esanslar", title: "ESANSLAR", icon: <TbVaccineBottle /> },
  { id: 1, href: "/profil", title: "PROFİL", icon: <FaUser /> },
  { id: 0, href: "/taleplerim", title: "TALEPLERİM", icon: <FaShoppingCart /> },
];

export function MobileNavbar() {
  return (
    <nav className="md:hidden fixed bottom-3.5 w-full left-1/2 -translate-x-1/2 shadow-lg bg-background border z-50">
      <ul className="flex items-center justify-center h-14">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="h-full flex-1 flex items-center justify-center"
          >
            <MobileNavbarItem
              href={item.href}
              title={item.title}
              icon={item.icon}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
