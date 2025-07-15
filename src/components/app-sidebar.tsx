"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronUp,
  CreditCard,
  FileText,
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
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
              <div className="flex flex-col justify-left items-start gap-2">
                <Image src={JesaLogo} alt="Jesa Logo" width={100} height={32} />
                {/* <span className="truncate text-xs">Punch Dashboard</span> */}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
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

        {/* Analytics */}
        <SidebarGroup>
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
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
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
        </SidebarGroup>

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
          <NavUser
            user={{
              name: "John Doe",
              email: "0J5fW@example.com",
              avatar: "https://github.com/shadcn.png",
            }}
          />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
