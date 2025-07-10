import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/DataTable";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserTable from "@/components/userTable";
import { Sidebar } from "lucide-react";
import App from "next/app";
import Image from "next/image";

export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <AppSidebar />
    // </div>
    <SidebarProvider>
      <AppSidebar />
      <UserTable />
    </SidebarProvider>
  );
}
