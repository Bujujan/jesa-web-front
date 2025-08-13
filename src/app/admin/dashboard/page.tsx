"use client";

import InfoCards from "@/components/info-cards";
import ProjectTable from "@/components/projectTable";
import PunchTable from "@/components/punchTable";
import { SidebarProvider } from "@/components/ui/sidebar";
import UserTable from "@/components/userTable";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <SidebarProvider>
      <div className="flex flex-col w-full mt-6">
        <div>
          <h1 className="text-2xl font-bold pl-8 pb-4">
            Hello, {user ? user.firstName || user.fullName : "User"}!
          </h1>
        </div>
        <InfoCards />
        <PunchTable />
        <ProjectTable />
        <UserTable />
      </div>
    </SidebarProvider>
  );
}
