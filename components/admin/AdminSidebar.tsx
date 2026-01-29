import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Genel Bakış",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Ürünler",
    url: "/admin/products",
    icon: Inbox,
  },
  {
    title: "Talepler",
    url: "/admin/orders",
    icon: Calendar,
  },
  {
    title: "Kullanıcılar",
    url: "/admin/users",
    icon: Search,
  },
  {
    title: "Ayarlar",
    url: "/admin/ayarlar",
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ADMİN PANELİ</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
