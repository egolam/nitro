import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 text-sm">
        <header className="flex px-4 bg-sidebar border-b h-12 items-center">
          <SidebarTrigger />
        </header>

        {children}
      </main>
    </SidebarProvider>
  );
}
