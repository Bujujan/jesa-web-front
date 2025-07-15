import { AppSidebar } from "@/components/app-sidebar";
import InfoCards from "@/components/info-cards";
import { NavSecondary } from "@/components/nav-secondary";
import PunchTable from "@/components/punchTable";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserTable from "@/components/userTable";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <AppSidebar />
    // </div>
    <SidebarProvider>
      <div className="flex flex-col w-full mt-20">
        <div>
          <h1 className="text-2xl font-bold pl-8 pb-4">Hello, User!</h1>
        </div>
        <InfoCards />
        <PunchTable />
        <UserTable />
      </div>
    </SidebarProvider>
  );
}
