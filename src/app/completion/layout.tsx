// app/dashboard/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex">
      <AppSidebar />
      <div className="flex flex-col w-full">
        <SiteHeader />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
