import {
  Calculator,
  Calendar,
  CircleQuestionMark,
  Grid,
  Grid2X2,
  Home,
  Inbox,
  Mars,
  Search,
  Settings,
  Venus,
  VenusAndMars,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "TÜM ESANSLAR",
    url: "/",
    icon: Grid2X2,
  },
  {
    title: "ERKEK",
    url: "/esanslar/erkek",
    icon: Mars,
  },
  {
    title: "KADIN",
    url: "/esanslar/kadin",
    icon: Venus,
  },
  {
    title: "UNISEX",
    url: "/esanslar/unisex",
    icon: VenusAndMars,
  },
];

const tools = [
  {
    title: "PARFÜM HESAPLAMA ARACI",
    url: "https://formulasyon.com",
    icon: Calculator,
  },
  {
    title: "S.S.S.",
    url: "/sikca-sorulan-sorular",
    icon: CircleQuestionMark,
  },
  {
    title: "HAKKIMIZDA",
    url: "/hakkimizda",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar side="left">
      <SidebarHeader className="">
        <SidebarTrigger className="text-violet-700 hover:cursor-pointer rounded hover:text-violet-500" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>KATEGORİLER</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-transparent">
                    <Link
                      href={item.url}
                      className="text-muted-foreground hover:text-violet-700 transition-colors"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>FAYDALI LİNKLER</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-transparent">
                    <Link
                      href={item.url}
                      target={
                        item.url === "https://formulasyon.com"
                          ? "_blank"
                          : "_self"
                      }
                      className="text-muted-foreground hover:text-violet-700 transition-colors"
                    >
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
