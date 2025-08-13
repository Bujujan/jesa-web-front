"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Anvil,
  BarChart3,
  Bug,
  Building2,
  Calendar,
  ChevronUp,
  CreditCard,
  FileText,
  Folder,
  FolderRoot,
  Gauge,
  Home,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  User2,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

import JesaLogo from "/public/assets/images/JESA_logo_tr.png"; // adjust path accordingly
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import { NavMain } from "./nav-main";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Gauge,
      isActive: true, // You can remove this since we calculate dynamically now
    },
    {
      title: "Projects",
      url: "/admin/dashboard/projets",
      icon: Folder,
      isActive: true, // You can remove this since we calculate dynamically now
    },
    {
      title: "Punches",
      url: "/admin/dashboard/punches",
      icon: Bug,
      isActive: true, // You can remove this since we calculate dynamically now
    },
    {
      title: "Agents",
      url: "/admin/dashboard/agents",
      icon: Users,
      isActive: true, // You can remove this since we calculate dynamically now
    },
    {
      title: "Systems",
      url: "/admin/dashboard/systems",
      icon: Anvil,
      isActive: true, // You can remove this since we calculate dynamically now
    },
    {
      title: "Assigned Projects",
      url: "/admin/dashboard/projectassign",
      icon: FolderRoot,
      isActive: true, // You can remove this since we calculate dynamically now
    },
  ],
  punch: [
    {
      title: "Performance",
      url: "#",
      icon: TrendingUp,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
    },
  ],
  agents: [
    {
      title: "Tickets",
      url: "#",
      icon: Calendar,
      badge: "15",
    },
    {
      title: "Agents",
      url: "/dashboard/analytics",
      icon: Users,
    },
    {
      title: "Customers",
      url: "#",
      icon: User2,
    },
  ],
  shop: [
    {
      title: "Products",
      url: "#",
      icon: Package,
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingCart,
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
    },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();

  // Helper function to check if this item should be active
  const isActive = (url: string) => {
    // If url is '#' consider it inactive (no route)
    if (url === "#") return false;
    // Exact match
    return pathname === url;
    // Or partial match example:
    // return pathname.startsWith(url);
  };

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-full" asChild>
              <div className="flex flex-col justify-center items-center gap-2 border-b py-6">
                <Image src={JesaLogo} alt="Jesa Logo" width={120} height={32} />
                {/* <span className="truncate text-xs">Punch Dashboard</span> */}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={[]} />
        {/* Nav Main */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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

        {/* Punches */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Punches</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.punch.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* Support */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Agents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.agents.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* Shop */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Shop</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.shop.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      <SidebarFooter>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu> */}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <NavUser />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
