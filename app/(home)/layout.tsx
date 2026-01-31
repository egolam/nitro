import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { MobileNavbar } from "@/components/navbar/MobileNavbar";
import { AppSidebar } from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider className="flex-col">
        <AppSidebar />
        <Header />
        <main className="px-4 xl:px-0 flex-1 flex justify-center min-h-[calc(100vh-7.75rem)]">
          {children}
        </main>
        <MobileNavbar />
        <Footer />
      </SidebarProvider>
    </div>
  );
}
